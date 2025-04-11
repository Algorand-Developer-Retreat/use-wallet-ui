import { useWallet } from '@txnlab/use-wallet-react'
import { useAccountInfo, useNfd, NfdAvatar } from '@txnlab/use-wallet-ui-react'
import { formatNumber, formatShortAddress } from '@txnlab/utils-ts'

export function AccountDisplay() {
  const { activeAddress } = useWallet()
  const nfdQuery = useNfd()
  const accountQuery = useAccountInfo()

  if (!activeAddress) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Connect your Algorand wallet to view your NFD profile and balance
        </p>
      </div>
    )
  }

  if (nfdQuery.isLoading || accountQuery.isLoading) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          Loading wallet data...
        </p>
      </div>
    )
  }

  const nfd = nfdQuery.data ?? null
  const accountInfo = accountQuery.data
  const algoBalance = accountInfo ? Number(accountInfo.amount) / 1_000_000 : 0

  return (
    <div className="p-8 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <NfdAvatar nfd={nfd} size={64} className="rounded-xl" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {nfd?.name || formatShortAddress(activeAddress)}
            </h2>
            {nfd?.name && (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {formatShortAddress(activeAddress)}
              </p>
            )}
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatNumber(algoBalance, { fractionDigits: 4 })} ALGO
          </p>
        </div>
      </div>

      {nfd?.properties?.userDefined &&
        Object.keys(nfd.properties.userDefined).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              NFD Properties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(nfd.properties.userDefined).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {key}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {value}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
    </div>
  )
}
