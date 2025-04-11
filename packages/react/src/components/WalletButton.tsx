import { useWallet } from '@txnlab/use-wallet-react'

import { ConnectedWalletButton } from './ConnectedWalletButton'
import { ConnectedWalletMenu } from './ConnectedWalletMenu'
import { ConnectWalletMenu } from './ConnectWalletMenu'

export function WalletButton() {
  const { activeAddress } = useWallet()

  // If connected, show the connected wallet menu
  if (activeAddress) {
    return (
      <ConnectedWalletMenu>
        <ConnectedWalletButton />
      </ConnectedWalletMenu>
    )
  }

  // If not connected, show the ConnectWalletMenu which defaults to ConnectWalletButton
  return <ConnectWalletMenu />
}
