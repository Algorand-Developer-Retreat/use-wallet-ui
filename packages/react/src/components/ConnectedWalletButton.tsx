import { useWallet } from '@txnlab/use-wallet-react'
import React, { useEffect, useState } from 'react'

export interface ConnectedWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBalance?: boolean
}

export const ConnectedWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectedWalletButtonProps
>(({ className = '', showBalance = true, children, ...props }, ref) => {
  const { activeAddress, algodClient } = useWallet()
  const [algoBalance, setAlgoBalance] = useState<number | null>(null)

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
              {algoBalance.toFixed(4)} ALGO
            </div>
          )}

          {/* Always render the address */}
          <div className="flex items-center py-2.5 px-4 bg-[#2D2DF1] dark:bg-[#BFBFF9] text-white dark:text-[#001324] rounded-xl font-bold">
            {activeAddress?.substring(0, 6)}...
            {activeAddress?.substring(activeAddress?.length - 4)}
          </div>
        </div>
      )}
    </button>
  )
})

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
