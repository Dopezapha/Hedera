"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, HelpCircle, Phone } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
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
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-gradient mb-4">Support Center</h1>
            <p className="text-xl text-gray-300">How can we help you today?</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glassmorphism border-primary-500/30 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <HelpCircle className="w-6 h-6 mr-2 text-primary-400" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    Find answers to common questions about HashQuest, HBAR rewards, wallet connections, and gameplay.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>How do I connect my wallet?</li>
                    <li>How are HBAR rewards calculated?</li>
                    <li>What if I lose my seed phrase?</li>
                    <li>How do I report a bug or an issue?</li>
                  </ul>
                  <Link href="#" className="text-primary-400 hover:underline">
                    View all FAQs &rarr;
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glassmorphism border-primary-500/30 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mail className="w-6 h-6 mr-2 text-primary-400" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    Can't find what you're looking for? Our support team is here to help. Reach out to us via email or
                    live chat.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>support@hashquest.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <span>Live Chat (Coming Soon)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>+1 (555) 123-4567 (Business Inquiries Only)</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="glassmorphism border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <HelpCircle className="w-6 h-6 mr-2 text-primary-400" />
                  Community & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Join our community to connect with other players, share tips, and stay updated on the latest news.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <Link href="#" className="text-primary-400 hover:underline">
                      Discord Community
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary-400 hover:underline">
                      Twitter / X
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary-400 hover:underline">
                      Blog & Announcements
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}