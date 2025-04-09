import { useWallet, useNetwork } from '@txnlab/use-wallet-react'
import { formatNumber } from '@txnlab/utils-ts'
import React, { useEffect, useState } from 'react'

// NFD types
type NfdRecord = {
  name: string
  properties: {
    verified: {
      [key: string]: boolean
    }
    userDefined: {
      [key: string]: string
    }
  }
}

type NfdLookupResponse = {
  [address: string]: NfdRecord | null
}

export interface ConnectedWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBalance?: boolean
  /** Whether to fetch and display NFD names. Defaults to true. */
  fetchNfd?: boolean
}

export const ConnectedWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectedWalletButtonProps
>(
  (
    { className = '', showBalance = true, fetchNfd = true, children, ...props },
    ref,
  ) => {
    const { activeAddress, algodClient } = useWallet()
    const { activeNetwork } = useNetwork()
    const [algoBalance, setAlgoBalance] = useState<number | null>(null)
    const [nfdName, setNfdName] = useState<string | null>(null)

    useEffect(() => {
      // Only fetch balance if showBalance is true
      if (!showBalance) return

      const fetchBalance = async () => {
        if (activeAddress && algodClient) {
          try {
            const accountInfo = await algodClient
              .accountInformation(activeAddress)
              .do()
            const microAlgos = Number(accountInfo.amount)
            const balance = microAlgos / 1_000_000
            setAlgoBalance(balance)
          } catch (error) {
            console.error('Error fetching account balance:', error)
            setAlgoBalance(null)
          }
        } else {
          setAlgoBalance(null)
        }
      }

      fetchBalance()
    }, [activeAddress, algodClient, showBalance])

    // NFD lookup based on activeAddress and activeNetwork
    useEffect(() => {
      // Skip fetching if fetchNfd is false or no activeAddress
      if (!fetchNfd || !activeAddress) {
        setNfdName(null)
        return
      }

      const fetchNfdName = async () => {
        try {
          // Determine the API endpoint based on the network
          // Only check for TestNet, otherwise use MainNet
          const isTestnet = activeNetwork === 'testnet'
          const apiEndpoint = isTestnet
            ? 'https://api.testnet.nf.domains'
            : 'https://api.nf.domains'

          const response = await fetch(
            `${apiEndpoint}/nfd/lookup?address=${encodeURIComponent(activeAddress)}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
            },
          )

          if (response.ok) {
            const data: NfdLookupResponse = await response.json()
            const nfd = data[activeAddress]
            if (nfd) {
              setNfdName(nfd.name)
            } else {
              setNfdName(null)
            }
          } else {
            setNfdName(null)
          }
        } catch (error) {
          console.error('Error fetching NFD name:', error)
          setNfdName(null)
        }
      }

      fetchNfdName()
    }, [activeAddress, activeNetwork, fetchNfd])

    // Style for the connected button to match ConnectWalletButton height exactly
    const connectedButtonStyles = 'flex items-center'

    // Helper function to truncate addresses
    const ellipseAddress = (address: string) => {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    return (
      <button
        ref={ref}
        className={`${connectedButtonStyles} ${className}`.trim()}
        disabled={false}
        {...props}
        type="button"
      >
        {children || (
          <div className="flex items-center">
            {/* Conditionally render balance */}
            {showBalance && algoBalance !== null && (
              <div
                className="flex items-center py-2.5 px-4 bg-gray-100 dark:bg-[#101B29] text-gray-600 dark:text-gray-400 rounded-xl mr-[-22px] font-medium"
                style={{ paddingRight: '32px' }}
              >
                {formatNumber(algoBalance, {
                  fractionDigits: 4,
                })}{' '}
                ALGO
              </div>
            )}

            {/* Always render the address or NFD name */}
            <div className="flex items-center py-2.5 px-4 bg-[#2D2DF1] dark:bg-[#BFBFF9] text-white dark:text-[#001324] rounded-xl font-bold">
              {nfdName ||
                (activeAddress ? ellipseAddress(activeAddress) : 'Connect')}
            </div>
          </div>
        )}
      </button>
    )
  },
)

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
