import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // IMPORTANT: Replace with your actual domain for production
  title: "HashQuest - The Ultimate Blockchain Trivia",
  description:
    "Play-to-earn trivia game on the Hedera network. Answer questions, earn HBAR rewards, and climb the leaderboards.",
  keywords: "blockchain, trivia, Hedera, HBAR, play-to-earn, crypto, quiz",
  authors: [{ name: "HashQuest Team" }],
  openGraph: {
    title: "HashQuest - The Ultimate Blockchain Trivia",
    description: "Play-to-earn trivia game on the Hedera network",
    type: "website",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HashQuest - The Ultimate Blockchain Trivia",
    description: "Play-to-earn trivia game on the Hedera network",
    images: ["/images/og-image.png"],
  },
}

// New viewport export for Next.js 15
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0ea5e9",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
