import { useWallet } from '@txnlab/use-wallet-react'
import { formatShortAddress } from '@txnlab/utils-ts'
import React from 'react'

import { useNfd } from '../hooks/useNfd'
import { cn } from '../utils'

import { NfdAvatar } from './NfdAvatar'

export interface ConnectedWalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties
}

export const ConnectedWalletButton = React.forwardRef<
  HTMLButtonElement,
  ConnectedWalletButtonProps
>(({ className = '', children, style, ...props }, ref) => {
  const { activeAddress } = useWallet()

  // NFD for the active address
  const nfdQuery = useNfd({ enabled: !!activeAddress })
  const nfdName = nfdQuery.data?.name ?? null

  // Style for the connected button to match ConnectWalletButton height exactly
  const connectedButtonStyles = 'flex items-center'

  return (
    <button
      ref={ref}
      className={cn(connectedButtonStyles, className)}
      style={style}
      disabled={false}
      {...props}
      type="button"
      data-wallet-ui
    >
      {children || (
        <div className="flex items-center">
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
})

ConnectedWalletButton.displayName = 'ConnectedWalletButton'
