"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: "easy" | "medium" | "hard"
  explanation: string
  timeLimit: number
}

interface GameState {
  currentQuestion: Question | null
  score: number
  streak: number
  questionsAnswered: number
  correctAnswers: number
  timeRemaining: number
  isGameActive: boolean
  selectedAnswer: number | null
  showResult: boolean
  earnings: number
  category: string
  difficulty: "easy" | "medium" | "hard"
}

interface GameContextType extends GameState {
  startGame: (difficulty: "easy" | "medium" | "hard") => void // Removed category parameter
  submitAnswer: (answerIndex: number) => void
  nextQuestion: () => void
  endGame: () => void
  resetGame: () => void
}

const initialState: GameState = {
  currentQuestion: null,
  score: 0,
  streak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  timeRemaining: 30,
  isGameActive: false,
  selectedAnswer: null,
  showResult: false,
  earnings: 0,
  category: "Hedera", // Default to Hedera
  difficulty: "medium",
}

// Hedera-specific questions
const hederaQuestions: Question[] = [
  {
    id: "h1",
    question: "What is the native cryptocurrency of the Hedera network?",
    options: ["HBAR", "ETH", "ADA", "XRP"],
    correctAnswer: 0,
    category: "Hedera",
    difficulty: "easy",
    explanation: "HBAR is the native, energy-efficient cryptocurrency of the Hedera public network.",
    timeLimit: 30,
  },
  {
    id: "h2",
    question: "What consensus mechanism does Hedera utilize?",
    options: ["Proof-of-Work", "Proof-of-Stake", "Hashgraph Consensus", "Delegated Proof-of-Stake"],
    correctAnswer: 2,
    category: "Hedera",
    difficulty: "medium",
    explanation:
      "Hedera uses the Hashgraph consensus algorithm, which offers asynchronous Byzantine Fault Tolerance (aBFT).",
    timeLimit: 30,
  },
  {
    id: "h3",
    question: "Which of these is NOT a core service offered by the Hedera network?",
    options: [
      "Hedera Token Service (HTS)",
      "Hedera Consensus Service (HCS)",
      "Hedera Smart Contract Service (HSCS)",
      "Hedera NFT Marketplace",
    ],
    correctAnswer: 3,
    category: "Hedera",
    difficulty: "medium",
    explanation:
      "While NFTs can be built on Hedera, a dedicated 'Hedera NFT Marketplace' is not a core service provided by the network itself.",
    timeLimit: 30,
  },
  {
    id: "h4",
    question: "What is the primary benefit of Hedera's low and predictable transaction fees?",
    options: [
      "Increased network congestion",
      "Reduced developer adoption",
      "Cost-effective microtransactions",
      "Slower transaction finality",
    ],
    correctAnswer: 2,
    category: "Hedera",
    difficulty: "easy",
    explanation:
      "Hedera's predictable and low transaction fees make it ideal for microtransactions and enterprise-level applications.",
    timeLimit: 30,
  },
  {
    id: "h5",
    question: "Who governs the Hedera network?",
    options: [
      "A single centralized entity",
      "A decentralized community of validators",
      "The Hedera Governing Council",
      "A foundation of open-source developers",
    ],
    correctAnswer: 2,
    category: "Hedera",
    difficulty: "hard",
    explanation: "The Hedera network is governed by a decentralized council of leading global organizations.",
    timeLimit: 20,
  },
  {
    id: "h6",
    question: "What unique feature of Hashgraph ensures fairness in transaction ordering?",
    options: ["Proof-of-Burn", "Gossip about Gossip", "Sharding", "Zero-Knowledge Proofs"],
    correctAnswer: 1,
    category: "Hedera",
    difficulty: "hard",
    explanation: "Hashgraph's 'Gossip about Gossip' protocol and virtual voting ensure fair ordering of transactions.",
    timeLimit: 20,
  },
  {
    id: "h7",
    question: "What is the maximum supply of HBAR?",
    options: ["20 billion", "50 billion", "100 billion", "Unlimited"],
    correctAnswer: 1,
    category: "Hedera",
    difficulty: "medium",
    explanation: "The maximum supply of HBAR is 50 billion.",
    timeLimit: 30,
  },
  {
    id: "h8",
    question: "Which programming language is primarily used for Hedera Smart Contracts?",
    options: ["Rust", "Solidity", "Go", "Python"],
    correctAnswer: 1,
    category: "Hedera",
    difficulty: "easy",
    explanation: "Hedera Smart Contracts are primarily written in Solidity, making it compatible with Ethereum's EVM.",
    timeLimit: 30,
  },
  {
    id: "h9",
    question: "What does 'aBFT' stand for in the context of Hedera's consensus?",
    options: [
      "Asynchronous Blockchain Finality Technology",
      "Advanced Byzantine Fault Tolerance",
      "Asynchronous Byzantine Fault Tolerance",
      "Automated Blockchain Functionality Test",
    ],
    correctAnswer: 2,
    category: "Hedera",
    difficulty: "hard",
    explanation:
      "aBFT stands for Asynchronous Byzantine Fault Tolerance, a property of the Hashgraph algorithm ensuring high security and finality.",
    timeLimit: 20,
  },
  {
    id: "h10",
    question: "What is the main purpose of the Hedera Token Service (HTS)?",
    options: [
      "To create and manage fungible and non-fungible tokens",
      "To facilitate cross-chain swaps",
      "To provide decentralized storage",
      "To enable private transactions",
    ],
    correctAnswer: 0,
    category: "Hedera",
    difficulty: "medium",
    explanation:
      "The Hedera Token Service (HTS) allows for the configuration, minting, and management of native fungible and non-fungible tokens on Hedera.",
    timeLimit: 30,
  },
]

