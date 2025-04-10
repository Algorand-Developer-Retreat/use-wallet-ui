import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useMemo } from 'react'

interface WalletUIContextType {
  queryClient: QueryClient
}

interface WalletUIProviderProps {
  children: ReactNode
  queryClient?: QueryClient
}

// Default query client configuration for NFD queries
const createDefaultQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: true,
        refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
        retry: (failureCount, error) => {
          // Don't retry for 404 errors (not found)
          if (error instanceof Error && error.message.includes('404')) {
            return false
          }
          // For other errors, retry up to 3 times
          return failureCount < 3
        },
      },
    },
  })

const WalletUIContext = createContext<WalletUIContextType | undefined>(
  undefined,
)

/**
 * Provider that enables wallet UI components to work with TanStack Query.
 * It can use an existing QueryClient from the parent application or create its own.
 * Also creates a QueryClientProvider if none exists in the parent tree.
 */
export function WalletUIProvider({
  children,
  queryClient: externalQueryClient,
}: WalletUIProviderProps) {
  // Use provided query client or create a default one
  const queryClient = useMemo(
    () => externalQueryClient || createDefaultQueryClient(),
    [externalQueryClient],
  )

  const contextValue = useMemo(
    () => ({
      queryClient,
    }),
    [queryClient],
  )

  const content = (
    <WalletUIContext.Provider value={contextValue}>
      {children}
    </WalletUIContext.Provider>
  )

  // If no external query client was provided, wrap with our own QueryClientProvider
  if (!externalQueryClient) {
    return (
      <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
    )
  }

  // Otherwise just return the context provider
  return content
}

/**
 * Hook to access the WalletUI context
 * @throws Error if used outside of WalletUIProvider
 */
export function useWalletUI(): WalletUIContextType {
  const context = useContext(WalletUIContext)
  if (context === undefined) {
    throw new Error('useWalletUI must be used within a WalletUIProvider')
  }
  return context
}
