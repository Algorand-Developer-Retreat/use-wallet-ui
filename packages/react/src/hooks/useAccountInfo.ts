import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet-react'
import algosdk from 'algosdk'

/**
 * Custom hook to fetch account information for Algorand address
 *
 * @param options.enabled Whether to enable the account lookup (defaults to true)
 * @returns Account information query result
 */
export function useAccountInfo(
  options: { enabled?: boolean } = {},
): UseQueryResult<algosdk.modelsv2.Account | null> {
  const { activeAddress, algodClient } = useWallet()
  const { enabled = true } = options

  return useQuery({
    queryKey: ['account-info', activeAddress],
    queryFn: async () => {
      if (!activeAddress || !algodClient) return null

      try {
        const accountInfo = await algodClient
          .accountInformation(activeAddress)
          .do()
        // Return the entire accountInfo object
        return accountInfo
      } catch (error) {
        throw new Error(`Error fetching account information: ${error}`)
      }
    },
    enabled: enabled && !!activeAddress && !!algodClient,
    refetchOnWindowFocus: true,
  })
}
