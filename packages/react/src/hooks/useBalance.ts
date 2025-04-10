import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet-react'

/**
 * Custom hook to fetch account balance for Algorand address
 *
 * @param options.enabled Whether to enable the balance lookup (defaults to true)
 * @returns Balance data query result in microalgos
 */
export function useBalance(
  options: { enabled?: boolean } = {},
): UseQueryResult<number | null> {
  const { activeAddress, algodClient } = useWallet()
  const { enabled = true } = options

  return useQuery({
    queryKey: ['account-balance', activeAddress],
    queryFn: async () => {
      if (!activeAddress || !algodClient) return null

      try {
        const accountInfo = await algodClient
          .accountInformation(activeAddress)
          .do()
        // Return microAlgos directly
        return Number(accountInfo.amount)
      } catch (error) {
        throw new Error(`Error fetching account balance: ${error}`)
      }
    },
    enabled: enabled && !!activeAddress && !!algodClient,
    refetchOnWindowFocus: true,
  })
}
