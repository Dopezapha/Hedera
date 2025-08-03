"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Eye,
  EyeOff,
  Copy,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const MOCK_SEED_PHRASE = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
]

export default function CreateWalletPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [seedPhrase] = useState(MOCK_SEED_PHRASE)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [verificationWords, setVerificationWords] = useState<{ [key: number]: string }>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [savedSeedPhrase, setSavedSeedPhrase] = useState(false)

  const verificationIndices = [2, 5, 8] // Words to verify (3rd, 6th, 9th)

  const handleCopySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase.join(" "))
    toast.success("Seed phrase copied to clipboard")
  }

  const handleDownloadSeedPhrase = () => {
    const element = document.createElement("a")
    const file = new Blob([seedPhrase.join(" ")], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "hashquest-wallet-seed-phrase.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Seed phrase downloaded")
  }

  const handleVerificationChange = (index: number, value: string) => {
    setVerificationWords((prev) => ({ ...prev, [index]: value.toLowerCase().trim() }))
  }

  const isVerificationComplete = () => {
    return verificationIndices.every((index) => verificationWords[index] === seedPhrase[index])
  }

  const handleCreateWallet = () => {
    toast.success("Wallet created successfully!")
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
  }

  const steps = [
    { number: 1, title: "Security Information", description: "Learn about wallet security" },
    { number: 2, title: "Generate Seed Phrase", description: "Your wallet's recovery phrase" },
    { number: 3, title: "Verify Seed Phrase", description: "Confirm you've saved it safely" },
    { number: 4, title: "Complete Setup", description: "Finalize wallet creation" },
  ]

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
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Create New Wallet</h1>
            <p className="text-xl text-gray-300">Set up your secure HashQuest wallet in a few simple steps</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full h-0.5 mx-4 ${currentStep > step.number ? "bg-primary-500" : "bg-gray-600"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.number} className="text-center flex-1">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-primary-400" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step 1: Security Information */}
            {currentStep === 1 && (
              <Card className="glassmorphism border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-primary-400" />
                    Wallet Security Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="glassmorphism p-6 rounded-lg border border-yellow-500/30">
                    <div className="flex items-start space-x-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Security Notice</h3>
                        <div className="text-gray-300 space-y-2">
                          <p>• Your seed phrase is the master key to your wallet</p>
                          <p>• Anyone with your seed phrase can access your funds</p>
                          <p>• HashQuest cannot recover lost seed phrases</p>
                          <p>• Store it securely offline in multiple locations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glassmorphism p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        Do This
                      </h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Write down your seed phrase on paper</li>
                        <li>• Store it in a secure, offline location</li>
                        <li>• Make multiple copies</li>
                        <li>• Keep it private and secure</li>
                      </ul>
                    </div>

                    <div className="glassmorphism p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                        Never Do This
                      </h4>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Share your seed phrase with anyone</li>
                        <li>• Store it on your computer or phone</li>
                        <li>• Take screenshots of it</li>
                        <li>• Send it via email or messages</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="understand"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="border-primary-500/30 data-[state=checked]:bg-primary-500"
                    />
                    <Label htmlFor="understand" className="text-gray-300">
                      I understand the importance of keeping my seed phrase secure
                    </Label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!agreedToTerms}
                      className="sophisticated-button cyber-gradient"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Generate Seed Phrase */}
            {currentStep === 2 && (
              <Card className="glassmorphism border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-primary-400" />
                    Your Seed Phrase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-300">
                      This is your 12-word seed phrase. Write it down and store it safely.
                    </p>
                  </div>

                  <div className="glassmorphism p-6 rounded-lg border border-primary-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Seed Phrase</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                        className="text-gray-400 hover:text-white"
                      >
                        {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    {showSeedPhrase ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {seedPhrase.map((word, index) => (
                          <div key={index} className="glassmorphism p-3 rounded-lg text-center">
                            <div className="text-xs text-gray-400 mb-1">{index + 1}</div>
                            <div className="text-white font-medium">{word}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Click the eye icon to reveal your seed phrase</p>
                      </div>
                    )}

                    {showSeedPhrase && (
                      <div className="flex space-x-4">
                        <Button
                          onClick={handleCopySeedPhrase}
                          variant="outline"
                          className="flex-1 glassmorphism border-primary-500/30 bg-transparent"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={handleDownloadSeedPhrase}
                          variant="outline"
                          className="flex-1 glassmorphism border-primary-500/30 bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saved"
                      checked={savedSeedPhrase}
                      onCheckedChange={(checked) => setSavedSeedPhrase(checked as boolean)}
                      className="border-primary-500/30 data-[state=checked]:bg-primary-500"
                    />
                    <Label htmlFor="saved" className="text-gray-300">
                      I have safely stored my seed phrase
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="glassmorphism border-gray-500/30 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!savedSeedPhrase || !showSeedPhrase}
                      className="sophisticated-button cyber-gradient"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Verify Seed Phrase */}
            {currentStep === 3 && (
              <Card className="glassmorphism border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-primary-400" />
                    Verify Your Seed Phrase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-300">
                      Please enter the requested words from your seed phrase to verify you've saved it correctly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {verificationIndices.map((index) => (
                      <div key={index} className="glassmorphism p-4 rounded-lg">
                        <Label className="text-white mb-2 block">Word #{index + 1}</Label>
                        <input
                          type="text"
                          placeholder={`Enter word #${index + 1}`}
                          value={verificationWords[index] || ""}
                          onChange={(e) => handleVerificationChange(index, e.target.value)}
                          className="w-full p-3 glassmorphism border border-primary-500/30 rounded-lg bg-transparent text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
                        />
                        {verificationWords[index] && verificationWords[index] === seedPhrase[index] && (
                          <div className="flex items-center mt-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Correct
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="glassmorphism border-gray-500/30 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      disabled={!isVerificationComplete()}
                      className="sophisticated-button cyber-gradient"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Complete Setup */}
            {currentStep === 4 && (
              <Card className="glassmorphism border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-center flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                    Wallet Setup Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gradient mb-2">Congratulations!</h3>
                    <p className="text-gray-300">
                      Your HashQuest wallet has been created successfully. You can now start playing and earning HBAR
                      rewards.
                    </p>
                  </div>

                  <div className="glassmorphism p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Next Steps:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Start playing trivia games to earn HBAR</li>
                      <li>• Check the leaderboard to see your ranking</li>
                      <li>• Manage your wallet and view transactions</li>
                      <li>• Keep your seed phrase safe and secure</li>
                    </ul>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button onClick={handleCreateWallet} className="sophisticated-button cyber-gradient px-8">
                      Start Playing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}