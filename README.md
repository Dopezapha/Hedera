# HashQuest - Blockchain Trivia Game

HashQuest is a pure on-chain play-to-earn trivia game built for the Hedera network. Players answer trivia questions to earn HBAR rewards, with sophisticated anti-cheat mechanisms and fair gameplay mechanics.

## Game Overview

HashQuest combines knowledge, speed, and strategy in a blockchain-based trivia experience where:
- Players answer multiple-choice questions to earn HBAR rewards
- Correct answers build streaks for bonus multipliers
- Fast responses earn speed bonuses
- All gameplay is recorded immutably on-chain
- Advanced security prevents cheating and manipulation

## Key Features

### Core Gameplay
- **Multiple Difficulty Levels**: Easy, Medium, Hard, Expert, Master with scaled rewards
- **Streak System**: Build consecutive correct answers for increasing bonuses
- **Speed Bonuses**: Quick responses earn additional rewards
- **Daily Limits**: Fair play enforcement with daily reward caps
- **Cooldown System**: Prevents spam and ensures thoughtful gameplay

### Security & Anti-Cheat
- **Deterministic Randomness**: Secure question selection without predictability
- **Response Time Validation**: Prevents instant/delayed answer exploits
- **Session Integrity**: Cryptographic session hashing
- **Blacklist System**: Moderator controls for problematic players
- **Emergency Controls**: Circuit breakers for security incidents

### Administrative Features
- **Role-Based Access**: Granular permissions for different admin functions
- **Question Management**: Add, deactivate, and manage trivia content
- **Parameter Tuning**: Adjust rewards, cooldowns, and game mechanics
- **Analytics**: Comprehensive statistics and leaderboards

## Prerequisites

- Solidity ^0.8.22
- OpenZeppelin Contracts v5.0+
- Hedera network access
- Node.js and npm/yarn for deployment scripts

## Installation & Deployment

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd hashquest
npm install @openzeppelin/contracts
```

### 2. Compile Contract

```bash
# Using Hardhat
npx hardhat compile

# Using Foundry
forge build
```

### 3. Deploy to Hedera

```bash
# Configure your deployment script with:
# - Initial owner address
# - Initial HBAR funding
# - Network configuration

npx hardhat run scripts/deploy.js --network hedera
```

### 4. Initial Setup

```solidity
// Grant roles to appropriate addresses
contract.grantRole(QUESTION_MANAGER_ROLE, questionManagerAddress);
contract.grantRole(MODERATOR_ROLE, moderatorAddress);

// Fund the contract
contract.fundContract{value: initialFunding}();

// Add initial questions
contract.submitQuestion(questionText, options, correctAnswer, difficulty);
```

## Game Mechanics

### Question Flow

1. **Request Question**: Player calls `getRandomQuestion()` to get available question ID
2. **Serve Question**: Player calls `serveQuestion(questionId)` to start timer
3. **Submit Answer**: Player calls `answerQuestion(questionId, answer, salt)` within time limit
4. **Receive Reward**: Automatic HBAR transfer for correct answers

### Reward Calculation

```
Base Reward = Difficulty multiplier × baseReward
Streak Bonus = (streak - 1) × 10% (capped at 300%)
Speed Bonus = Up to 5% for fast responses
Final Reward = min(Base + Streak + Speed, maxRewardPerSession)
```

### Difficulty Multipliers
- **Easy**: 1x base reward
- **Medium**: 2x base reward  
- **Hard**: 3x base reward
- **Expert**: 5x base reward
- **Master**: 8x base reward

## Smart Contract Interface

### Core Functions

#### Player Functions

```solidity
// Get random available question for player
function getRandomQuestion(address player) external view returns (uint256 questionId)

// Start answering a specific question
function serveQuestion(uint256 questionId) external

// Submit answer with session salt
function answerQuestion(uint256 questionId, uint8 answer, bytes32 sessionSalt) external

// Check if player can currently play
function canPlayerAnswer(address player) external view returns (bool, string memory)
```

#### View Functions

```solidity
// Get question details (without correct answer)
function getQuestion(uint256 questionId) external view returns (...)

// Get comprehensive player statistics
function getPlayerStats(address player) external view returns (...)

// Get leaderboard with top players
function getLeaderboard(uint256 limit) external view returns (LeaderboardEntry[] memory)

// Get overall game statistics
function getGameStats() external view returns (...)
```

#### Admin Functions

```solidity
// Add new trivia question
function submitQuestion(string calldata questionText, string[4] calldata options, 
    uint8 correctAnswer, Difficulty difficulty) external

// Update game parameters
function updateGameParameters(uint256 baseReward, uint256 streakMultiplier, 
    uint256 maxStreakBonus, uint256 cooldownBlocks) external

// Emergency controls
function activateEmergencyStop() external
function blacklistPlayer(address player, string calldata reason) external
```

### Events

```solidity
event QuestionSubmitted(uint256 indexed questionId, Difficulty indexed difficulty, 
    address indexed creator, uint256 blockNumber);

event QuestionAnswered(address indexed player, uint256 indexed questionId, 
    bool indexed isCorrect, uint256 rewardEarned, uint256 streak, 
    uint256 responseBlocks, bytes32 sessionHash);

