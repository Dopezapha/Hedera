"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300">Your data privacy is important to us</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary-400" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Welcome to HashQuest. This Privacy Policy describes how we collect, use, and disclose your information
                  when you use our services. We are committed to protecting your privacy and ensuring a secure
                  experience.
                </p>
                <p>
                  By accessing or using HashQuest, you agree to the collection and use of information in accordance with
                  this policy.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We collect several types of information for various purposes to provide and improve our Service to
                  you.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain
                    personally identifiable information that can be used to contact or identify you ("Personal Data").
                    This may include, but is not limited to:
                    <ul className="list-circle list-inside ml-4">
                      <li>Email address</li>
                      <li>Username</li>
                      <li>Wallet address (public key)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used
                    ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol
                    address (e.g. IP address), browser type, browser version, the pages of our Service that you visit,
                    the time and date of your visit, the time spent on those pages, unique device identifiers and other
                    diagnostic data.
                  </li>
                  <li>
                    <strong>Blockchain Data:</strong> As a blockchain-based game, certain interactions (e.g., game
                    sessions, rewards earned) are recorded on the Hedera public ledger. This data is public and
                    immutable.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary-400" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>HashQuest uses the collected data for various purposes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>To manage your account and game progress</li>
                  <li>To distribute HBAR rewards</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary-400" />
                  Security of Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the
                  Internet, or method of electronic storage is 100% secure. While we strive to use commercially
                  acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
                <p>
                  Your private keys and seed phrases are never stored by HashQuest. You are solely responsible for the
                  security of your wallet.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}