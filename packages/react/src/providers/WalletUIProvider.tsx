import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query'
import { useWallet, useNetwork } from '@txnlab/use-wallet-react'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import type { NfdLookupResponse, NfdView } from '../hooks/useNfd'

interface WalletUIContextType {
  queryClient: QueryClient
}

interface WalletUIProviderProps {
  children: ReactNode
  queryClient?: QueryClient
  /**
   * Whether to automatically prefetch data for all accounts in connected wallets (defaults to true)
   */
  enablePrefetching?: boolean
  /**
   * NFD view type for prefetching (defaults to 'thumbnail')
   */
  prefetchNfdView?: NfdView
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

// Internal function to prefetch all account data when a wallet connects
function WalletAccountsPrefetcher({
  enabled,
  nfdView,
}: {
  enabled: boolean
  nfdView: NfdView
}) {
  const queryClient = useQueryClient()
  const { activeAddress, activeWallet, algodClient } = useWallet()
  const { activeNetwork } = useNetwork()

  // Previous activeAddress value
  const prevActiveAddressRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip if prefetching is disabled
    if (!enabled) {
      prevActiveAddressRef.current = activeAddress
      return
    }

    // Only prefetch when transitioning from disconnected to connected state
    // (when prevActiveAddress was null but activeAddress is now defined)
    const shouldPrefetch =
      prevActiveAddressRef.current === null &&
      activeAddress !== null &&
      activeWallet !== null &&
      activeWallet.accounts !== undefined &&
      activeWallet.accounts.length > 0 &&
      algodClient !== undefined

    // Always update the previous address ref
    prevActiveAddressRef.current = activeAddress

    // If we don't need to prefetch, exit early
    if (!shouldPrefetch) {
      return
    }

    console.log(
      `[WalletUI] Prefetching data for all accounts in wallet ${activeWallet!.id}`,
    )

    // Get all addresses from the wallet
    const addresses = activeWallet!.accounts.map((account) => account.address)

    // If we have addresses, fetch NFDs in batches of 20
    if (addresses.length > 0) {
      // Process addresses in batches of 20 (NFD API limit)
      const batchSize = 20
      const addressBatches = []

      for (let i = 0; i < addresses.length; i += batchSize) {
        addressBatches.push(addresses.slice(i, i + batchSize))
      }

      // Process each batch
      addressBatches.forEach(async (batch) => {
        // Determine the API endpoint based on the network
        const isTestnet = activeNetwork === 'testnet'
        const apiEndpoint = isTestnet
          ? 'https://api.testnet.nf.domains'
          : 'https://api.nf.domains'

        // Build the query URL with multiple address parameters
        const queryParams = new URLSearchParams()
        batch.forEach((address) => {
          queryParams.append('address', address)
        })
        queryParams.append('view', nfdView)

        try {
          // Make a single request for all addresses in the batch
          const response = await fetch(
            `${apiEndpoint}/nfd/lookup?${queryParams.toString()}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
            },
          )

          // Handle response
          if (!response.ok && response.status !== 404) {
            throw new Error(
              `NFD prefetch lookup failed: ${response.statusText}`,
            )
          }

          // If we get a 404 or success, process the response
          // For 404, we'll get an empty object
          const responseData: NfdLookupResponse =
            response.status === 404 ? {} : await response.json()

          // For each address in the batch, seed the query cache
          batch.forEach((address) => {
            const nfdData = responseData[address] || null

            // Seed the cache with this NFD data
            queryClient.setQueryData(
              ['nfd', address, activeNetwork, nfdView],
              nfdData,
            )
          })
        } catch (error) {
          console.error('Error prefetching NFD data:', error)
        }
      })
    }

    // For each account in the wallet, prefetch balance data
    addresses.forEach((address) => {
      // Prefetch balance data
      queryClient.prefetchQuery({
        queryKey: ['account-balance', address],
        queryFn: async () => {
          try {
            const accountInfo = await algodClient!
              .accountInformation(address)
              .do()
            return Number(accountInfo.amount)
          } catch (error) {
            throw new Error(`Error fetching account balance: ${error}`)
          }
        },
      })
    })
  }, [
    activeAddress,
    activeWallet,
    activeNetwork,
    nfdView,
    algodClient,
    queryClient,
    enabled,
  ])

  // Return null since this is a utility component with no UI
  return null
}

/**
 * Provider that enables wallet UI components to work with TanStack Query.
 * It can use an existing QueryClient from the parent application or create its own.
 * Also creates a QueryClientProvider if none exists in the parent tree.
 *
 * Automatically prefetches data for all accounts in connected wallets for smoother
 * account switching experience.
 */
export function WalletUIProvider({
  children,
  queryClient: externalQueryClient,
  enablePrefetching = true,
  prefetchNfdView = 'thumbnail',
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
      {/* Internal prefetcher component that runs automatically */}
      <WalletAccountsPrefetcher
        enabled={enablePrefetching}
        nfdView={prefetchNfdView}
      />
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