event RewardClaimed(address indexed player, uint256 amount, bytes32 sessionHash);

event EmergencyAction(address indexed admin, string action, 
    address indexed target, uint256 blockNumber);
```

## Security Features

### Anti-Cheat Mechanisms

1. **Secure Randomness**: Uses block.prevrandao, block.number, and player nonces
2. **Response Time Validation**: Enforces minimum/maximum answer times
3. **Session Integrity**: Cryptographic session hashing prevents replay attacks
4. **Daily Limits**: Prevents excessive farming
5. **Cooldown Periods**: Rate limiting between questions

### Access Control

- **Owner**: Full administrative control
- **MODERATOR_ROLE**: Player management and question approval
- **QUESTION_MANAGER_ROLE**: Content creation and management
- **EMERGENCY_ROLE**: Emergency stop capabilities

### Circuit Breakers

- Emergency stop functionality
- Contract pause/unpause
- Minimum balance requirements
- Daily reward limits per player

## Game Parameters

### Default Configuration

```solidity
baseReward = 0.001 HBAR          // Base reward amount
streakMultiplier = 110%          // 10% bonus per streak
maxStreakBonus = 300%            // Maximum streak bonus
cooldownBlocks = 20              // ~5 minutes between questions
maxRewardPerSession = 0.01 HBAR  // Maximum single reward
maxDailyRewards = 1 HBAR         // Daily limit per player
minAnswerBlocks = 1              // Minimum response time
maxAnswerBlocks = 40             // Maximum response time (~10 min)
```

### Timing (Block-Based)

All timing in HashQuest is block-based for deterministic behavior:
- 1 block ≈ 3-5 seconds on Hedera
- Cooldown: 20 blocks ≈ 1-2 minutes
- Max answer time: 40 blocks ≈ 2-3 minutes

## Leaderboard & Statistics

### Player Metrics
- Total earnings (HBAR)
- Questions answered
- Accuracy percentage
- Current streak
- Maximum streak achieved
- Average response time

### Global Statistics
- Total questions in database
- Active questions available
- Total game sessions
- Total rewards distributed
- Contract balance

## Integration Examples

### Frontend Integration

```javascript
// Connect to contract
const contract = new ethers.Contract(contractAddress, abi, signer);

// Get available question
const questionId = await contract.getRandomQuestion(playerAddress);

// Serve question to start timer
await contract.serveQuestion(questionId);

// Get question details
const question = await contract.getQuestion(questionId);

// Submit answer
const sessionSalt = ethers.utils.randomBytes(32);
await contract.answerQuestion(questionId, selectedAnswer, sessionSalt);
```

### Backend Integration

```javascript
// Monitor game events
contract.on("QuestionAnswered", (player, questionId, isCorrect, reward, streak) => {
    console.log(`Player ${player} ${isCorrect ? 'correctly' : 'incorrectly'} 
        answered question ${questionId}, earned ${reward} wei, streak: ${streak}`);
});

// Admin functions
await contract.submitQuestion(
    "What is the capital of France?",
    ["London", "Berlin", "Paris", "Madrid"],
    2, // Paris is option index 2
    0  // Easy difficulty
);
```

## Error Handling

### Common Errors

```solidity
error QuestionNotFound(uint256 questionId);
error CooldownNotPassed(uint256 remainingBlocks);
error PlayerIsBlacklisted();
error DailyLimitExceeded(uint256 requested, uint256 remaining);
error InvalidAnswerTiming(uint256 blocksTaken);
error NoQuestionsAvailable();
```

### Error Recovery

```javascript
try {
    await contract.answerQuestion(questionId, answer, salt);
} catch (error) {
    if (error.message.includes("CooldownNotPassed")) {
        // Handle cooldown period
    } else if (error.message.includes("DailyLimitExceeded")) {
        // Handle daily limit reached
    }
}
```

## Gas Optimization

### Efficient Operations

- Batch question operations where possible
- Use view functions for data retrieval
- Optimize storage layout for frequently accessed data
- Implement pagination for large data sets

### Cost Estimates (Hedera)

- Submit question: ~0.001 HBAR
- Answer question: ~0.002 HBAR
- Get question: Free (view function)
- Player statistics: Free (view function)

## Upgrade Strategy

The contract uses OpenZeppelin's access control but is not upgradeable by design for security and trust. For updates:

1. Deploy new contract version
2. Migrate question database
3. Provide migration path for player statistics
4. Update frontend to new contract address

## Known Issues & Limitations

1. **Block Time Variance**: Timing based on blocks may vary with network conditions
2. **Leaderboard Scaling**: Current implementation limited for very large player bases
3. **Question Randomization**: Deterministic randomness may have patterns over time
4. **Gas Costs**: Complex operations may be expensive during network congestion

### Question Submission Guidelines

- Questions must be factual and verifiable
- Avoid controversial or offensive content
- Provide clear, unambiguous options
- Include reliable sources for verification

## Support & Documentation

- **Smart Contract**: Fully documented with NatSpec comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Community discussions in GitHub Discussions
- **Security**: Report security issues privately to maintainers
---

**HashQuest** - Where knowledge meets blockchain technology. Test your wits, earn rewards, and climb the leaderboard in the ultimate on-chain trivia experience!