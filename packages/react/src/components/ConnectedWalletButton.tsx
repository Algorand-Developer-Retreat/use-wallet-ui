import { useWallet } from '@txnlab/use-wallet-react'
import { formatNumber, formatShortAddress } from '@txnlab/utils-ts'
import React from 'react'

import { useAccountInfo } from '../hooks/useAccountInfo'
import { useNfd } from '../hooks/useNfd'
import { cn } from '../utils'

import { NfdAvatar } from './NfdAvatar'

export interface ConnectedWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBalance?: boolean
  showAvailableBalance?: boolean
}

export const ConnectedWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectedWalletButtonProps
>(
  (
    {
      className = '',
      showBalance = true,
      showAvailableBalance = false,
      children,
      ...props
    },
    ref,
  ) => {
    const { activeAddress } = useWallet()

    // Account information for the active address
    const { data: accountInfo } = useAccountInfo({ enabled: showBalance })

    // Calculate balance based on whether to show available balance or full balance
    const algoBalance = React.useMemo(() => {
      if (!accountInfo || accountInfo.amount === undefined) {
        return null
      }

      if (showAvailableBalance && accountInfo.minBalance !== undefined) {
        // Calculate available balance (amount - minBalance) and convert to ALGO
        const availableBalance =
          Number(accountInfo.amount) - Number(accountInfo.minBalance)
        return Math.max(0, availableBalance / 1_000_000) // Ensure we don't show negative balance
      }

      // Show full balance converted to ALGO
      return Number(accountInfo.amount) / 1_000_000
    }, [accountInfo, showAvailableBalance])

    // NFD for the active address
    const nfdQuery = useNfd({ enabled: !!activeAddress })
    const nfdName = nfdQuery.data?.name ?? null

    // Style for the connected button to match ConnectWalletButton height exactly
    const connectedButtonStyles = 'flex items-center'

    return (
      <button
        ref={ref}
        className={cn(connectedButtonStyles, className)}
        disabled={false}
        {...props}
        type="button"
      >
        {children || (
          <div className="flex items-center">
            {/* Conditionally render balance */}
            {showBalance && algoBalance !== null && (
              <div
                className="hidden md:flex items-center py-2.5 px-4 bg-gray-100 dark:bg-[#101B29] text-gray-600 dark:text-gray-400 rounded-xl mr-[-22px] font-medium"
                style={{ paddingRight: '32px' }}
              >
                {formatNumber(algoBalance, {
                  fractionDigits: 4,
                })}{' '}
                ALGO
              </div>
            )}

            {/* Always render the address or NFD name */}
            <div className="flex items-center py-2.5 pl-3 md:pl-3.5 pr-3 bg-[#2D2DF1] dark:bg-[#BFBFF9] text-white dark:text-[#001324] rounded-xl font-bold">
              {/* Avatar */}
              {activeAddress && (
                <div className="mr-1 md:mr-2 h-6 w-6 overflow-hidden">
                  <NfdAvatar
                    nfd={nfdQuery.data}
                    alt={`${nfdName || activeAddress} avatar`}
                    size={24}
                    lightOnly
                  />
                </div>
              )}

              <span className="hidden md:block max-w-[160px] truncate">
                {nfdName ||
                  (activeAddress
                    ? formatShortAddress(activeAddress, 6, 4)
                    : 'Connect')}
              </span>

              {/* Chevron icon */}
              {activeAddress && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-1.5 mt-0.5"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </button>
    )
  },
)

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
