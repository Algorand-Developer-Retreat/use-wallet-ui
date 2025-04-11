import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider, WalletButton } from '@txnlab/use-wallet-ui-react'

import { AccountDisplay } from './components/AccountDisplay'

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
      <WalletUIProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-[#001324]">
          {/* Header */}
          <header className="w-full bg-white dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    use-wallet-ui
                  </span>
                </div>
                <div>
                  <WalletButton />
                </div>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                React Components for use-wallet
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A simple example demonstrating wallet connection, NFD profile
                integration, and balance display using the{' '}
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  @txnlab/use-wallet-ui-react
                </code>{' '}
                package.
              </p>
            </div>

            <AccountDisplay />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View the{' '}
                <a
                  href="https://github.com/Algorand-Developer-Retreat/use-wallet-ui"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  documentation
                </a>{' '}
                to learn more about implementing wallet integration in your
                dApp.
              </p>
            </div>
          </main>
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}

export default App
