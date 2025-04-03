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
      <div className="flex flex-col items-center justify-center h-screen dark:bg-[#001324]">
        <WalletDialog>
          <ConnectWalletButton />
        </WalletDialog>
      </div>
    </WalletProvider>
  )
}

export default App
