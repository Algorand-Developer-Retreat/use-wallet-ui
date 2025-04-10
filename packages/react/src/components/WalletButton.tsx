import { useWallet } from '@txnlab/use-wallet-react'

import {
  ConnectedWalletButton,
  ConnectedWalletButtonProps,
} from './ConnectedWalletButton'
import { ConnectedWalletMenu } from './ConnectedWalletMenu'
import { ConnectWalletMenu } from './ConnectWalletMenu'

// Only include the balance configuration props, not styling props
type WalletButtonProps = Pick<
  ConnectedWalletButtonProps,
  'showBalance' | 'showAvailableBalance'
>

export function WalletButton({
  showBalance = true,
  showAvailableBalance = false,
}: WalletButtonProps) {
  const { activeAddress } = useWallet()

  // If connected, show the connected wallet menu
  if (activeAddress) {
    return (
      <ConnectedWalletMenu>
        <ConnectedWalletButton
          showBalance={showBalance}
          showAvailableBalance={showAvailableBalance}
        />
      </ConnectedWalletMenu>
    )
  }

  // If not connected, show the ConnectWalletMenu which defaults to ConnectWalletButton
  return <ConnectWalletMenu />
}
