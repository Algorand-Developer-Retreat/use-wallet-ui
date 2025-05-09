import React from 'react'

import { cn } from '../utils'

export interface ConnectWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties
}

export const ConnectWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectWalletButtonProps
>(({ className = '', children, style, ...props }, ref) => {
  // Style for the connect button
  const connectButtonStyles =
    'bg-[#2D2DF1] dark:bg-[#BFBFF9] transition-colors hover:bg-[#2929D9] dark:hover:bg-[#D4D4FA] text-white dark:text-[#001324] font-bold py-2.5 px-4 rounded-xl cursor-pointer disabled:opacity-50 wallet-custom-font'

  return (
    <button
      ref={ref}
      className={cn(connectButtonStyles, className)}
      style={style}
      {...props}
      type="button"
    >
      {children || 'Connect Wallet'}
    </button>
  )
})

ConnectWalletButton.displayName = 'ConnectWalletButton'
