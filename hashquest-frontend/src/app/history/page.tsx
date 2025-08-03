"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from "@/lib/utils"

interface GameSessionEntry {
  id: string
  question: string
  difficulty: "easy" | "medium" | "hard"
  playerAnswer: string
  correctAnswer: string
  isCorrect: boolean
  rewardEarned: string
  timestamp: Date
}

const mockGameSessions: GameSessionEntry[] = [
  {
    id: "gs1",
    question: "What is the native cryptocurrency of the Hedera network?",
    difficulty: "easy",
    playerAnswer: "HBAR",
    correctAnswer: "HBAR",
    isCorrect: true,
    rewardEarned: "2.50",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "gs2",
    question: "What consensus mechanism does Hedera utilize?",
    difficulty: "medium",
    playerAnswer: "Proof-of-Stake",
    correctAnswer: "Hashgraph Consensus",
    isCorrect: false,
    rewardEarned: "0.00",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "gs3",
    question: "Who governs the Hedera network?",
    difficulty: "hard",
    playerAnswer: "The Hedera Governing Council",
    correctAnswer: "The Hedera Governing Council",
    isCorrect: true,
    rewardEarned: "5.00",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "gs4",
    question: "What is the maximum supply of HBAR?",
    difficulty: "medium",
    playerAnswer: "50 billion",
    correctAnswer: "50 billion",
    isCorrect: true,
    rewardEarned: "3.20",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "gs5",
    question: "Which programming language is primarily used for Hedera Smart Contracts?",
    difficulty: "easy",
    playerAnswer: "Solidity",
    correctAnswer: "Solidity",
    isCorrect: true,
    rewardEarned: "1.80",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
]

export default function GameHistoryPage() {
  const getResultIcon = (isCorrect: boolean) => {
    return isCorrect ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />
  }

  const getRewardColor = (reward: string) => {
    return Number.parseFloat(reward) > 0 ? "text-green-400" : "text-red-400"
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Game History</h1>
            <p className="text-xl text-gray-300">Review your past trivia sessions and performance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-6 h-6 mr-2 text-primary-400" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGameSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="glassmorphism p-4 rounded-lg hover:bg-primary-500/5 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getResultIcon(session.isCorrect)}
                          <div>
                            <div className="text-white font-medium">
                              {session.isCorrect ? "Correct Answer" : "Incorrect Answer"}
                            </div>
                            <div className="text-sm text-gray-400">{formatTimeAgo(session.timestamp)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getRewardColor(session.rewardEarned)}`}>
                            {session.isCorrect ? "+" : "-"}
                            {session.rewardEarned} HBAR
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              session.isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {session.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        <p className="font-semibold">Question:</p>
                        <p>{session.question}</p>
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        <p className="font-semibold">Your Answer:</p>
                        <p className={session.isCorrect ? "text-green-300" : "text-red-300"}>{session.playerAnswer}</p>
                      </div>
                      {!session.isCorrect && (
                        <div className="text-sm text-gray-300 mt-1">
                          <p className="font-semibold">Correct Answer:</p>
                          <p className="text-green-300">{session.correctAnswer}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}