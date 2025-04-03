import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { ConnectWalletButton, WalletDialog } from '@txnlab/use-wallet-ui-react'

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: 'fcfde0713d43baa0d23be0773c80a72b' },
    },
  ],
  defaultNetwork: NetworkId.TESTNET,
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <div className="min-h-screen dark:bg-[#001324]">
        {/* Header */}
        <header className="w-full bg-gray-50 dark:bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                {/* Logo or site name goes here */}
              </div>
              <div>
                <WalletDialog>
                  <ConnectWalletButton />
                </WalletDialog>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content goes here */}
        </main>
      </div>
    </WalletProvider>
  )
}

export default App
