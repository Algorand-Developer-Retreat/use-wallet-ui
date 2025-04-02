import { useWallet } from '@txnlab/use-wallet-react'
import React from 'react'

export const ConnectWalletButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', children, ...props }, ref) => {
  const { activeAddress } = useWallet()

  const defaultStyles =
    'bg-[#5858F0] hover:bg-[#2D2DF1] text-white font-bold py-2.5 px-4 rounded-xl disabled:opacity-50'

  // TODO: Later, this button will change appearance if wallet is connected
  if (activeAddress) {
    // This will be a different component entirely for the connected state (showing address, balance, etc.)
    // For now, just render a disabled button placeholder
    return (
      <button
        ref={ref}
        className={`${defaultStyles} ${className}`.trim()}
        disabled={true}
        {...props}
        type="button"
      >
        {activeAddress.substring(0, 6)}...
        {activeAddress.substring(activeAddress.length - 4)}
      </button>
    )
  }

  return (
    <button
      ref={ref}
      className={`${defaultStyles} ${className}`.trim()}
      {...props}
      type="button"
    >
      {children || 'Connect Wallet'}
    </button>
  )
})

ConnectWalletButton.displayName = 'ConnectWalletButton'
