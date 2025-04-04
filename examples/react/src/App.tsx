import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletButton } from '@txnlab/use-wallet-ui-react'

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
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  use-wallet-ui Demo
                </span>
              </div>
              <div>
                <WalletButton />
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center my-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Algorand Wallet Integration Example
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              This example demonstrates the use of @txnlab/use-wallet-ui-react
              components with the simplified API. You can use{' '}
              <code>{'<WalletButton />'}</code> directly which will show either{' '}
              <code>{'<ConnectWalletMenu />'}</code> or{' '}
              <code>{'<ConnectedWalletMenu />'}</code> depending on connection
              state.
            </p>
          </div>
        </main>
      </div>
    </WalletProvider>
  )
}

export default App
