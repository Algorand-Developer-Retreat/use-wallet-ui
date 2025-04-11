import { useWallet } from '@txnlab/use-wallet-react'
import { useAccountInfo, useNfd, NfdAvatar } from '@txnlab/use-wallet-ui-react'
import { formatShortAddress, formatNumber } from '@txnlab/utils-ts'

export function WalletInfo() {
  const { activeAddress } = useWallet()
  const nfdQuery = useNfd()
  const accountQuery = useAccountInfo()

  if (!activeAddress) {
    return (
      <div className="connect-prompt">
        <div className="connect-icon">
          <svg viewBox="0 0 24 24" className="connect-svg">
            <path d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="connect-title">Connect Your Wallet</h3>
        <p className="connect-description">
          Connect your Algorand wallet to view your NFD profile and balance
        </p>
      </div>
    )
  }

  if (nfdQuery.isLoading || accountQuery.isLoading) {
    return (
      <div className="loading">
        <p className="loading-text">Loading wallet data...</p>
      </div>
    )
  }

  const nfd = nfdQuery.data ?? null
  const accountInfo = accountQuery.data
  const algoBalance = accountInfo ? Number(accountInfo.amount) / 1_000_000 : 0

  return (
    <div className="wallet-info">
      <div className="wallet-info-content">
        <div className="wallet-avatar-section">
          <NfdAvatar nfd={nfd} size={64} className="wallet-avatar" />
          <div>
            <h2 className="wallet-name">
              {nfd?.name || formatShortAddress(activeAddress)}
            </h2>
            {nfd?.name && (
              <p className="wallet-address">
                {formatShortAddress(activeAddress)}
              </p>
            )}
          </div>
        </div>

        <div className="balance-section">
          <p className="balance-label">Balance</p>
          <p className="balance-amount">
            {formatNumber(algoBalance, { fractionDigits: 4 })} ALGO
          </p>
        </div>
      </div>

      {nfd?.properties?.userDefined &&
        Object.keys(nfd.properties.userDefined).length > 0 && (
          <div className="nfd-properties">
            <h3 className="nfd-properties-title">NFD Properties</h3>
            <div className="nfd-properties-grid">
              {Object.entries(nfd.properties.userDefined).map(
                ([key, value]) => (
                  <div key={key} className="nfd-property">
                    <p className="nfd-property-key">{key}</p>
                    <p className="nfd-property-value">{value}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
    </div>
  )
}
