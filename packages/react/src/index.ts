import './styles.css'
import { initializeFonts } from './utils/fontLoader'

export { ConnectWalletButton } from './components/ConnectWalletButton'
export { ConnectWalletMenu } from './components/ConnectWalletMenu'
export { ConnectedWalletButton } from './components/ConnectedWalletButton'
export { ConnectedWalletMenu } from './components/ConnectedWalletMenu'
export { WalletButton } from './components/WalletButton'
export { WalletList } from './components/WalletList'

// Hooks
export { useNfd } from './hooks/useNfd'
export type { NfdRecord, NfdLookupResponse } from './hooks/useNfd'
export { useBalance } from './hooks/useBalance'

// Providers
export { WalletUIProvider, useWalletUI } from './providers/WalletUIProvider'

// Initialize custom fonts
initializeFonts()
