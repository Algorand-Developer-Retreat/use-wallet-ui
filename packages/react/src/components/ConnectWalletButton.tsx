import React from 'react'

export const ConnectWalletButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', children, ...props }, ref) => {
  // Style for the connect button (primary style)
  const connectButtonStyles =
    'bg-[#2D2DF1] dark:bg-[#BFBFF9] transition-colors hover:bg-[#2929D9] dark:hover:bg-[#D4D4FA] text-white dark:text-[#001324] font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 wallet-custom-font'

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
