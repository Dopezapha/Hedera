"use client"

import { useState, useEffect } from "react"
import { Wallet, Shield, Zap, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "sonner"

interface WalletOption {
  id: "metamask" | "hashpack" | "walletconnect"
  name: string
  description: string
  icon: string
  features: string[]
  recommended?: boolean
  installed?: boolean
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "The most popular Ethereum wallet with Hedera support",
    icon: "🦊",
    features: ["Browser Extension", "Mobile App", "Hardware Wallet Support", "DeFi Integration"],
    recommended: true,
    installed: true, // Set to true for demo
  },
  {
    id: "hashpack",
    name: "HashPack",
    description: "Native Hedera wallet with advanced features",
    icon: "📦",
    features: ["Hedera Native", "NFT Support", "Staking", "Multi-Account"],
    recommended: true,
    installed: true, // Set to true for demo
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Connect with 300+ wallets via QR code",
    icon: "🔗",
    features: ["Multi-Wallet", "QR Code", "Mobile First", "Cross-Chain"],
    installed: true,
  },
]

export default function ConnectWalletPage() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { connectWallet, isConnecting, isConnected, address, balance, network, switchNetwork } = useWallet()

  // Listen for wallet events
  useEffect(() => {
    const handleWalletConnected = (event: any) => {
      toast.success(
        `${event.detail.walletType.charAt(0).toUpperCase() + event.detail.walletType.slice(1)} wallet connected successfully!`,
      )

      // Redirect to dashboard after successful connection
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    }

    const handleWalletError = (event: any) => {
      toast.error(event.detail.message)
    }

    const handleWalletDisconnected = () => {
      toast.info("Wallet disconnected")
    }

    const handleNetworkSwitched = (event: any) => {
      toast.success(`Switched to ${event.detail.network}`)
    }

    const handleNetworkError = (event: any) => {
      toast.error(event.detail.message)
    }

    window.addEventListener("wallet-connected", handleWalletConnected)
    window.addEventListener("wallet-error", handleWalletError)
    window.addEventListener("wallet-disconnected", handleWalletDisconnected)
    window.addEventListener("network-switched", handleNetworkSwitched)
    window.addEventListener("network-error", handleNetworkError)

    return () => {
      window.removeEventListener("wallet-connected", handleWalletConnected)
      window.removeEventListener("wallet-error", handleWalletError)
      window.removeEventListener("wallet-disconnected", handleWalletDisconnected)
      window.removeEventListener("network-switched", handleNetworkSwitched)
      window.removeEventListener("network-error", handleNetworkError)
    }
  }, [])

  const handleWalletConnect = async (walletType: "metamask" | "hashpack" | "walletconnect") => {
    try {
      setSelectedWallet(walletType)
      await connectWallet(walletType)
    } catch (error) {
      console.error("Wallet connection error:", error)
    } finally {
      setSelectedWallet(null)
    }
  }

  const handleNetworkSwitch = async (newNetwork: "testnet" | "mainnet") => {
    await switchNetwork(newNetwork)
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navigation />

        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-fade-in">
              <Card className="glassmorphism border-primary-500/30">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-2xl font-cyber text-gradient">Wallet Connected</CardTitle>
                  <p className="text-gray-400 mt-2">Your wallet is successfully connected to HashQuest</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Wallet Info */}
                  <div className="glassmorphism p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Wallet Details</h3>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Connected
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Address:</span>
                        <span className="text-white font-mono text-sm">{address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Balance:</span>
                        <span className="text-primary-400 font-semibold">{balance} HBAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="text-white capitalize">{network}</span>
                      </div>
                    </div>
                  </div>

                  {/* Network Switcher */}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1 sophisticated-button cyber-gradient">
                      <a href="/dashboard">
                        <Zap className="w-5 h-5 mr-2" />
                        Start Playing
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 glassmorphism border-primary-500/30 bg-transparent"
                    >
                      <a href="/wallet">
                        <Wallet className="w-5 h-5 mr-2" />
                        Manage Wallet
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-6">Connect Your Wallet</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your preferred wallet to start playing HashQuest and earning HBAR rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {walletOptions.map((wallet, index) => (
              <div key={wallet.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card
                  className={`glassmorphism border-primary-500/30 hover:border-primary-500/50 card-hover h-full relative ${
                    selectedWallet === wallet.id ? "ring-2 ring-primary-500/50" : ""
                  }`}
                >
                  {wallet.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent-500 text-white">Recommended</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className="text-4xl mb-3">{wallet.icon}</div>
                    <CardTitle className="text-xl text-white">{wallet.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{wallet.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {wallet.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleWalletConnect(wallet.id)}
                        disabled={isConnecting && selectedWallet === wallet.id}
                        className="w-full sophisticated-button cyber-gradient hover:shadow-lg hover:shadow-primary-500/25 group"
                      >
                        {isConnecting && selectedWallet === wallet.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Connecting...
                          </div>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Connect {wallet.name}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="animate-fade-in">
            <Card className="glassmorphism border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Security Notice</h3>
                    <div className="text-gray-300 space-y-2">
                      <p>• Never share your private keys or seed phrases with anyone</p>
                      <p>• Always verify you're on the official HashQuest website</p>
                      <p>• Only connect wallets you trust and control</p>
                      <p>• HashQuest will never ask for your private keys</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}