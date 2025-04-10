import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
  useWallet,
} from '@txnlab/use-wallet-react'
import {
  WalletButton,
  WalletUIProvider,
  useNfd,
} from '@txnlab/use-wallet-ui-react'

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

// Component to demonstrate NFD data access
function NfdDisplay() {
  const { activeAddress } = useWallet()
  const nfdQuery = useNfd()

  if (!activeAddress) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">
          Connect a wallet to see NFD information
        </p>
      </div>
    )
  }

  if (nfdQuery.isLoading) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">Loading NFD data...</p>
      </div>
    )
  }

  const nfd = nfdQuery.data ?? null
  const avatarImage =
    nfd?.properties?.userDefined?.avatar || nfd?.properties?.verified?.avatar

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        NFD Information
      </h2>

      {nfd ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {avatarImage && (
              <img
                src={avatarImage}
                alt={`${nfd.name} avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium text-lg text-gray-900 dark:text-white">
                {nfd.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeAddress.substring(0, 6)}...
                {activeAddress.substring(activeAddress.length - 4)}
              </p>
            </div>
          </div>

          {nfd.properties?.userDefined &&
            Object.keys(nfd.properties.userDefined).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Properties
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(nfd.properties.userDefined).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">
                          {key}:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No NFD found for this address
        </p>
      )}
    </div>
  )
}

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
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
                <code>{'<WalletButton />'}</code> directly which will show
                either <code>{'<ConnectWalletMenu />'}</code> or{' '}
                <code>{'<ConnectedWalletMenu />'}</code> depending on connection
                state.
              </p>
            </div>

            {/* NFD Display Section */}
            <div className="mt-12 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                NFD Integration
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                This component uses the <code>useNfd</code> hook to access NFD
                data from anywhere in your app. Thanks to the{' '}
                <code>WalletUIProvider</code>, the NFD query data is shared
                between this component and the wallet menu.
              </p>

              <NfdDisplay />
            </div>
          </main>
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}

export default App