type GameAction =
  | { type: "START_GAME"; payload: { difficulty: "easy" | "medium" | "hard" } } // Removed category
  | { type: "LOAD_QUESTION"; payload: Question }
  | { type: "SELECT_ANSWER"; payload: number }
  | { type: "SUBMIT_ANSWER"; payload: { correct: boolean; points: number } }
  | { type: "NEXT_QUESTION" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "UPDATE_TIMER"; payload: number }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        isGameActive: true,
        category: "Hedera", // Always Hedera
        difficulty: action.payload.difficulty,
      }
    case "LOAD_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        timeRemaining: action.payload.timeLimit,
        selectedAnswer: null,
        showResult: false,
      }
    case "SELECT_ANSWER":
      return { ...state, selectedAnswer: action.payload }
    case "SUBMIT_ANSWER":
      return {
        ...state,
        showResult: true,
        questionsAnswered: state.questionsAnswered + 1,
        correctAnswers: action.payload.correct ? state.correctAnswers + 1 : state.correctAnswers,
        score: state.score + action.payload.points,
        streak: action.payload.correct ? state.streak + 1 : 0,
        earnings: state.earnings + action.payload.points * 0.01, // Convert points to HBAR
      }
    case "NEXT_QUESTION":
      return { ...state, showResult: false, selectedAnswer: null }
    case "END_GAME":
      return { ...state, isGameActive: false }
    case "RESET_GAME":
      return initialState
    case "UPDATE_TIMER":
      return { ...state, timeRemaining: action.payload }
    default:
      return state
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const loadNextQuestion = async (difficulty: "easy" | "medium" | "hard") => {
    // Filter questions by difficulty, then pick a random one
    const availableQuestions = hederaQuestions.filter((q) => q.difficulty === difficulty)
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]

    if (randomQuestion) {
      dispatch({ type: "LOAD_QUESTION", payload: randomQuestion })
    } else {
      // Fallback if no questions for a specific difficulty (shouldn't happen with current mock data)
      console.warn(`No questions found for difficulty: ${difficulty}. Loading a random Hedera question.`)
      dispatch({ type: "LOAD_QUESTION", payload: hederaQuestions[Math.floor(Math.random() * hederaQuestions.length)] })
    }
  }

  const startGame = (difficulty: "easy" | "medium" | "hard") => {
    dispatch({ type: "START_GAME", payload: { difficulty } })
    loadNextQuestion(difficulty) // Load first question
  }

  const submitAnswer = (answerIndex: number) => {
    dispatch({ type: "SELECT_ANSWER", payload: answerIndex })

    if (state.currentQuestion) {
      const correct = answerIndex === state.currentQuestion.correctAnswer
      const basePoints = state.difficulty === "easy" ? 10 : state.difficulty === "medium" ? 20 : 30
      const streakMultiplier = Math.min(1 + state.streak * 0.1, 3) // Max 3x multiplier
      const points = correct ? Math.round(basePoints * streakMultiplier) : 0

      dispatch({ type: "SUBMIT_ANSWER", payload: { correct, points } })
    }
  }

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" })
    loadNextQuestion(state.difficulty) // Pass current difficulty
  }

  const endGame = () => {
    dispatch({ type: "END_GAME" })
  }

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" })
  }

  const value: GameContextType = {
    ...state,
    startGame,
    submitAnswer,
    nextQuestion,
    endGame,
    resetGame,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
