"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel } from "lucide-react"

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300">Please read these terms carefully</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Gavel className="w-6 h-6 mr-2 text-primary-400" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Welcome to HashQuest. These Terms of Service ("Terms") govern your access to and use of the HashQuest
                  website, services, and applications (collectively, the "Service"). By accessing or using the Service,
                  you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not
                  access the Service.
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
                  <Gavel className="w-6 h-6 mr-2 text-primary-400" />
                  Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  You must be at least 18 years old to use the Service. By using the Service, you represent and warrant
                  that you are at least 18 years old and have the legal capacity to enter into these Terms.
                </p>
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
                  <Gavel className="w-6 h-6 mr-2 text-primary-400" />
                  Account Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  To access certain features of the Service, you may be required to register for an account. You agree
                  to provide accurate, current, and complete information during the registration process and to update
                  such information to keep it accurate, current, and complete. You are responsible for safeguarding your
                  password and for any activities or actions under your account.
                </p>
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
                  <Gavel className="w-6 h-6 mr-2 text-primary-400" />
                  Rewards and HBAR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  HashQuest offers rewards in the form of HBAR cryptocurrency for participating in trivia games. The
                  value of HBAR can fluctuate. HashQuest is not responsible for any losses incurred due to market
                  volatility. Rewards are distributed based on game performance and adherence to fair play rules.
                </p>
                <p>
                  All transactions and rewards are processed on the Hedera network. You are responsible for managing
                  your own cryptocurrency wallet and understanding the risks associated with digital assets.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}