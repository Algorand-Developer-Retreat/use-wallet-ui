import type { Wallet } from '@txnlab/use-wallet-react'

export interface WalletListProps {
  wallets: Wallet[]
  handleWalletClick: (wallet: Wallet) => Promise<void>
}

export function WalletList({ wallets, handleWalletClick }: WalletListProps) {
  return (
    <ul className="space-y-1.5">
      {wallets.map((wallet) => (
        <li key={wallet.id}>
          <button
            onClick={() => handleWalletClick(wallet)}
            className="flex w-full items-center gap-3 py-1.5 px-1.5 text-left text-gray-800 transition-colors hover:bg-[#E9E9FD] rounded-xl"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={wallet.metadata.icon}
                alt={`${wallet.metadata.name} icon`}
                className="h-8 w-8 object-contain rounded-md"
              />
            </div>
            <span className="text-lg font-medium">{wallet.metadata.name}</span>
          </button>
        </li>
      ))}
      {wallets.length === 0 && (
        <p className="text-center text-gray-500">No wallets found.</p>
      )}
    </ul>
  )
}
