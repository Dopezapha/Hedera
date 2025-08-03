"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { WalletProvider } from "@/contexts/wallet-context"
import { GameProvider } from "@/contexts/game-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <GameProvider>{children}</GameProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}
