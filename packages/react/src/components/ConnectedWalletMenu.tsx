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
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet-react'
import { formatShortAddress } from '@txnlab/utils-ts'
import React, { ReactElement, RefObject, useState } from 'react'

import { useNfd } from '../hooks/useNfd'
import { useWalletUI } from '../providers/WalletUIProvider'

import { ConnectedWalletButton } from './ConnectedWalletButton'
import { NfdAvatar } from './NfdAvatar'

// A more specific type for the children that includes ref
type RefableElement = ReactElement & {
  ref?: RefObject<HTMLElement> | ((instance: HTMLElement | null) => void)
}

export interface ConnectedWalletMenuProps {
  children?: RefableElement
}

function ConnectedWalletMenuContent({ children }: ConnectedWalletMenuProps) {
  const { activeAddress, activeWallet } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // NFD for the active address
  const nfdQuery = useNfd({ enabled: !!activeAddress })
  const nfdName = nfdQuery.data?.name ?? null

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

  const handleAccountChange = (accountAddress: string) => {
    if (activeWallet && activeWallet.setActiveAccount) {
      activeWallet.setActiveAccount(accountAddress)
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
                  <div className="h-12 w-12 overflow-hidden">
                    <NfdAvatar
                      nfd={nfdQuery.data}
                      alt={`${nfdName || activeAddress} avatar`}
                      size={48}
                    />
                  </div>
                  <div>
                    <h3
                      id={labelId}
                      className="text-lg font-bold text-gray-900 dark:text-[#E9E9FD] wallet-custom-font"
                    >
                      {nfdName ||
                        (activeAddress
                          ? formatShortAddress(activeAddress)
                          : 'My Wallet')}
                    </h3>
                    {activeAddress && !nfdName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatShortAddress(activeAddress)}
                      </p>
                    )}
                    {nfdName && activeAddress && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatShortAddress(activeAddress)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account selector (when multiple accounts available) */}
                {activeWallet &&
                  activeWallet.accounts &&
                  activeWallet.accounts.length > 1 && (
                    <div className="mb-4">
                      <Listbox
                        value={activeAddress || ''}
                        onChange={handleAccountChange}
                      >
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Account
                        </Label>
                        <div className="relative mt-1">
                          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-lg border border-gray-300 dark:border-[#192A39] bg-white dark:bg-[#101B29] py-2 px-3 text-left text-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D2DF1] dark:focus:ring-[#BFBFF9] focus:border-transparent text-sm">
                            <span className="col-start-1 row-start-1 truncate pr-8">
                              {activeAddress
                                ? formatShortAddress(activeAddress)
                                : 'Select account'}
                            </span>
                            <span className="col-start-1 row-start-1 self-center justify-self-end">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                              >
                                <path
                                  d="M4 6L8 10L12 6"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </ListboxButton>
                          <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-[#101B29] py-1 shadow-lg ring-1 ring-black/5 dark:ring-[#192A39]/50 focus:outline-none text-sm data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
                          >
                            {activeWallet.accounts.map((account) => (
                              <ListboxOption
                                key={account.address}
                                value={account.address}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-300 data-[focus]:bg-[#E9E9FD] dark:data-[focus]:bg-[#192A39] data-[focus]:text-gray-900 dark:data-[focus]:text-[#E9E9FD] data-[focus]:outline-none"
                              >
                                <span className="block truncate font-normal group-data-[selected]:font-medium">
                                  {formatShortAddress(account.address)}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2D2DF1] dark:text-[#BFBFF9] group-[&:not([data-selected])]:hidden">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M13.3334 4L6.00008 11.3333L2.66675 8"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>
                  )}

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-[#192A39] mt-2 mb-2"></div>

                {/* Wallet info section */}
                {activeWallet && (
                  <div className="mb-2 flex items-center gap-2 px-1 py-0.5">
                    <div className="h-5 w-5 flex items-center justify-center">
                      {activeWallet.metadata.icon ? (
                        <img
                          src={activeWallet.metadata.icon}
                          alt={`${activeWallet.metadata.name} icon`}
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-[#192A39] flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M17 9c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h4c.55 0 1-.45 1-1V9zm-1 0v8h-4V9h4zM8 4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v13c0 .55.45 1 1 1h4c.55 0 1-.45 1-1V4zM3 3h4v14H3V3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeWallet.metadata.name}
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-[#192A39] mb-3 mt-2"></div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {/* Copy Address Button */}
                  <button
                    onClick={handleCopyAddress}
                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-[#192A39] text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-[#263A4A] transition-colors text-sm flex items-center justify-center"
                    title="Copy address"
                  >
                    {isCopied ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500 mr-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  {/* Disconnect Button */}
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 py-2 px-4 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium rounded-xl hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}

// Need to provide the QueryClientProvider here because FloatingPortal breaks context inheritance
export function ConnectedWalletMenu(props: ConnectedWalletMenuProps) {
  const { queryClient } = useWalletUI()

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectedWalletMenuContent {...props} />
    </QueryClientProvider>
  )
}
