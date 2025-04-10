# @txnlab/use-wallet-ui-react

React components for use-wallet UI.

## Prerequisites

This package requires the following peer dependencies:

- `@txnlab/use-wallet-react` v4
- React v18 or v19
- Tailwind CSS

Make sure these dependencies are installed in your project before using this package.

Note: While this package uses Tanstack Query internally for certain features (like NFD lookups), you don't need to install it separately unless you want to integrate with your existing Tanstack Query setup.

## Installation

```bash
# npm
npm install @txnlab/use-wallet-ui-react

# yarn
yarn add @txnlab/use-wallet-ui-react

# pnpm
pnpm add @txnlab/use-wallet-ui-react
```

## Usage

### Setting up the Provider

First, wrap your application with the `WalletUIProvider`:

```jsx
import { WalletProvider } from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'

function App() {
  return (
    <WalletProvider>
      <WalletUIProvider>{/* Your app content */}</WalletUIProvider>
    </WalletProvider>
  )
}
```

The `WalletUIProvider` handles features like [NFD (Non-Fungible Domains)](https://app.nf.domains/) lookups for Algorand addresses. It can work in two modes:

1. **Standalone Mode** - No additional setup required, just wrap your app
2. **Integration Mode** - Use with your existing Tanstack Query setup

#### Integration with Existing Tanstack Query Setup

If your app already uses Tanstack Query, you can pass your QueryClient to avoid duplicating caches:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletUIProvider queryClient={queryClient}>
          {/* Your app content */}
        </WalletUIProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}
```

### Using Wallet Components

There are three main ways to use the wallet UI components:

### Approach 1: Using Default Components

Use the `WalletButton` component for the simplest integration. It automatically handles both connected and disconnected states:

```jsx
import { WalletButton } from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  return (
    <div>
      <WalletButton />
    </div>
  )
}
```

That's it! The `WalletButton` component:

- Shows a connect button when disconnected
- Opens the wallet selection dialog when clicked
- Shows the connected wallet interface after connection
- Performs NFD lookups for Algorand addresses
- Handles disconnection

### Approach 2: Using Customized Button Components with Menus

You can use the button components as custom triggers for the menus, but with customized styling:

```jsx
import { useWallet } from '@txnlab/use-wallet-react'
import {
  ConnectWalletButton,
  ConnectWalletMenu,
  ConnectedWalletButton,
  ConnectedWalletMenu,
} from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  const { activeAddress } = useWallet()

  return (
    <div>
      {activeAddress ? (
        // Connected state with customized button
        <ConnectedWalletMenu>
          <ConnectedWalletButton
            className="border-2 border-blue-500"
            showBalance={false}
          />
        </ConnectedWalletMenu>
      ) : (
        // Disconnected state with customized button
        <ConnectWalletMenu>
          <ConnectWalletButton className="bg-green-500 hover:bg-green-600">
            Connect your wallet
          </ConnectWalletButton>
        </ConnectWalletMenu>
      )}
    </div>
  )
}
```

This approach lets you leverage the pre-built button components while still customizing their appearance and getting the dropdown functionality.

### Approach 3: Using Completely Custom UI Elements

If you want to use your own custom buttons or UI elements from scratch:

```jsx
import { useWallet } from '@txnlab/use-wallet-react'
import {
  ConnectWalletMenu,
  ConnectedWalletMenu,
} from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  const { activeAddress } = useWallet()

  return (
    <div>
      {activeAddress ? (
        // Connected state - completely custom button
        <ConnectedWalletMenu>
          <button className="custom-connected-button">
            My Custom Connected Button
          </button>
        </ConnectedWalletMenu>
      ) : (
        // Disconnected state - completely custom button
        <ConnectWalletMenu>
          <button className="custom-connect-button">
            My Custom Connect Button
          </button>
        </ConnectWalletMenu>
      )}
    </div>
  )
}
```

## Components

### WalletUIProvider

Enables features like NFD lookup for wallet addresses. It handles Tanstack Query setup internally, so you don't need to install Tanstack Query unless you want to integrate with your existing QueryClient.

```jsx
<WalletUIProvider>{/* Your app content */}</WalletUIProvider>
```

If you already use Tanstack Query in your app, you can pass your QueryClient:

```jsx
<WalletUIProvider queryClient={yourQueryClient}>
  {/* Your app content */}
