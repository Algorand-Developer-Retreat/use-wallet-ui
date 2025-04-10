import { useWallet } from '@txnlab/use-wallet-react'
import { formatNumber, formatShortAddress } from '@txnlab/utils-ts'
import React from 'react'

import { useAccountInfo } from '../hooks/useAccountInfo'
import { useNfd } from '../hooks/useNfd'

export interface ConnectedWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBalance?: boolean
}

export const ConnectedWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectedWalletButtonProps
>(({ className = '', showBalance = true, children, ...props }, ref) => {
  const { activeAddress } = useWallet()

  // Account information for the active address
  const { data: accountInfo } = useAccountInfo({ enabled: showBalance })

  // Extract microalgos from accountInfo and convert to ALGO (1 ALGO = 1,000,000 microalgos)
  const algoBalance =
    accountInfo && accountInfo.amount !== undefined
      ? Number(accountInfo.amount) / 1_000_000
      : null

  // NFD for the active address
  const nfdQuery = useNfd({ enabled: !!activeAddress })
  const nfdName = nfdQuery.data?.name ?? null

  // Style for the connected button to match ConnectWalletButton height exactly
  const connectedButtonStyles = 'flex items-center'

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
              (activeAddress ? formatShortAddress(activeAddress) : 'Connect')}
          </div>
        </div>
      )}
    </button>
  )
})

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
