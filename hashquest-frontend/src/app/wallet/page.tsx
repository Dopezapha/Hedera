"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Wallet,
  Send,
  Download,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "sonner"

interface Transaction {
  id: string
  type: "earn" | "send" | "receive"
  amount: string
  from?: string
  to?: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
  description: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earn",
    amount: "2.50",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "completed",
    description: "Trivia Game Reward",
  },
  {
    id: "2",
    type: "earn",
    amount: "1.75",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "completed",
    description: "Streak Bonus",
  },
  {
    id: "3",
    type: "send",
    amount: "5.00",
    to: "0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "completed",
    description: "Transfer to External Wallet",
  },
  {
    id: "4",
    type: "receive",
    amount: "10.00",
    from: "0x123d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "completed",
    description: "Deposit from Exchange",
  },
  {
    id: "5",
    type: "earn",
    amount: "0.50",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: "pending",
    description: "Daily Login Bonus",
  },
]

export default function WalletPage() {
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [showSendForm, setShowSendForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { isConnected, address, balance, network } = useWallet()

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const handleSend = async () => {
    if (!sendAmount || !sendAddress) {
      toast.error("Please fill in all fields")
      return
    }

    if (Number.parseFloat(sendAmount) > Number.parseFloat(balance)) {
      toast.error("Insufficient balance")
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(`Successfully sent ${sendAmount} HBAR`)
      setSendAmount("")
      setSendAddress("")
      setShowSendForm(false)
    } catch (error) {
      toast.error("Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-400" />
    if (status === "failed") return <XCircle className="w-4 h-4 text-red-400" />

    switch (type) {
      case "earn":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "send":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      case "receive":
        return <TrendingUp className="w-4 h-4 text-blue-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earn":
      case "receive":
        return "text-green-400"
      case "send":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
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
                    <Wallet className="w-8 h-8 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-cyber font-bold text-gradient mb-4">Connect Wallet</h2>
                  <p className="text-gray-400 mb-8">Connect your wallet to view balance and transaction history</p>
                  <Button asChild className="sophisticated-button cyber-gradient">
                    <a href="/connect-wallet">
                      <Wallet className="w-5 h-5 mr-2" />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Wallet</h1>
            <p className="text-xl text-gray-300">Manage your HBAR balance and transaction history</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Wallet Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wallet className="w-6 h-6 mr-2 text-primary-400" />
                      Wallet Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl md:text-6xl font-bold text-gradient mb-2">{balance} HBAR</div>
                      <div className="text-gray-400">≈ ${(Number.parseFloat(balance) * 0.12).toFixed(2)} USD</div>
                    </div>

                    <div className="glassmorphism p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Address:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">
                            {address?.slice(0, 10)}...{address?.slice(-8)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyAddress}
                            className="h-8 w-8 p-0 hover:bg-primary-500/20"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400">Network:</span>
                        <Badge variant="secondary" className="bg-primary-500/20 text-primary-400">
                          {network}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => setShowSendForm(!showSendForm)}
                        className="sophisticated-button cyber-gradient"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send
                      </Button>
                      <Button
                        variant="outline"
                        className="glassmorphism border-primary-500/30 bg-transparent"
                        onClick={() => toast.info("QR code feature coming soon")}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Receive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Send Form */}
              {showSendForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glassmorphism border-primary-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Send HBAR</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="sendAddress" className="text-white">
                          Recipient Address
                        </Label>
                        <Input
                          id="sendAddress"
                          placeholder="0x..."
                          value={sendAddress}
                          onChange={(e) => setSendAddress(e.target.value)}
                          className="glassmorphism border-primary-500/30 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sendAmount" className="text-white">
                          Amount (HBAR)
                        </Label>
                        <Input
                          id="sendAmount"
                          type="number"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="glassmorphism border-primary-500/30 focus:border-primary-500"
                        />
                        <div className="text-sm text-gray-400 mt-1">Available: {balance} HBAR</div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          onClick={handleSend}
                          disabled={isLoading}
                          className="flex-1 sophisticated-button cyber-gradient"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Sending...
                            </div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send HBAR
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowSendForm(false)}
                          variant="outline"
                          className="glassmorphism border-gray-500/30 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="glassmorphism p-4 rounded-lg hover:bg-primary-500/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTransactionIcon(tx.type, tx.status)}
                              <div>
                                <div className="text-white font-medium">{tx.description}</div>
                                <div className="text-sm text-gray-400">{formatTimeAgo(tx.timestamp)}</div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className={`font-semibold ${getTransactionColor(tx.type)}`}>
                                {tx.type === "send" ? "-" : "+"}
                                {tx.amount} HBAR
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  tx.status === "completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : tx.status === "pending"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {tx.status}
                              </Badge>
                            </div>
                          </div>

                          {(tx.from || tx.to) && (
                            <div className="mt-2 text-sm text-gray-400">
                              {tx.type === "send" ? "To: " : "From: "}
                              <span className="font-mono">
                                {(tx.to || tx.from)?.slice(0, 10)}...{(tx.to || tx.from)?.slice(-8)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 ml-2 hover:bg-primary-500/20"
                                onClick={() =>
                                  window.open(`https://hashscan.io/${network}/transaction/${tx.id}`, "_blank")
                                }
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Earned:</span>
                      <span className="text-green-400 font-semibold">4.75 HBAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Week:</span>
                      <span className="text-primary-400 font-semibold">2.50 HBAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played:</span>
                      <span className="text-white font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-accent-400 font-semibold">78%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Network Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glassmorphism border-primary-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Network Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <Badge variant="secondary" className="bg-primary-500/20 text-primary-400">
                        {network}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Price:</span>
                      <span className="text-white">0.0001 HBAR</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="glassmorphism border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-yellow-400 font-semibold mb-1">Security Tip</div>
                        <div className="text-sm text-gray-300">
                          Always verify recipient addresses before sending transactions. HashQuest will never ask for
                          your private keys.
                        </div>
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