import { useWallet } from '@txnlab/use-wallet-react'
import React, { useEffect, useState } from 'react'

export const ConnectWalletButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', children, ...props }, ref) => {
  const { activeAddress, algodClient } = useWallet()
  const [algoBalance, setAlgoBalance] = useState<number | null>(null)

  useEffect(() => {
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
  }, [activeAddress, algodClient])

  // Styles for the connect button (primary style)
  const connectButtonStyles =
    'bg-[#2D2DF1] dark:bg-[#BFBFF9] transition-colors hover:bg-[#2929D9] dark:hover:bg-[#D4D4FA] text-white dark:text-[#001324] font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 wallet-custom-font'

  // Secondary style for the connected state
  const connectedButtonStyles = 'relative flex items-center font-medium text-sm'

  if (activeAddress) {
    // Connected state
    return (
      <button
        ref={ref}
        className={`${connectedButtonStyles} ${className}`.trim()}
        disabled={false}
        {...props}
        type="button"
      >
        <div className="flex items-center">
          {/* Conditionally render balance */}
          {algoBalance !== null && (
            <div
              className="flex items-center h-9 px-3 py-1.5 bg-gray-100 dark:bg-[#101B29] text-gray-600 dark:text-gray-400 rounded-xl mr-[-20px]"
              style={{ paddingRight: '28px' }}
            >
              {algoBalance.toFixed(4)} ALGO
            </div>
          )}

          {/* Always render the address */}
          <div className="flex items-center h-9 px-3 py-1.5 bg-[#2D2DF1] dark:bg-[#BFBFF9] text-white dark:text-[#001324] rounded-xl">
            {activeAddress.substring(0, 6)}...
            {activeAddress.substring(activeAddress.length - 4)}
          </div>
        </div>
      </button>
    )
  }

  // Default disconnected state
  return (
    <button
      ref={ref}
      className={`${connectButtonStyles} ${className}`.trim()}
      {...props}
      type="button"
    >
      {children || 'Connect Wallet'}
    </button>
  )
})

ConnectWalletButton.displayName = 'ConnectWalletButton'
