"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Wallet, User, LogOut, History } from "lucide-react" // Removed Settings and Shield icons
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Play", href: "/dashboard" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Wallet", href: "/wallet" },
  { name: "History", href: "/history" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { isConnected, address, balance, disconnectWallet } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-900/95 backdrop-blur-md border-b border-primary-500/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cyber-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-cyber font-bold text-xl text-gradient">HashQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-gray-300 hover:text-primary-400 hover:bg-primary-500/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="glassmorphism border-primary-500/30 hover:border-primary-500/50 bg-transparent"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {formatAddress(address!)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glassmorphism border-primary-500/30">
                  <DropdownMenuItem className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-sm">{formatAddress(address!)}</span>
                      <span className="text-xs text-gray-400">{balance} HBAR</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">
                      <Wallet className="w-4 h-4 mr-2" />
                      Manage Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history">
                      <History className="w-4 h-4 mr-2" />
                      Game History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/connect-wallet">
                <Button className="sophisticated-button cyber-gradient hover:shadow-lg hover:shadow-primary-500/25">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 glassmorphism rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-gray-300 hover:text-primary-400 hover:bg-primary-500/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-700">
                {isConnected ? (
                  <div className="px-3 py-2">
                    <div className="text-sm text-gray-400">Connected: {formatAddress(address!)}</div>
                    <div className="text-sm text-primary-400">{balance} HBAR</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={disconnectWallet}
                      className="mt-2 text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Link href="/connect-wallet" onClick={() => setIsOpen(false)}>
                    <Button className="w-full sophisticated-button cyber-gradient">Connect Wallet</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
