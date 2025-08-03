"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  network: "testnet" | "mainnet"
  isConnecting: boolean
  error: string | null
}

interface WalletContextType extends WalletState {
  connectWallet: (walletType: "metamask" | "hashpack" | "walletconnect") => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (network: "testnet" | "mainnet") => Promise<void>
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: "0",
  network: "testnet",
  isConnecting: false,
  error: null,
}

type WalletAction =
  | { type: "CONNECT_START" }
  | { type: "CONNECT_SUCCESS"; payload: { address: string; balance: string } }
  | { type: "CONNECT_ERROR"; payload: string }
  | { type: "DISCONNECT" }
  | { type: "UPDATE_BALANCE"; payload: string }
  | { type: "SWITCH_NETWORK"; payload: "testnet" | "mainnet" }

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "CONNECT_START":
      return { ...state, isConnecting: true, error: null }
    case "CONNECT_SUCCESS":
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        address: action.payload.address,
        balance: action.payload.balance,
        error: null,
      }
    case "CONNECT_ERROR":
      return { ...state, isConnecting: false, error: action.payload }
    case "DISCONNECT":
      return { ...initialState }
    case "UPDATE_BALANCE":
      return { ...state, balance: action.payload }
    case "SWITCH_NETWORK":
      return { ...state, network: action.payload }
    default:
      return state
  }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        const storedConnection = localStorage.getItem("hashquest-wallet-connected")
        const storedWalletType = localStorage.getItem("hashquest-wallet-type")

        if (storedConnection === "true" && storedWalletType === "metamask") {
          // Attempt to re-connect MetaMask if it was the last connected wallet
          if (
            typeof window !== "undefined" &&
            typeof (window as any).ethereum !== "undefined" &&
            (window as any).ethereum.isMetaMask
          ) {
            try {
              console.log("Attempting to re-connect MetaMask...")
              const accounts = await (window as any).ethereum.request({ method: "eth_accounts" })
              if (accounts.length > 0) {
                const connectedAddress = accounts[0]
                const mockBalance = "125.50" // Simulate fetching balance
                dispatch({
                  type: "CONNECT_SUCCESS",
                  payload: { address: connectedAddress, balance: mockBalance },
                })
                window.dispatchEvent(
                  new CustomEvent("wallet-connected", {
                    detail: { walletType: "metamask", address: connectedAddress },
                  }),
                )
                console.log("MetaMask re-connected successfully:", connectedAddress)
              } else {
                console.log("No existing MetaMask accounts found, clearing stored state.")
                localStorage.removeItem("hashquest-wallet-connected")
                localStorage.removeItem("hashquest-wallet-type")
                dispatch({ type: "DISCONNECT" })
                window.dispatchEvent(new CustomEvent("wallet-disconnected"))
              }
            } catch (error: any) {
              console.error("Error during MetaMask re-connection check:", error)
              localStorage.removeItem("hashquest-wallet-connected")
              localStorage.removeItem("hashquest-wallet-type")
              const errorMessage = `Failed to re-connect MetaMask: ${error.message || "Unknown error"}`
              dispatch({ type: "CONNECT_ERROR", payload: errorMessage })
              window.dispatchEvent(new CustomEvent("wallet-error", { detail: { message: errorMessage } }))
            }
          } else {
            console.log("MetaMask not available or not detected during re-connection check, clearing stored state.")
            localStorage.removeItem("hashquest-wallet-connected")
            localStorage.removeItem("hashquest-wallet-type")
            dispatch({ type: "DISCONNECT" })
            window.dispatchEvent(new CustomEvent("wallet-disconnected"))
          }
        } else if (storedConnection === "true") {
          console.log("Restoring simulated wallet connection.")
          // For other simulated wallets, just restore mock state
          const mockAddress = "0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9"
          const mockBalance = "125.50"
          dispatch({
            type: "CONNECT_SUCCESS",
            payload: { address: mockAddress, balance: mockBalance },
          })
        }
      } catch (error: any) {
        console.error("Error checking existing wallet connection:", error)
      }
    }

    checkExistingConnection()
  }, [])

  const connectWallet = async (walletType: "metamask" | "hashpack" | "walletconnect") => {
    dispatch({ type: "CONNECT_START" })
    console.log(`Attempting to connect to ${walletType} wallet...`)

    try {
      let connectedAddress: string | null = null
      let currentBalance = "0"

      if (walletType === "metamask") {
        if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
          const ethereum = (window as any).ethereum
          if (ethereum.isMetaMask) {
            console.log("MetaMask detected.")
            try {
              // Check if already connected and get accounts
              console.log("Requesting eth_accounts to check existing connection...")
              const accounts = await ethereum.request({ method: "eth_accounts" })
              if (accounts.length > 0) {
                connectedAddress = accounts[0]
                currentBalance = "125.50" // Simulate fetching balance
                console.log("Already connected to MetaMask account:", connectedAddress)
              } else {
                // If not connected, request connection
                console.log("No existing accounts, requesting eth_requestAccounts...")
                const requestedAccounts = await ethereum.request({ method: "eth_requestAccounts" })
                if (requestedAccounts.length > 0) {
                  connectedAddress = requestedAccounts[0]
                  currentBalance = "125.50" // Simulate fetching balance
                  console.log("Successfully connected to new MetaMask account:", connectedAddress)
                } else {
                  throw new Error("MetaMask did not return any accounts after request.")
                }
              }
            } catch (metamaskError: any) {
              let userMessage = "Failed to connect to MetaMask. Please ensure it's unlocked and try again."
              if (metamaskError.code === 4001) {
                userMessage = "MetaMask connection rejected by user. Please approve the connection in MetaMask."
              } else if (metamaskError.code === -32002) {
                userMessage =
                  "MetaMask request already pending. Please open MetaMask and approve/reject the existing request."
              } else if (metamaskError.message) {
                userMessage = `MetaMask error: ${metamaskError.message}`
              }
              console.error("MetaMask specific error:", metamaskError)
              // Dispatch error and show toast immediately
              dispatch({ type: "CONNECT_ERROR", payload: userMessage })
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("wallet-error", { detail: { message: userMessage } }))
              }
              throw new Error(userMessage) // Re-throw to be caught by the outer try-catch
            }
          } else {
            const errorMessage =
              "MetaMask is not detected or not the active provider. Please ensure it's installed and enabled."
            console.error(errorMessage)
            throw new Error(errorMessage)
          }
        } else {
          const errorMessage = "MetaMask is not installed. Please install MetaMask to connect."
          console.error(errorMessage)
          throw new Error(errorMessage)
        }
      } else {
        // Keep simulation for other wallet types for now
        console.log(`Simulating connection for ${walletType}...`)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        connectedAddress = "0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9"
        currentBalance = "125.50"
        console.log(`Simulated ${walletType} connected.`)
      }

      if (connectedAddress) {
        dispatch({
          type: "CONNECT_SUCCESS",
          payload: { address: connectedAddress, balance: currentBalance },
        })

        localStorage.setItem("hashquest-wallet-connected", "true")
        localStorage.setItem("hashquest-wallet-type", walletType)

        if (typeof window !== "undefined") {
          const event = new CustomEvent("wallet-connected", {
            detail: { walletType, address: connectedAddress },
          })
          window.dispatchEvent(event)
        }
      } else {
        throw new Error("Failed to obtain wallet address after connection attempt.")
      }
    } catch (error: any) {
      let errorMessage = "An unknown error occurred during wallet connection."
      if (error.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }
      console.error("General wallet connection error:", error)

      // Only dispatch and toast if not already handled by inner MetaMask catch
      if (!state.error || state.error !== errorMessage) {
        dispatch({ type: "CONNECT_ERROR", payload: errorMessage })
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wallet-error", { detail: { message: errorMessage } }))
        }
      }
    }
  }

  const disconnectWallet = () => {
    dispatch({ type: "DISCONNECT" })

    // Clear stored connection
    localStorage.removeItem("hashquest-wallet-connected")
    localStorage.removeItem("hashquest-wallet-type")

    // Show disconnect message
    if (typeof window !== "undefined") {
      const event = new CustomEvent("wallet-disconnected")
      window.dispatchEvent(event)
    }
    console.log("Wallet disconnected.")
  }

  const switchNetwork = async (network: "testnet" | "mainnet") => {
    try {
      console.log(`Attempting to switch network to ${network}...`)

      // Simulate network switch
      await new Promise((resolve) => setTimeout(resolve, 500))

      dispatch({ type: "SWITCH_NETWORK", payload: network })

      // Show success message
      if (typeof window !== "undefined") {
        const event = new CustomEvent("network-switched", {
          detail: { network },
        })
        window.dispatchEvent(event)
      }
      console.log(`Successfully switched to ${network}.`)
    } catch (error) {
      console.error(`Error switching network to ${network}:`, error)
      // Show error message
      if (typeof window !== "undefined") {
        const event = new CustomEvent("network-error", {
          detail: { message: `Failed to switch to ${network}` },
        })
        window.dispatchEvent(event)
      }
    }
  }

  const value: WalletContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