</WalletUIProvider>
```

### WalletButton

The main component for most use cases. It intelligently switches between:

- `ConnectWalletMenu` (with default connect button) when disconnected
- `ConnectedWalletMenu` (with default wallet display) when connected

### ConnectWalletMenu

The menu for connecting a wallet. It provides a default connect button when no children are provided:

```jsx
<ConnectWalletMenu /> // Uses default connect button
```

Or with a custom button:

```jsx
<ConnectWalletMenu>
  <button>Custom Connect Button</button>
</ConnectWalletMenu>
```

### ConnectedWalletMenu

The dropdown menu for a connected wallet. It provides a default wallet display when no children are provided:

```jsx
<ConnectedWalletMenu /> // Uses default wallet display
```

Or with a custom trigger:

```jsx
<ConnectedWalletMenu>
  <button>Custom Connected Button</button>
</ConnectedWalletMenu>
```

### ConnectWalletButton

The default button for the disconnected state. Can be used directly:

```jsx
<ConnectWalletButton className="custom-class" />
```

### ConnectedWalletButton

The default button for the connected state that displays the wallet address and (optionally) the ALGO balance. Can be used directly:

```jsx
<ConnectedWalletButton
  className="custom-class"
  showBalance={true} // Set to false to hide balance
/>
```

### WalletList

The list of wallets shown in the connect dialog. Generally not used directly.

## NFD Integration

This library includes built-in support for NFD (Non-Fungible Domains) - the naming service for Algorand addresses. NFDs are unique, readable identities for Algorand wallets that allow users to replace their complex addresses with human-readable names.

When a wallet is connected, the library will automatically attempt to look up the NFD associated with the address and display it in the wallet menu.

The NFD lookup is handled through the `useNfd` hook which is used internally by the components but can also be used in your own components:

```jsx
import { useNfd } from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  const nfdQuery = useNfd()

  if (nfdQuery.isLoading) {
    return <div>Loading NFD data...</div>
  }

  const nfdName = nfdQuery.data?.name

  return <div>{nfdName || 'No NFD found'}</div>
}
```

The hook automatically:

- Fetches NFD data for the active wallet address
- Respects the connected network (MainNet/TestNet)
- Handles loading, error, and not-found states
- Properly caches results to minimize API calls

You can also configure the NFD lookup by passing options to the hook:

```jsx
// Using with options
const nfdQuery = useNfd({
  enabled: true, // Whether to enable the lookup (default: true)
  view: 'full', // The data view to request: 'tiny', 'thumbnail', 'brief', or 'full' (default: 'thumbnail')
})
```

For more information about NFDs, visit the [official NFD website](https://app.nf.domains/).

## ALGO Balance Integration

The library also provides a `useBalance` hook to easily fetch the ALGO balance for the connected wallet address. This hook uses Tanstack Query for efficient data fetching and caching.

```jsx
import { useBalance } from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  const balanceQuery = useBalance()

  if (balanceQuery.isLoading) {
    return <div>Loading balance...</div>
  }

  // The hook returns microalgos (1 ALGO = 1,000,000 microalgos)
  const microAlgos = balanceQuery.data

  // Convert to ALGO for display
  const algoBalance = microAlgos !== null ? microAlgos / 1_000_000 : null

  return (
    <div>
      {algoBalance !== null ? `${algoBalance} ALGO` : 'No balance found'}
    </div>
  )
}
```

The hook provides:

- Automatic fetching of the wallet's balance in microalgos
- Loading and error states
- Proper caching to minimize API calls

You can also configure the balance lookup:

```jsx
// Using with options
const balanceQuery = useBalance({
  enabled: true, // Whether to enable the balance lookup (default: true)
})
```

## How It Works

Both `ConnectWalletMenu` and `ConnectedWalletMenu` provide default UI elements when no children are passed:

1. When disconnected, `WalletButton` renders `ConnectWalletMenu` (which shows a default connect button)
2. When clicking the connect button, the wallet selection dialog appears
3. After connecting, `WalletButton` renders `ConnectedWalletMenu` (which shows the address and balance)
4. When clicking "Disconnect" in the menu, the wallet disconnects and `WalletButton` returns to step 1

## Styling

Components use Tailwind CSS classes with specific color variables that you can override using your Tailwind configuration.

## License

MIT
