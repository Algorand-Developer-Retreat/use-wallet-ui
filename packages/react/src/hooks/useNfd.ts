import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useWallet, useNetwork } from '@txnlab/use-wallet-react'

// NFD types
export type NfdRecord = {
  name: string
  properties: {
    verified: {
      [key: string]: string
    }
    userDefined: {
      [key: string]: string
    }
  }
  image?: string
  avatar?: {
    url?: string
  }
}

export type NfdLookupResponse = {
  [address: string]: NfdRecord | null
}

/**
 * Custom hook to fetch NFD data for an Algorand address
 *
 * @param options.enabled Whether to enable the NFD lookup (defaults to true)
 * @returns NFD data query result
 */
export function useNfd(
  options: { enabled?: boolean } = {},
): UseQueryResult<NfdRecord | null> {
  const { activeAddress } = useWallet()
  const { activeNetwork } = useNetwork()
  const { enabled = true } = options

  return useQuery({
    queryKey: ['nfd', activeAddress, activeNetwork],
    queryFn: async ({ signal }) => {
      if (!activeAddress) return null

      // Determine the API endpoint based on the network
      // Only check for TestNet, otherwise use MainNet
      const isTestnet = activeNetwork === 'testnet'
      const apiEndpoint = isTestnet
        ? 'https://api.testnet.nf.domains'
        : 'https://api.nf.domains'

      const response = await fetch(
        `${apiEndpoint}/nfd/lookup?address=${encodeURIComponent(activeAddress)}&view=thumbnail`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal,
        },
      )

      // If we get a 404, it means the address doesn't have an NFD
      // We should return null and not retry
      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error(`NFD lookup failed: ${response.statusText}`)
      }

      const data: NfdLookupResponse = await response.json()
      return data[activeAddress]
    },
    enabled: enabled && !!activeAddress,
    // Don't retry for 404 responses
    retry: (failureCount, error) => {
      // If the error is a 404 (not found), don't retry
      if (error instanceof Error && error.message.includes('404')) {
        return false
      }

      // For other errors, retry up to 3 times
      return failureCount < 3
    },
    refetchOnWindowFocus: true,
  })
}
