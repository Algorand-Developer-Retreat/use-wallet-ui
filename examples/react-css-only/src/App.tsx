import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletButton, WalletUIProvider } from '@txnlab/use-wallet-ui-react'

import { WalletInfo } from './components/WalletInfo'

import '@txnlab/use-wallet-ui-react/dist/style.css' // Import the pre-built CSS file
import './App.css'

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
        <div className="app-wrapper">
          {/* Header */}
          <header className="header">
            <div className="header-container">
              <div className="header-content">
                <div className="logo-container">
                  <span className="logo-text">use-wallet-ui</span>
                </div>
                <div data-wallet-ui className="wallet-button-container">
                  <WalletButton />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="main-content">
            <div className="title-section">
              <h1 className="main-title">React Components for use-wallet</h1>
              <p className="description">
                A simple example demonstrating wallet connection, NFD profile
                integration, and balance display using the{' '}
                <code className="code-block">@txnlab/use-wallet-ui-react</code>{' '}
                package.
              </p>
            </div>

            {/* Account Info */}
            <WalletInfo />

            {/* Documentation Link */}
            <div className="footer">
              <p className="footer-text">
                View the{' '}
                <a
                  href="https://github.com/Algorand-Developer-Retreat/use-wallet-ui"
                  className="documentation-link"
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
