"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Trophy, Zap, Brain, Clock, Star, ChevronRight, Award, TrendingUp } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/contexts/game-context"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "sonner"

const difficulties = [
  { id: "easy", name: "Easy", multiplier: "1x", color: "text-green-400" },
  { id: "medium", name: "Medium", multiplier: "2x", color: "text-yellow-400" },
  { id: "hard", name: "Hard", multiplier: "3x", color: "text-red-400" },
]

export default function DashboardPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const {
    currentQuestion,
    score,
    streak,
    questionsAnswered,
    correctAnswers,
    isGameActive,
    selectedAnswer,
    showResult,
    earnings,
    startGame,
    submitAnswer,
    nextQuestion,
    endGame,
    resetGame,
  } = useGame()

  const { isConnected } = useWallet()

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive && timeLeft > 0 && currentQuestion && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerActive(false)
            // Auto-submit with no answer
            submitAnswer(-1)
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (!isTimerActive) {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft, currentQuestion, showResult, submitAnswer])

  // Start timer when new question loads
  useEffect(() => {
    if (currentQuestion && !showResult) {
      setTimeLeft(currentQuestion.timeLimit)
      setIsTimerActive(true)
    }
  }, [currentQuestion, showResult])

  const handleStartGame = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }
    startGame(selectedDifficulty)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return

    setIsTimerActive(false)
    submitAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    nextQuestion()
  }

  const handleEndGame = () => {
    endGame()
    setIsTimerActive(false)
    setTimeLeft(30)
  }

  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-400"
    if (timeLeft > 10) return "text-yellow-400"
    return "text-red-400"
  }

  const getProgressColor = () => {
    const percentage = (timeLeft / (currentQuestion?.timeLimit || 30)) * 100
    if (percentage > 66) return "bg-green-500"
    if (percentage > 33) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="glassmorphism border-primary-500/30">
                <CardContent className="p-12">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-cyber font-bold text-gradient mb-4">Connect Wallet to Play</h2>
                  <p className="text-gray-400 mb-8">
                    Connect your wallet to start playing HashQuest and earning HBAR rewards
                  </p>
                  <Button asChild className="sophisticated-button cyber-gradient">
                    <a href="/connect-wallet">
                      <Zap className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Game Setup */}
          {!isGameActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Ready to Play?</h1>
                <p className="text-xl text-gray-300">Choose your difficulty to start earning HBAR</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="glassmorphism border-primary-500/30 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Award className="w-6 h-6 mr-2 text-primary-400" />
                      Select Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {difficulties.map((difficulty) => (
                        <Button
                          key={difficulty.id}
                          variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                          onClick={() => setSelectedDifficulty(difficulty.id as "easy" | "medium" | "hard")}
                          className={`w-full h-16 flex items-center justify-between ${
                            selectedDifficulty === difficulty.id
                              ? "cyber-gradient"
                              : "glassmorphism border-primary-500/30 bg-transparent hover:border-primary-500/50"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-semibold">{difficulty.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={`${difficulty.color} bg-transparent border`}>
                              {difficulty.multiplier}
                            </Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="sophisticated-button cyber-gradient text-lg px-12 py-4 hover:shadow-xl hover:shadow-primary-500/25"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Game
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Game Interface */}
          {isGameActive && currentQuestion && (
            <div className="space-y-6">
              {/* Game Stats */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-sm text-gray-400">Score</div>
                  </CardContent>
                </Card>

                <Card className="glassmorphism border-primary-500/30">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{streak}</div>
                    <div className="text-sm text-gray-400">Streak</div>
                  </CardContent>
                </Card>

                <Card className="glassmorphism border-primary-500/30">
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-accent-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{earnings.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">HBAR Earned</div>
                  </CardContent>
                </Card>

                <Card className="glassmorphism border-primary-500/30">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-6 h-6 ${getTimerColor()}`} />
                        <span className="text-white font-semibold">Time Remaining</span>
                      </div>
                      <div className={`text-3xl font-bold font-mono ${getTimerColor()}`}>{timeLeft}s</div>
                    </div>
                    <Progress value={(timeLeft / (currentQuestion.timeLimit || 30)) * 100} className="h-3" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Question */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary-500/20 text-primary-400">
                        {currentQuestion.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-accent-500/20 text-accent-400">
                        {currentQuestion.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-white leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {currentQuestion.options.map((option, index) => {
                        let buttonClass =
                          "glassmorphism border-primary-500/30 bg-transparent hover:border-primary-500/50 text-left h-auto p-4"

                        if (showResult) {
                          if (index === currentQuestion.correctAnswer) {
                            buttonClass = "bg-green-500/20 border-green-500 text-green-400"
                          } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                            buttonClass = "bg-red-500/20 border-red-500 text-red-400"
                          }
                        } else if (selectedAnswer === index) {
                          buttonClass = "cyber-gradient"
                        }

                        return (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult || selectedAnswer !== null}
                            className={`${buttonClass} transition-all duration-300`}
                          >
                            <div className="flex items-center">
                              <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-3 text-sm font-semibold">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-1">{option}</span>
                            </div>
                          </Button>
                        )
                      })}
                    </div>

                    {/* Result Display */}
                    <AnimatePresence>
                      {showResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="mt-6 p-4 rounded-lg glassmorphism"
                        >
                          <div
                            className={`text-center mb-4 ${
                              selectedAnswer === currentQuestion.correctAnswer ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            <div className="text-2xl font-bold mb-2">
                              {selectedAnswer === currentQuestion.correctAnswer ? "Correct! 🎉" : "Incorrect 😔"}
                            </div>
                            {selectedAnswer !== currentQuestion.correctAnswer && (
                              <div className="text-white">
                                Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)} -{" "}
                                {currentQuestion.options[currentQuestion.correctAnswer]}
                              </div>
                            )}
                          </div>

                          <div className="text-gray-300 mb-4">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                          </div>

                          <div className="flex justify-center space-x-4">
                            <Button onClick={handleNextQuestion} className="sophisticated-button cyber-gradient">
                              <ChevronRight className="w-5 h-5 mr-2" />
                              Next Question
                            </Button>
                            <Button
                              onClick={handleEndGame}
                              variant="outline"
                              className="glassmorphism border-red-500/30 text-red-400 hover:border-red-500/50 bg-transparent"
                            >
                              End Game
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Game Over Screen */}
          {!isGameActive && questionsAnswered > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glassmorphism border-primary-500/30 max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-primary-400" />
                  </div>
                  <CardTitle className="text-2xl font-cyber text-gradient">Game Complete!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white">{score}</div>
                      <div className="text-gray-400">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-accent-400">{earnings.toFixed(2)}</div>
                      <div className="text-gray-400">HBAR Earned</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {correctAnswers}/{questionsAnswered}
                      </div>
                      <div className="text-gray-400">Correct Answers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary-400">{streak}</div>
                      <div className="text-gray-400">Best Streak</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        resetGame()
                        handleStartGame()
                      }}
                      className="sophisticated-button cyber-gradient"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play Again
                    </Button>
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="glassmorphism border-primary-500/30 bg-transparent"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      New Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}