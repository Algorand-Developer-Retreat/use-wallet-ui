import { useWallet } from '@txnlab/use-wallet-react'

import { ConnectedWalletMenu } from './ConnectedWalletMenu'
import { ConnectWalletMenu } from './ConnectWalletMenu'

export function WalletButton() {
  const { activeAddress } = useWallet()

  // If connected, show the connected wallet menu
  if (activeAddress) {
    return <ConnectedWalletMenu />
  }

  // If not connected, show the ConnectWalletMenu which defaults to ConnectWalletButton
  return <ConnectWalletMenu />
}
