import { useWallet } from '@txnlab/use-wallet-react'
import { formatNumber } from '@txnlab/utils-ts'
import React from 'react'

import { useBalance } from '../hooks/useBalance'
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

  // Use the balance hook (returns microalgos)
  const { data: microAlgos } = useBalance({ enabled: showBalance })

  // Convert microalgos to ALGO (1 ALGO = 1,000,000 microalgos)
  const algoBalance =
    microAlgos !== null && microAlgos !== undefined
      ? microAlgos / 1_000_000
      : null

  // Use the NFD hook
  const nfdQuery = useNfd()
  const nfdName = nfdQuery.data?.name ?? null

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
})

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
