// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title HashQuest
 * @dev Pure on-chain play-to-earn trivia game for Hedera network
 * @notice HashQuest - The ultimate blockchain trivia experience on Hedera
 */
contract HashQuest is Ownable, ReentrancyGuard, Pausable, AccessControl {
    using Address for address payable;
    
    // Role definitions
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant QUESTION_MANAGER_ROLE = keccak256("QUESTION_MANAGER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // Enums
    enum Difficulty { Easy, Medium, Hard, Expert, Master }
    enum QuestionStatus { Active, Deactivated }
    
    // Structs
    struct Question {
        string questionText;
        string[4] options;
        uint8 correctAnswer;
        uint256 reward;
        QuestionStatus status;
        Difficulty difficulty;
        address creator;
        uint256 createdAtBlock;
        uint32 timesAnswered;
        uint32 timesCorrect;
    }
    
    struct Player {
        uint256 totalEarnings;
        uint256 questionsAnswered;
        uint256 correctAnswers;
        uint256 streak;
        uint256 maxStreak;
        uint256 lastAnswerBlock;
        uint256 totalResponseTime;
        mapping(uint256 => bool) answeredQuestions;
        mapping(uint256 => uint256) questionStartBlock;
    }
    
    struct GameSession {
        address player;
        uint256 questionId;
        uint256 blockNumber;
        uint8 playerAnswer;
        bool isCorrect;
        uint256 rewardEarned;
        uint256 responseBlocks;
        bytes32 sessionHash;
    }
    
    struct LeaderboardEntry {
        address player;
        uint256 totalEarnings;
        uint256 accuracy;
        uint256 maxStreak;
    }
    
    // State variables
    mapping(uint256 => Question) public questions;
    mapping(address => Player) public players;
    mapping(address => uint256[]) public playerSessions;
    mapping(address => bool) public blacklistedPlayers;
    GameSession[] public gameSessions;
    
    // Random seed management for secure deterministic randomness
    uint256 private randomSeed;
    uint256 private lastRandomBlock;
    mapping(address => uint256) private playerNonces;
    
    uint256 public nextQuestionId;
    uint256 public totalActiveQuestions;
    uint256 public totalRewardsPaid;
    
    // Game parameters (all block-based)
    uint256 public baseReward = 1000000000000000; // 0.001 HBAR in wei
    uint256 public streakMultiplier = 110; // 10% bonus per streak
    uint256 public maxStreakBonus = 300; // Maximum 300% bonus
    uint256 public cooldownBlocks = 20; // ~5 minutes
    uint256 public maxRewardPerSession = 10000000000000000; // 0.01 HBAR
    uint256 public minContractBalance = 100000000000000000; // 0.1 HBAR
    uint256 public maxDailyRewards = 1000000000000000000; // 1 HBAR per day
    uint256 public minAnswerBlocks = 1;
    uint256 public maxAnswerBlocks = 40; // ~10 minutes
    
    // Security parameters
    uint256 public minResponseBlocksForSpeedBonus = 2;
    
    // Constants
    uint256 public constant MIN_QUESTION_LENGTH = 10;
    uint256 public constant MAX_QUESTION_LENGTH = 500;
    uint256 public constant MAX_BATCH_SIZE = 10;
    uint256 public constant ACCURACY_PRECISION = 10000;
    uint256 public constant BLOCKS_PER_DAY = 5760; // Approximate
    
    // Circuit breakers
    bool public emergencyStop = false;
    mapping(address => mapping(uint256 => uint256)) public dailyRewards;
    
    // Events
    event QuestionSubmitted(
        uint256 indexed questionId, 
        Difficulty indexed difficulty, 
        address indexed creator,
        uint256 blockNumber
    );
    event QuestionServed(
        address indexed player,
        uint256 indexed questionId,
        uint256 blockNumber
    );
    event QuestionAnswered(
        address indexed player, 
        uint256 indexed questionId, 
        bool indexed isCorrect, 
        uint256 rewardEarned,
        uint256 streak,
        uint256 responseBlocks,
        bytes32 sessionHash
    );
    event RewardClaimed(address indexed player, uint256 amount, bytes32 sessionHash);
    event EmergencyAction(
        address indexed admin,
        string action,
        address indexed target,
        uint256 blockNumber
    );
    event ContractFunded(address indexed funder, uint256 amount);
    event PlayerBlacklisted(address indexed player, string reason);
    event PlayerWhitelisted(address indexed player);
    
    // Custom errors
    error QuestionNotFound(uint256 questionId);
    error QuestionNotActive(uint256 questionId);
    error CooldownNotPassed(uint256 remainingBlocks);
    error PlayerIsBlacklisted();
    error EmergencyStopActive();
    error InvalidAnswer(uint8 answer);
    error QuestionAlreadyAnswered(uint256 questionId);
    error DailyLimitExceeded(uint256 requested, uint256 remaining);
    error InsufficientContractBalance(uint256 required, uint256 available);
    error InvalidAnswerTiming(uint256 blocksTaken);
    error NoQuestionsAvailable();
    error InsufficientFunds(uint256 requested, uint256 available);
    
    // Modifiers
    modifier validActiveQuestion(uint256 _questionId) {
        if (_questionId >= nextQuestionId) revert QuestionNotFound(_questionId);
        if (questions[_questionId].status != QuestionStatus.Active) revert QuestionNotActive(_questionId);
        _;
    }
    
    modifier cooldownPassed(address _player) {
        uint256 blocksPassed = block.number - players[_player].lastAnswerBlock;
        if (blocksPassed < cooldownBlocks) {
            revert CooldownNotPassed(cooldownBlocks - blocksPassed);
        }
        _;
    }
    
    modifier notBlacklisted(address _player) {
        if (blacklistedPlayers[_player]) revert PlayerIsBlacklisted();
        _;
    }
    
    modifier notEmergencyStop() {
        if (emergencyStop) revert EmergencyStopActive();
        _;
    }
    
    modifier validAnswerTiming(address _player, uint256 _questionId) {
        uint256 questionStartBlock = players[_player].questionStartBlock[_questionId];
        if (questionStartBlock == 0) revert InvalidAnswerTiming(0);
        
        uint256 blocksTaken = block.number - questionStartBlock;
        if (blocksTaken < minAnswerBlocks || blocksTaken > maxAnswerBlocks) {
            revert InvalidAnswerTiming(blocksTaken);
        }
        _;
    }
    
    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MODERATOR_ROLE, initialOwner);
        _grantRole(QUESTION_MANAGER_ROLE, initialOwner);
        _grantRole(EMERGENCY_ROLE, initialOwner);
        
        // Initialize random seed with secure initial value
        randomSeed = uint256(keccak256(abi.encodePacked(
            block.number,
            block.prevrandao,
            msg.sender,
            address(this)
        )));
        lastRandomBlock = block.number;
    }
    
    /**
     * @dev Submit a new trivia question
     */
    function submitQuestion(
        string calldata _questionText,
        string[4] calldata _options,
        uint8 _correctAnswer,
        Difficulty _difficulty
    ) external onlyRole(QUESTION_MANAGER_ROLE) {
        _validateQuestionData(_questionText, _options, _correctAnswer);
        
        uint256 questionReward = _calculateQuestionReward(_difficulty);
        
        questions[nextQuestionId] = Question({
            questionText: _questionText,
            options: _options,
            correctAnswer: _correctAnswer,
            reward: questionReward,
            status: QuestionStatus.Active,
            difficulty: _difficulty,
            creator: msg.sender,
            createdAtBlock: block.number,
            timesAnswered: 0,
            timesCorrect: 0
        });
        
        totalActiveQuestions++;
        
        emit QuestionSubmitted(nextQuestionId, _difficulty, msg.sender, block.number);
        
        nextQuestionId++;
    }
    
    /**
     * @dev Get a random question for a player using secure deterministic randomness
     */
    function getRandomQuestion(address _player) 
        external 
        view
        notBlacklisted(_player)
        returns (uint256 questionId) 
    {
        if (totalActiveQuestions == 0) revert NoQuestionsAvailable();
        
        // Generate deterministic but unpredictable random number
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            randomSeed,
            block.number,
            block.prevrandao,
            _player,
            playerNonces[_player],
            block.coinbase
        )));
        
        uint256 attempts = 0;
        uint256 maxAttempts = nextQuestionId * 2;
        
        while (attempts < maxAttempts) {
            uint256 candidateId = (randomValue + attempts) % nextQuestionId;
            
            if (questions[candidateId].status == QuestionStatus.Active && 
                !players[_player].answeredQuestions[candidateId]) {
                return candidateId;
            }
            
            attempts++;
        }
        
        revert NoQuestionsAvailable();
    }
    
    /**
     * @dev Serve a question to a player
     */
    function serveQuestion(uint256 _questionId) 
        external 
        validActiveQuestion(_questionId)
        notBlacklisted(msg.sender)
        notEmergencyStop
        cooldownPassed(msg.sender)
    {
        if (players[msg.sender].answeredQuestions[_questionId]) {
            revert QuestionAlreadyAnswered(_questionId);
        }
        
        // Update random seed for next request
        _updateRandomSeed();
        
        // Update player nonce
        playerNonces[msg.sender]++;
        
        // Set question start block
        players[msg.sender].questionStartBlock[_questionId] = block.number;
        
        emit QuestionServed(msg.sender, _questionId, block.number);
    }
    
    /**
     * @dev Answer a trivia question
     */
    function answerQuestion(
        uint256 _questionId, 
        uint8 _answer,
        bytes32 _sessionSalt
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        validActiveQuestion(_questionId)
        notBlacklisted(msg.sender)
        notEmergencyStop
        validAnswerTiming(msg.sender, _questionId)
    {
        if (_answer >= 4) revert InvalidAnswer(_answer);
        if (players[msg.sender].answeredQuestions[_questionId]) {
            revert QuestionAlreadyAnswered(_questionId);
        }
        
        // Process the answer and get results
        (bool isCorrect, uint256 rewardEarned, uint256 blocksTaken) = _processAnswer(_questionId, _answer);
        
        // Generate session hash
        bytes32 sessionHash = keccak256(abi.encodePacked(msg.sender, _questionId, block.number, _answer, _sessionSalt));
        
        // Record session
        _recordGameSession(msg.sender, _questionId, _answer, isCorrect, rewardEarned, blocksTaken, sessionHash);
        
        emit QuestionAnswered(msg.sender, _questionId, isCorrect, rewardEarned, players[msg.sender].streak, blocksTaken, sessionHash);
    }
    
    /**
     * @dev Process answer and calculate rewards
     */
    function _processAnswer(
        uint256 _questionId,
        uint8 _answer
    ) internal returns (bool isCorrect, uint256 rewardEarned, uint256 blocksTaken) {
        Player storage player = players[msg.sender];
        Question storage question = questions[_questionId];
        
        blocksTaken = block.number - player.questionStartBlock[_questionId];
        isCorrect = (_answer == question.correctAnswer);
        
        // Check daily limit
        uint256 today = block.number / BLOCKS_PER_DAY;
        if (dailyRewards[msg.sender][today] >= maxDailyRewards) {
            revert DailyLimitExceeded(maxDailyRewards, 0);
        }
        
        // Update question stats
        question.timesAnswered++;
        if (isCorrect) question.timesCorrect++;
        
        // Update player stats
        player.answeredQuestions[_questionId] = true;
        player.questionsAnswered++;
        player.lastAnswerBlock = block.number;
        player.totalResponseTime += blocksTaken;
        
        if (isCorrect) {
            player.correctAnswers++;
            player.streak++;
            if (player.streak > player.maxStreak) {
                player.maxStreak = player.streak;
            }
            
            rewardEarned = _calculateAndPayReward(question.reward, player.streak, blocksTaken, today);
        } else {
            player.streak = 0;
            rewardEarned = 0;
        }
        
        // Clear timing
        delete player.questionStartBlock[_questionId];
        
        return (isCorrect, rewardEarned, blocksTaken);
    }
    
    /**
     * @dev Calculate and pay reward
     */
    function _calculateAndPayReward(
        uint256 questionReward,
        uint256 streak,
        uint256 blocksTaken,
        uint256 today
    ) internal returns (uint256 rewardEarned) {
        rewardEarned = _calculateSecureReward(questionReward, streak, blocksTaken);
        
        // Apply daily limit
        uint256 remaining = maxDailyRewards - dailyRewards[msg.sender][today];
        if (rewardEarned > remaining) {
            rewardEarned = remaining;
        }
        
        // Check contract balance
        if (address(this).balance < minContractBalance + rewardEarned) {
            revert InsufficientContractBalance(minContractBalance + rewardEarned, address(this).balance);
        }
        
        if (rewardEarned > 0) {
            players[msg.sender].totalEarnings += rewardEarned;
            totalRewardsPaid += rewardEarned;
            dailyRewards[msg.sender][today] += rewardEarned;
            
            payable(msg.sender).sendValue(rewardEarned);
            emit RewardClaimed(msg.sender, rewardEarned, keccak256(abi.encodePacked(msg.sender, block.number)));
        }
        
        return rewardEarned;
    }
    
    // VIEW FUNCTIONS
    
    /**
     * @dev Get question details
     */
    function getQuestion(uint256 _questionId) 
        external 
        view 
        validActiveQuestion(_questionId)
        returns (
            string memory questionText,
            string[4] memory options,
            uint256 reward,
            Difficulty difficulty,
            uint256 timesAnswered
        ) 
    {
        Question storage question = questions[_questionId];
        return (
            question.questionText, 
            question.options, 
            question.reward, 
            question.difficulty,
            question.timesAnswered
        );
    }
    
    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address _player) 
        external 
        view 
        returns (
            uint256 totalEarnings,
            uint256 questionsAnswered,
            uint256 correctAnswers,
            uint256 currentStreak,
            uint256 maxStreak,
            uint256 accuracy
        ) 
    {
        Player storage player = players[_player];
        uint256 accuracyPercent = player.questionsAnswered > 0 
            ? (player.correctAnswers * ACCURACY_PRECISION) / player.questionsAnswered 
            : 0;
            
        return (
            player.totalEarnings,
            player.questionsAnswered,
            player.correctAnswers,
            player.streak,
            player.maxStreak,
            accuracyPercent
        );
    }
    
    /**
     * @dev Check if player can request a question
     */
    function canPlayerAnswer(address _player) 
        external 
        view 
        returns (bool canAnswer, string memory reason) 
    {
        if (emergencyStop) {
            return (false, "Emergency stop active");
        }
        
        if (blacklistedPlayers[_player]) {
            return (false, "Player blacklisted");
        }
        
        if (paused()) {
            return (false, "Contract paused");
        }
        
        uint256 blocksPassed = block.number - players[_player].lastAnswerBlock;
        if (blocksPassed < cooldownBlocks) {
            return (false, "Cooldown period active");
        }
        
        uint256 today = block.number / BLOCKS_PER_DAY;
        if (dailyRewards[_player][today] >= maxDailyRewards) {
            return (false, "Daily limit reached");
        }
        
        if (totalActiveQuestions == 0) {
            return (false, "No active questions");
        }
        
        return (true, "");
    }
    
    /**
     * @dev Get daily reward status
     */
    function getDailyRewardStatus(address _player) 
        external 
        view 
        returns (uint256 todayRewards, uint256 remainingRewards) 
    {
        uint256 today = block.number / BLOCKS_PER_DAY;
        todayRewards = dailyRewards[_player][today];
        remainingRewards = todayRewards >= maxDailyRewards ? 0 : maxDailyRewards - todayRewards;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getGameStats() 
        external 
        view 
        returns (
            uint256 totalQuestions,
            uint256 activeQuestions,
            uint256 totalSessions,
            uint256 totalRewards,
            uint256 contractBalance
        ) 
    {
        return (
            nextQuestionId,
            totalActiveQuestions,
            gameSessions.length,
            totalRewardsPaid,
            address(this).balance
        );
    }
    
    /**
     * @dev Get leaderboard
     */
    function getLeaderboard(uint256 _limit) 
        external 
        view 
        returns (LeaderboardEntry[] memory leaderboard) 
    {
        // Create a simple leaderboard from game sessions
        uint256 sessionCount = gameSessions.length;
        if (sessionCount == 0) {
            return new LeaderboardEntry[](0);
        }
        
        // Get unique players with earnings (simplified approach)
        address[] memory uniquePlayers = new address[](_limit > sessionCount ? sessionCount : _limit);
        uint256 playerCount = 0;
        
        // Collect unique players (simplified - in production you'd optimize this)
        for (uint256 i = 0; i < sessionCount && playerCount < _limit; i++) {
            address player = gameSessions[i].player;
            if (players[player].totalEarnings > 0) {
                bool exists = false;
                for (uint256 j = 0; j < playerCount; j++) {
                    if (uniquePlayers[j] == player) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    uniquePlayers[playerCount] = player;
                    playerCount++;
                }
            }
        }
        
        // Create leaderboard entries
        leaderboard = new LeaderboardEntry[](playerCount);
        for (uint256 i = 0; i < playerCount; i++) {
            address player = uniquePlayers[i];
            uint256 accuracy = players[player].questionsAnswered > 0 
                ? (players[player].correctAnswers * ACCURACY_PRECISION) / players[player].questionsAnswered 
                : 0;
                
            leaderboard[i] = LeaderboardEntry({
                player: player,
                totalEarnings: players[player].totalEarnings,
                accuracy: accuracy,
                maxStreak: players[player].maxStreak
            });
        }
        
        // Sort by total earnings (bubble sort for simplicity)
        for (uint256 i = 0; i < playerCount; i++) {
            for (uint256 j = i + 1; j < playerCount; j++) {
                if (leaderboard[i].totalEarnings < leaderboard[j].totalEarnings) {
                    LeaderboardEntry memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
        
        return leaderboard;
    }
    
    /**
     * @dev Check if player answered question
     */
    function hasPlayerAnsweredQuestion(address _player, uint256 _questionId) 
        external 
        view 
        returns (bool) 
    {
        return players[_player].answeredQuestions[_questionId];
    }
    
    /**
     * @dev Get player sessions
     */
    function getPlayerSessions(address _player) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return playerSessions[_player];
    }
    
    /**
     * @dev Get game session
     */
    function getGameSession(uint256 _sessionId) 
        external 
        view 
        returns (GameSession memory) 
    {
        require(_sessionId < gameSessions.length, "Session not found");
        return gameSessions[_sessionId];
    }
    
    // ADMIN FUNCTIONS
    
    /**
     * @dev Update game parameters
     */
    function updateGameParameters(
        uint256 _baseReward,
        uint256 _streakMultiplier,
        uint256 _maxStreakBonus,
        uint256 _cooldownBlocks
    ) external onlyOwner {
        require(_streakMultiplier >= 100 && _streakMultiplier <= 200, "Invalid multiplier");
        require(_maxStreakBonus <= 500, "Invalid max bonus");
        require(_cooldownBlocks >= 1 && _cooldownBlocks <= 100, "Invalid cooldown");
        
        baseReward = _baseReward;
        streakMultiplier = _streakMultiplier;
        maxStreakBonus = _maxStreakBonus;
        cooldownBlocks = _cooldownBlocks;
        
        emit EmergencyAction(msg.sender, "Parameters updated", address(0), block.number);
    }
    
    /**
     * @dev Update security parameters
     */
    function updateSecurityParameters(
        uint256 _maxRewardPerSession,
        uint256 _maxDailyRewards,
        uint256 _minContractBalance
    ) external onlyOwner {
        require(_maxRewardPerSession > 0, "Invalid max reward");
        require(_maxDailyRewards >= _maxRewardPerSession, "Invalid daily limit");
        require(_minContractBalance > 0, "Invalid min balance");
        
        maxRewardPerSession = _maxRewardPerSession;
        maxDailyRewards = _maxDailyRewards;
        minContractBalance = _minContractBalance;
        
        emit EmergencyAction(msg.sender, "Security parameters updated", address(0), block.number);
    }
    
    /**
     * @dev Blacklist player
     */
    function blacklistPlayer(address _player, string calldata _reason) 
        external 
        onlyRole(MODERATOR_ROLE) 
    {
        blacklistedPlayers[_player] = true;
        emit PlayerBlacklisted(_player, _reason);
        emit EmergencyAction(msg.sender, _reason, _player, block.number);
    }
    
    /**
     * @dev Whitelist player
     */
    function whitelistPlayer(address _player) 
        external 
        onlyRole(MODERATOR_ROLE) 
    {
        blacklistedPlayers[_player] = false;
        emit PlayerWhitelisted(_player);
        emit EmergencyAction(msg.sender, "Player whitelisted", _player, block.number);
    }
    
    /**
     * @dev Emergency circuit breaker
     */
    function activateEmergencyStop() external onlyRole(EMERGENCY_ROLE) {
        emergencyStop = true;
        _pause();
        emit EmergencyAction(msg.sender, "Emergency stop activated", address(0), block.number);
    }
    
    /**
     * @dev Reset emergency state
     */
    function resetEmergencyState() external onlyOwner {
        emergencyStop = false;
        _unpause();
        emit EmergencyAction(msg.sender, "Emergency state reset", address(0), block.number);
    }
    
    /**
     * @dev Deactivate question
     */
    function deactivateQuestion(uint256 _questionId) external onlyOwner {
        if (_questionId >= nextQuestionId) revert QuestionNotFound(_questionId);
        
        Question storage question = questions[_questionId];
        if (question.status == QuestionStatus.Active) {
            question.status = QuestionStatus.Deactivated;
            totalActiveQuestions--;
        }
        
        emit EmergencyAction(msg.sender, "Question deactivated", address(uint160(_questionId)), block.number);
    }
    
    /**
     * @dev Batch approve questions (removed approval system - questions are now active by default)
     */
    function batchActivateQuestions(uint256[] calldata _questionIds) 
        external 
        onlyRole(MODERATOR_ROLE) 
    {
        require(_questionIds.length <= MAX_BATCH_SIZE, "Batch too large");
        
        for (uint256 i = 0; i < _questionIds.length; i++) {
            uint256 questionId = _questionIds[i];
            if (questionId < nextQuestionId && 
                questions[questionId].status == QuestionStatus.Deactivated) {
                
                questions[questionId].status = QuestionStatus.Active;
                totalActiveQuestions++;
            }
        }
    }
    
    /**
     * @dev Withdraw funds
     */
    function withdraw(uint256 _amount) external onlyOwner {
        if (_amount > address(this).balance) {
            revert InsufficientFunds(_amount, address(this).balance);
        }
        require(_amount <= address(this).balance - minContractBalance, "Below minimum balance");
        
        payable(owner()).transfer(_amount);
        emit EmergencyAction(msg.sender, "Withdrawal", address(0), block.number);
    }
    
    /**
     * @dev Fund contract
     */
    function fundContract() external payable {
        require(msg.value > 0, "Invalid amount");
        emit ContractFunded(msg.sender, msg.value);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // INTERNAL HELPER FUNCTIONS
    
    /**
     * @dev Update random seed for next randomness generation
     */
    function _updateRandomSeed() internal {
        // Only update if we're in a new block to prevent manipulation
        if (block.number > lastRandomBlock) {
            randomSeed = uint256(keccak256(abi.encodePacked(
                randomSeed,
                block.number,
                block.prevrandao,
                block.coinbase,
                gasleft()
            )));
            lastRandomBlock = block.number;
        }
    }
    
    /**
     * @dev Calculate secure reward with all bonuses
     */
    function _calculateSecureReward(
        uint256 _baseReward, 
        uint256 _streak, 
        uint256 _responseBlocks
    ) internal view returns (uint256) {
        uint256 rewardWithStreak = _calculateStreakReward(_baseReward, _streak);
        uint256 speedBonus = _calculateSpeedBonus(rewardWithStreak, _responseBlocks);
        
        uint256 totalReward = rewardWithStreak + speedBonus;
        return totalReward > maxRewardPerSession ? maxRewardPerSession : totalReward;
    }
    
    /**
     * @dev Calculate streak-based reward bonus
     */
    function _calculateStreakReward(uint256 _baseReward, uint256 _streak) internal view returns (uint256) {
        if (_streak <= 1) return _baseReward;
        
        uint256 bonusPercentage = (_streak - 1) * (streakMultiplier - 100);
        if (bonusPercentage > maxStreakBonus) {
            bonusPercentage = maxStreakBonus;
        }
        
        return _baseReward + (_baseReward * bonusPercentage / 100);
    }
    
    /**
     * @dev Calculate speed bonus for quick answers
     */
    function _calculateSpeedBonus(uint256 _baseReward, uint256 _responseBlocks) internal view returns (uint256) {
        if (_responseBlocks > minResponseBlocksForSpeedBonus * 2) return 0;
        
        // 5% bonus for fast answers, scaled by speed
        uint256 maxBonusBlocks = minResponseBlocksForSpeedBonus * 2;
        if (_responseBlocks >= maxBonusBlocks) return 0;
        
        uint256 speedBonusPercent = (maxBonusBlocks - _responseBlocks) * 5 / maxBonusBlocks;
        return _baseReward * speedBonusPercent / 100;
    }
    
    /**
     * @dev Record game session with full integrity data
     */
    function _recordGameSession(
        address _player,
        uint256 _questionId,
        uint8 _answer,
        bool _isCorrect,
        uint256 _rewardEarned,
        uint256 _responseBlocks,
        bytes32 _sessionHash
    ) internal {
        uint256 sessionId = gameSessions.length;
        
        gameSessions.push(GameSession({
            player: _player,
            questionId: _questionId,
            blockNumber: block.number,
            playerAnswer: _answer,
            isCorrect: _isCorrect,
            rewardEarned: _rewardEarned,
            responseBlocks: _responseBlocks,
            sessionHash: _sessionHash
        }));
        
        playerSessions[_player].push(sessionId);
    }
    
    /**
     * @dev Validate question data before submission
     */
    function _validateQuestionData(
        string calldata _questionText,
        string[4] calldata _options,
        uint8 _correctAnswer
    ) internal pure {
        if (_correctAnswer >= 4) revert InvalidAnswer(_correctAnswer);
        
        if (bytes(_questionText).length < MIN_QUESTION_LENGTH) {
            revert QuestionNotFound(0);
        }
        if (bytes(_questionText).length > MAX_QUESTION_LENGTH) {
            revert QuestionNotFound(0);
        }
        
        // Validate all options are not empty
        for (uint8 i = 0; i < 4; i++) {
            if (bytes(_options[i]).length == 0) revert InvalidAnswer(i);
        }
    }
    
    /**
     * @dev Calculate question reward based on difficulty
     */
    function _calculateQuestionReward(Difficulty _difficulty) internal view returns (uint256) {
        if (_difficulty == Difficulty.Easy) return baseReward;
        if (_difficulty == Difficulty.Medium) return baseReward * 2;
        if (_difficulty == Difficulty.Hard) return baseReward * 3;
        if (_difficulty == Difficulty.Expert) return baseReward * 5;
        if (_difficulty == Difficulty.Master) return baseReward * 8;
        
        revert InvalidAnswer(uint8(_difficulty));
    }
    
    // ADDITIONAL VIEW FUNCTIONS FOR BETTER INTEGRATION
    
    /**
     * @dev Get active questions with pagination
     */
    function getActiveQuestions(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (uint256[] memory questionIds, uint256 totalActive) 
    {
        uint256[] memory tempIds = new uint256[](_limit);
        uint256 count = 0;
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < nextQuestionId && count < _limit; i++) {
            if (questions[i].status == QuestionStatus.Active) {
                if (activeCount >= _offset) {
                    tempIds[count] = i;
                    count++;
                }
                activeCount++;
            }
        }
        
        // Resize array to actual count
        questionIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            questionIds[i] = tempIds[i];
        }
        
        totalActive = activeCount;
    }
    
    /**
     * @dev Get questions by difficulty
     */
    function getQuestionsByDifficulty(
        Difficulty _difficulty, 
        uint256 _offset, 
        uint256 _limit
    ) 
        external 
        view 
        returns (uint256[] memory questionIds, uint256 totalMatching) 
    {
        uint256[] memory tempIds = new uint256[](_limit);
        uint256 count = 0;
        uint256 matchingCount = 0;
        
        for (uint256 i = 0; i < nextQuestionId && count < _limit; i++) {
            if (questions[i].status == QuestionStatus.Active && 
                questions[i].difficulty == _difficulty) {
                if (matchingCount >= _offset) {
                    tempIds[count] = i;
                    count++;
                }
                matchingCount++;
            }
        }
        
        questionIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            questionIds[i] = tempIds[i];
        }
        
        totalMatching = matchingCount;
    }
    
    /**
     * @dev Get question statistics for analytics
     */
    function getQuestionStats(uint256 _questionId) 
        external 
        view 
        returns (
            uint32 timesAnswered,
            uint32 timesCorrect,
            uint256 successRate,
            address creator,
            uint256 createdAt,
            QuestionStatus status
        ) 
    {
        if (_questionId >= nextQuestionId) revert QuestionNotFound(_questionId);
        
        Question storage question = questions[_questionId];
        uint256 rate = question.timesAnswered > 0 
            ? (uint256(question.timesCorrect) * 100) / uint256(question.timesAnswered)
            : 0;
            
        return (
            question.timesAnswered,
            question.timesCorrect,
            rate,
            question.creator,
            question.createdAtBlock,
            question.status
        );
    }
    
    /**
     * @dev Check contract balance and security status
     */
    function getSecurityStatus() 
        external 
        view 
        returns (
            bool emergencyActive,
            bool contractPaused,
            uint256 contractBalance,
            uint256 minBalanceRequired,
            uint256 totalActiveQs,
            uint256 currentBlock
        ) 
    {
        return (
            emergencyStop,
            paused(),
            address(this).balance,
            minContractBalance,
            totalActiveQuestions,
            block.number
        );
    }
    
    /**
     * @dev Calculate potential reward preview
     */
    function calculateRewardPreview(
        uint256 _baseReward, 
        uint256 _streak, 
        uint256 _responseBlocks
    ) external view returns (uint256 finalReward) {
        return _calculateSecureReward(_baseReward, _streak, _responseBlocks);
    }
    
    /**
     * @dev Get player's current cooldown status
     */
    function getPlayerCooldown(address _player) 
        external 
        view 
        returns (
            uint256 blocksRemaining,
            bool canPlay
        ) 
    {
        uint256 blocksPassed = block.number - players[_player].lastAnswerBlock;
        
        if (blocksPassed >= cooldownBlocks) {
            return (0, true);
        } else {
            return (cooldownBlocks - blocksPassed, false);
        }
    }
    
    /**
     * @dev Get available questions for a player
     */
    function getAvailableQuestionsCount(address _player) 
        external 
        view 
        returns (uint256 availableCount) 
    {
        availableCount = 0;
        for (uint256 i = 0; i < nextQuestionId; i++) {
            if (questions[i].status == QuestionStatus.Active && 
                !players[_player].answeredQuestions[i]) {
                availableCount++;
            }
        }
    }
    
    /**
     * @dev Get multiple questions by IDs (batch query)
     */
    function getQuestionsBatch(uint256[] calldata _questionIds) 
        external 
        view 
        returns (
            string[] memory questionTexts,
            uint256[] memory rewards,
            Difficulty[] memory difficulties
        ) 
    {
        uint256 length = _questionIds.length;
        questionTexts = new string[](length);
        rewards = new uint256[](length);
        difficulties = new Difficulty[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 qId = _questionIds[i];
            if (qId < nextQuestionId && questions[qId].status == QuestionStatus.Active) {
                questionTexts[i] = questions[qId].questionText;
                rewards[i] = questions[qId].reward;
                difficulties[i] = questions[qId].difficulty;
            }
        }
    }
    
    /**
     * @dev Get recent game sessions with pagination
     */
    function getRecentSessions(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (GameSession[] memory sessions) 
    {
        uint256 totalSessions = gameSessions.length;
        if (totalSessions == 0 || _offset >= totalSessions) {
            return new GameSession[](0);
        }
        
        uint256 end = _offset + _limit;
        if (end > totalSessions) {
            end = totalSessions;
        }
        
        uint256 count = end - _offset;
        sessions = new GameSession[](count);
        
        // Return in reverse order (most recent first)
        for (uint256 i = 0; i < count; i++) {
            sessions[i] = gameSessions[totalSessions - 1 - _offset - i];
        }
    }
    
    /**
     * @dev Get player performance metrics
     */
    function getPlayerMetrics(address _player) 
        external 
        view 
        returns (
            uint256 averageResponseTime,
            uint256 bestStreak,
            uint256 totalSessions,
            uint256 todayEarnings,
            uint256 weeklyEarnings
        ) 
    {
        Player storage player = players[_player];
        
        averageResponseTime = player.questionsAnswered > 0 
            ? player.totalResponseTime / player.questionsAnswered 
            : 0;
        bestStreak = player.maxStreak;
        totalSessions = playerSessions[_player].length;
        
        // Calculate today's earnings
        uint256 today = block.number / BLOCKS_PER_DAY;
        todayEarnings = dailyRewards[_player][today];
        
        // Calculate weekly earnings (last 7 days)
        weeklyEarnings = 0;
        for (uint256 i = 0; i < 7; i++) {
            if (today >= i) {
                weeklyEarnings += dailyRewards[_player][today - i];
            }
        }
    }
    
    // Fallback and receive functions
    receive() external payable {
        emit ContractFunded(msg.sender, msg.value);
    }
    
    fallback() external {
        revert("Function not found");
    }
}