"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, AlertTriangle, CheckCircle, ArrowRight, Key, Shield } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function ImportWalletPage() {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [isValidSeedPhrase, setIsValidSeedPhrase] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateSeedPhrase = (phrase: string) => {
    const words = phrase.trim().split(/\s+/)
    const isValid = words.length === 12 && words.every((word) => word.length > 0)
    setIsValidSeedPhrase(isValid)
    return isValid
  }

  const handleSeedPhraseChange = (value: string) => {
    setSeedPhrase(value)
    validateSeedPhrase(value)
  }

  const handleImportWallet = async () => {
    if (!isValidSeedPhrase || !agreedToTerms) {
      toast.error("Please complete all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Simulate wallet import
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("Wallet imported successfully!")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error) {
      toast.error("Failed to import wallet. Please check your seed phrase.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Import Wallet</h1>
            <p className="text-xl text-gray-300">Restore your existing wallet using your seed phrase</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-primary-400" />
                  Import Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Warning */}
                <div className="glassmorphism p-4 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-1">Security Notice</h3>
                      <p className="text-gray-300 text-sm">
                        Only enter your seed phrase on trusted devices. Make sure you're on the official HashQuest
                        website.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seed Phrase Input */}
                <div className="space-y-2">
                  <Label htmlFor="seedPhrase" className="text-white flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    Seed Phrase (12 words)
                  </Label>
                  <textarea
                    id="seedPhrase"
                    placeholder="Enter your 12-word seed phrase separated by spaces..."
                    value={seedPhrase}
                    onChange={(e) => handleSeedPhraseChange(e.target.value)}
                    rows={4}
                    className="w-full p-4 glassmorphism border border-primary-500/30 rounded-lg bg-transparent text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none resize-none"
                  />

                  {seedPhrase && (
                    <div className="flex items-center mt-2">
                      {isValidSeedPhrase ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Valid seed phrase format
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400 text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Please enter exactly 12 words
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Word Count Display */}
                {seedPhrase && (
                  <div className="glassmorphism p-3 rounded-lg">
                    <div className="text-sm text-gray-400">
                      Words entered:{" "}
                      {
                        seedPhrase
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }
                      /12
                    </div>
                  </div>
                )}

                {/* Security Tips */}
                <div className="glassmorphism p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Shield className="w-5 h-5 text-primary-400 mr-2" />
                    Security Tips
                  </h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Make sure you're on the official HashQuest website</li>
                    <li>• Never share your seed phrase with anyone</li>
                    <li>• Clear your browser cache after importing</li>
                    <li>• Use a secure, private internet connection</li>
                  </ul>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="border-primary-500/30 data-[state=checked]:bg-primary-500 mt-1"
                  />
                  <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
                    I understand that HashQuest cannot recover my wallet if I lose my seed phrase. I am responsible for
                    keeping my seed phrase secure and have verified I'm on the official website.
                  </Label>
                </div>

                {/* Import Button */}
                <Button
                  onClick={handleImportWallet}
                  disabled={!isValidSeedPhrase || !agreedToTerms || isLoading}
                  className="w-full sophisticated-button cyber-gradient py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Importing Wallet...
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Import Wallet
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Alternative Options */}
                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-gray-400 mb-4">Don't have a wallet yet?</p>
                  <Button asChild variant="outline" className="glassmorphism border-primary-500/30 bg-transparent">
                    <a href="/wallet/create">Create New Wallet</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}