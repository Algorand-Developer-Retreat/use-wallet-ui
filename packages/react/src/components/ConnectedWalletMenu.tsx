import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  useId,
} from '@floating-ui/react'
import { useWallet } from '@txnlab/use-wallet-react'
import React, { ReactElement, RefObject, useState } from 'react'

import { ConnectedWalletButton } from './ConnectedWalletButton'

// A more specific type for the children that includes ref
type RefableElement = ReactElement & {
  ref?: RefObject<HTMLElement> | ((instance: HTMLElement | null) => void)
}

export interface ConnectedWalletMenuProps {
  children?: RefableElement
}

export function ConnectedWalletMenu({ children }: ConnectedWalletMenuProps) {
  const { activeAddress, activeWallet } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ])

  const labelId = useId()

  const handleCopyAddress = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleDisconnect = async () => {
    if (activeWallet) {
      try {
        await activeWallet.disconnect()
        setIsOpen(false)
      } catch (error) {
        console.error('Error disconnecting wallet:', error)
      }
    }
  }

  // If no children are provided, create the default connected button
  const triggerElement = children || <ConnectedWalletButton />

  // Clone the trigger element with the reference props
  const trigger = React.cloneElement(
    triggerElement,
    getReferenceProps({ ref: refs.setReference }),
  )

  return (
    <>
      {trigger}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              aria-labelledby={labelId}
              className="z-50 w-72 rounded-xl bg-white dark:bg-[#001324] shadow-xl border border-gray-200 dark:border-[#192A39]"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-[#192A39] flex items-center justify-center overflow-hidden">
                    {/* Placeholder avatar */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400 dark:text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      id={labelId}
                      className="text-lg font-bold text-gray-900 dark:text-[#E9E9FD] wallet-custom-font"
                    >
                      My Wallet
                    </h3>
                    {activeWallet && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activeWallet.metadata.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address with copy button */}
                <div className="mb-4 p-2 bg-gray-100 dark:bg-[#192A39] rounded-lg flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-300 truncate mr-2">
                    {activeAddress}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="flex-shrink-0 p-1.5 rounded-md bg-white dark:bg-[#101B29] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#0A141E] transition-colors"
                    title="Copy address"
                  >
                    {isCopied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Disconnect button */}
                <button
                  onClick={handleDisconnect}
                  className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
