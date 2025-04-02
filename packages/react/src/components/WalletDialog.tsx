import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
  useId,
} from '@floating-ui/react'
import { useWallet } from '@txnlab/use-wallet-react'
import React, { ReactElement, RefObject } from 'react'

import { WalletList } from './WalletList'

import type { Wallet } from '@txnlab/use-wallet-react'

// A more specific type for the children that includes ref
type RefableElement = ReactElement & {
  ref?: RefObject<HTMLElement> | ((instance: HTMLElement | null) => void)
}

export interface WalletDialogProps {
  children?: RefableElement
}

export function WalletDialog({ children }: WalletDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { wallets } = useWallet()

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  })

  // Interaction hooks
  const click = useClick(context)
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const role = useRole(context, { role: 'dialog' })

  // Merge interaction props
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  // Accessibility IDs
  const labelId = useId()
  const descriptionId = useId()

  const handleWalletClick = async (wallet: Wallet) => {
    try {
      await wallet.connect()
      setIsOpen(false)
    } catch (error) {
      console.error(`Error connecting to ${wallet.metadata.name}:`, error)
      setIsOpen(false)
    }
  }

  const triggerRef = useMergeRefs([refs.setReference, children?.ref || null])

  const trigger = children
    ? React.cloneElement(children, getReferenceProps({ ref: triggerRef }))
    : null

  return (
    <>
      {trigger}
      <FloatingPortal id="wallet-dialog-portal">
        {isOpen && (
          <FloatingOverlay
            className="grid place-items-center bg-black/30 z-50"
            lockScroll
          >
            <FloatingFocusManager context={context} modal={true}>
              <div
                ref={refs.setFloating}
                {...getFloatingProps({
                  'aria-labelledby': labelId,
                  'aria-describedby': descriptionId,
                })}
                className="w-full max-w-sm rounded-3xl bg-white shadow-xl"
              >
                {/* Header */}
                <div className="relative flex items-center px-6 pt-5 pb-4">
                  <h2
                    id={labelId}
                    className="text-xl font-bold text-gray-900 wallet-custom-font"
                  >
                    Connect a Wallet
                  </h2>
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Close dialog"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Wallet list */}
                <div className="px-4 pb-3">
                  <WalletList
                    wallets={wallets}
                    handleWalletClick={handleWalletClick}
                  />
                </div>

                {/* Footer section */}
                <div className="px-6 py-5 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Need an Algorand wallet?
                  </span>
                  <a
                    href="https://algorand.co/wallets"
                    className="text-[#2D2DF1]/80 font-medium text-sm hover:text-[#2D2DF1]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start here →
                  </a>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}
