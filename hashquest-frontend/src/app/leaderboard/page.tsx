"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Zap, Target } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  earnings: number
  gamesPlayed: number
  winRate: number
  streak: number
  avatar?: string
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "CryptoMaster",
    score: 15420,
    earnings: 234.5,
    gamesPlayed: 156,
    winRate: 94,
    streak: 23,
  },
  {
    rank: 2,
    username: "BlockchainBrain",
    score: 14890,
    earnings: 198.75,
    gamesPlayed: 142,
    winRate: 91,
    streak: 18,
  },
  {
    rank: 3,
    username: "HashHero",
    score: 13650,
    earnings: 187.25,
    gamesPlayed: 134,
    winRate: 89,
    streak: 15,
  },
  {
    rank: 4,
    username: "TriviaKing",
    score: 12980,
    earnings: 165.8,
    gamesPlayed: 128,
    winRate: 87,
    streak: 12,
  },
  {
    rank: 5,
    username: "QuizQueen",
    score: 12340,
    earnings: 156.9,
    gamesPlayed: 119,
    winRate: 85,
    streak: 9,
  },
  {
    rank: 6,
    username: "SmartPlayer",
    score: 11750,
    earnings: 142.3,
    gamesPlayed: 115,
    winRate: 83,
    streak: 7,
  },
  {
    rank: 7,
    username: "BrainPower",
    score: 11200,
    earnings: 134.6,
    gamesPlayed: 108,
    winRate: 81,
    streak: 5,
  },
  {
    rank: 8,
    username: "KnowledgeSeeker",
    score: 10890,
    earnings: 128.45,
    gamesPlayed: 102,
    winRate: 79,
    streak: 4,
  },
  {
    rank: 9,
    username: "WisdomWarrior",
    score: 10450,
    earnings: 119.8,
    gamesPlayed: 98,
    winRate: 77,
    streak: 3,
  },
  {
    rank: 10,
    username: "ThinkTank",
    score: 10120,
    earnings: 112.35,
    gamesPlayed: 94,
    winRate: 75,
    streak: 2,
  },
]

const timeframes = [
  { id: "daily", name: "Daily", active: false },
  { id: "weekly", name: "Weekly", active: true },
  { id: "monthly", name: "Monthly", active: false },
  { id: "alltime", name: "All Time", active: false },
]

export default function LeaderboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</div>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-primary-500/20 text-primary-400"
    }
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Leaderboard</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Compete with players worldwide and climb to the top of the rankings
            </p>
          </motion.div>

          {/* Timeframe Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="glassmorphism p-2 rounded-lg">
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe.id}
                    variant={selectedTimeframe === timeframe.id ? "default" : "ghost"}
                    onClick={() => setSelectedTimeframe(timeframe.id)}
                    className={
                      selectedTimeframe === timeframe.id
                        ? "cyber-gradient"
                        : "text-gray-400 hover:text-white hover:bg-primary-500/10"
                    }
                  >
                    {timeframe.name}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Leaderboard */}
            <div className="lg:col-span-3">
              {/* Top 3 Podium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-center flex items-center justify-center">
                      <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {mockLeaderboard.slice(0, 3).map((player, index) => (
                        <motion.div
                          key={player.rank}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          className={`text-center ${index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}`}
                        >
                          <div className={`relative ${index === 0 ? "transform scale-110" : ""}`}>
                            <div className="glassmorphism p-6 rounded-xl card-hover">
                              <div className="flex justify-center mb-4">{getRankIcon(player.rank)}</div>

                              <Avatar className="w-16 h-16 mx-auto mb-4">
                                <AvatarFallback className="bg-primary-500/20 text-primary-400 text-lg font-bold">
                                  {player.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <h3 className="text-lg font-semibold text-white mb-2">{player.username}</h3>

                              <div className="space-y-2">
                                <div className="text-2xl font-bold text-gradient">{player.score.toLocaleString()}</div>
                                <div className="text-sm text-gray-400">points</div>

                                <div className="text-accent-400 font-semibold">{player.earnings} HBAR</div>

                                <Badge
                                  variant="secondary"
                                  className={`${getRankBadgeColor(player.rank)} text-white border-0`}
                                >
                                  #{player.rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Full Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Full Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockLeaderboard.map((player, index) => (
                        <motion.div
                          key={player.rank}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="glassmorphism p-4 rounded-lg hover:bg-primary-500/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-10 h-10">
                                {getRankIcon(player.rank)}
                              </div>

                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary-500/20 text-primary-400 font-semibold">
                                  {player.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <div className="text-white font-semibold">{player.username}</div>
                                <div className="text-sm text-gray-400">
                                  {player.gamesPlayed} games • {player.winRate}% win rate
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-gradient">{player.score.toLocaleString()}</div>
                              <div className="text-sm text-accent-400">{player.earnings} HBAR</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Global Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Global Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-primary-400" />
                        <span className="text-gray-400">Total Players</span>
                      </div>
                      <span className="text-white font-semibold">12,847</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-gray-400">Games Played</span>
                      </div>
                      <span className="text-white font-semibold">156,234</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-accent-500" />
                        <span className="text-gray-400">HBAR Distributed</span>
                      </div>
                      <span className="text-white font-semibold">45,230</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-gray-400">Avg Win Rate</span>
                      </div>
                      <span className="text-white font-semibold">73%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Rank */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glassmorphism border-accent-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Your Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gradient mb-2">#47</div>
                      <div className="text-gray-400">Current Position</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Your Score:</span>
                        <span className="text-white font-semibold">8,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Earnings:</span>
                        <span className="text-accent-400 font-semibold">89.25 HBAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-white font-semibold">71%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Best Streak:</span>
                        <span className="text-primary-400 font-semibold">8</span>
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4 sophisticated-button cyber-gradient">
                      <a href="/dashboard">
                        <Zap className="w-4 h-4 mr-2" />
                        Play Now
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weekly Challenge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="glassmorphism border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-400" />
                      Weekly Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-purple-400 mb-2">Science Week</div>
                      <div className="text-sm text-gray-400">Answer 50 science questions to earn bonus rewards</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-white">23/50</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "46%" }} />
                      </div>
                    </div>

                    <div className="mt-4 p-3 glassmorphism rounded-lg">
                      <div className="text-sm text-center text-gray-300">
                        <div className="text-purple-400 font-semibold">Reward: 10 HBAR</div>
                        <div>+ Exclusive Badge</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}