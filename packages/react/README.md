# @txnlab/use-wallet-ui-react

Ready-to-use UI components for Algorand wallet integration, built as a companion to [@txnlab/use-wallet](https://github.com/TxnLab/use-wallet).

[![npm version](https://img.shields.io/npm/v/@txnlab/use-wallet-ui-react.svg)](https://www.npmjs.com/package/@txnlab/use-wallet-ui-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
npm install @txnlab/use-wallet-ui-react
```

This package provides polished UI components that work on top of `@txnlab/use-wallet-react`. Choose the setup that matches your project:

### If you're using Tailwind CSS

```jsx
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider, WalletButton } from '@txnlab/use-wallet-ui-react'

// Configure the wallets you want to use
const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    // Add more wallets as needed
  ],
  defaultNetwork: NetworkId.MAINNET,
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        <div>
          <WalletButton />
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}
```

### If you're NOT using Tailwind CSS

```jsx
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider, WalletButton } from '@txnlab/use-wallet-ui-react'
// Import our pre-built styles
import '@txnlab/use-wallet-ui-react/dist/style.css'

// Configure the wallets you want to use
const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    // Add more wallets as needed
  ],
  defaultNetwork: NetworkId.MAINNET,
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        {/* Add data-wallet-ui attribute when not using Tailwind */}
        <div data-wallet-ui>
          <WalletButton />
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}
```

That's it! You now have a fully functional wallet connection system with:

- Clean, accessible UI components
- NFD integration
- ALGO balance display
- Account switching
- Dark/light mode support

> **Note:** This is the React implementation of the UI components. Future versions will support Vue and SolidJS to match all frameworks supported by the core `@txnlab/use-wallet` library.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Installation](#installation)
- [Styling Options](#styling-options)
  - [Without Tailwind CSS](#without-tailwind-css)
  - [With Tailwind CSS](#with-tailwind-css)
- [Basic Usage](#basic-usage)
- [Component API](#component-api)
- [NFD Integration](#nfd-integration)
- [Account Information](#account-information)
- [Advanced Customization](#advanced-customization)
- [Integration with Tanstack Query](#integration-with-tanstack-query)
- [How It Works](#how-it-works)
- [License](#license)

---

## Dependencies

### Required

- `@txnlab/use-wallet-react` v4
- `algosdk` v3 (required for use-wallet v4)
- React v18 or v19

### Optional & Integrated

- **Tanstack Query**: Used internally for NFD lookups (built-in, but can integrate with your existing setup)
- **Tailwind CSS**: Supported but not required (the library works with or without it)

## Installation

```bash
# npm
npm install @txnlab/use-wallet-ui-react

# yarn
yarn add @txnlab/use-wallet-ui-react

# pnpm
pnpm add @txnlab/use-wallet-ui-react
```

## Styling Options

The library supports two styling approaches:

### Option 1: Using Tailwind CSS (Recommended)

Using [Tailwind CSS](https://tailwindcss.com/) provides the richest customization experience:

- Full access to Tailwind's utility classes for customization
- Hover, focus, and active states with simple modifiers
- Dark mode support with the `dark:` variant
- Responsive design with breakpoint prefixes
- Animation and transition utilities
- Theme customization through your Tailwind config

#### With Tailwind CSS v4

```css
/* In your CSS file */
@import 'tailwindcss';
@source "../node_modules/@txnlab/use-wallet-ui-react";
```

This uses the `@source` directive to tell Tailwind to scan our library for classes. See the [Tailwind CSS v4 Installation Guide](https://tailwindcss.com/docs/installation) for setup instructions.

#### With Tailwind CSS v3

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add this line to scan our components
    './node_modules/@txnlab/use-wallet-ui-react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  // ...rest of your config
}
```

See the [Tailwind CSS v3 Installation Guide](https://v3.tailwindcss.com/docs/installation) for setup instructions.

### Option 2: Using the Pre-built CSS

For projects that don't use Tailwind, we provide a pre-built CSS file:

```jsx
// 1. Import the pre-built CSS
import '@txnlab/use-wallet-ui-react/dist/style.css'

function App() {
  return (
    // 2. Add the data-wallet-ui attribute to any container with wallet components
    <div data-wallet-ui>
      <WalletButton />
    </div>
  )
}
```

**Important:** Add the `data-wallet-ui` attribute to scope our styles and prevent conflicts with your application's existing styles.

While this approach offers less flexibility for customization compared to Tailwind, it provides a simple way to use the components with minimal setup.

## Basic Usage

This library builds on top of `@txnlab/use-wallet-react` to provide UI components for wallet connectivity. Here's the basic setup:

### 1. Set up the Providers

```jsx
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'

// Create and configure the wallet manager
const walletManager = new WalletManager({
  wallets: [
    // Add the wallets you want to support
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    // For WalletConnect, you'll need a project ID
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: 'your-project-id' },
    },
  ],
  defaultNetwork: NetworkId.TESTNET, // Or MAINNET for production
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>{/* Your app content */}</WalletUIProvider>
    </WalletProvider>
  )
}
```

The `WalletProvider` from `@txnlab/use-wallet-react` manages the wallet connections using the provided `WalletManager` configuration, while `WalletUIProvider` adds UI-specific features like NFD lookups and data prefetching.

### 2. Add the Wallet Button

The simplest way to enable wallet connectivity is with the `WalletButton` component:

```jsx
import { WalletButton } from '@txnlab/use-wallet-ui-react'

function MyNav() {
  return (
    <nav>
      <WalletButton />
    </nav>
  )
}
```

The `WalletButton` is an all-in-one solution that:

- Shows a connect button when disconnected
- Opens the wallet selection dialog when clicked
- Displays the connected wallet after connection
- Shows NFD names and avatars when available
- Provides access to account switching and disconnection

## Component API

The library provides several components that can be used independently or together:

### WalletUIProvider

Required wrapper that enables NFD lookups and data prefetching:

```jsx
<WalletUIProvider
  // Optional configurations
  enablePrefetching={false} // Prefetch data for all accounts in a wallet (default: true)
  prefetchNfdView="brief" // Data view for NFD prefetching (default: 'thumbnail')
  queryClient={yourQueryClient} // Optional: integrate with existing Tanstack Query
>
  {/* Your app content */}
</WalletUIProvider>
```

### WalletButton

All-in-one solution for wallet connectivity - combines the connect and connected states:

```jsx
<WalletButton />
```

### Connection Components

For more customization, use these component pairs:

#### Connect State (when disconnected)

```jsx
import { ConnectWalletButton, ConnectWalletMenu } from '@txnlab/use-wallet-ui-react'

// Just the menu with default button:
<ConnectWalletMenu />

// Customized button:
<ConnectWalletMenu>
  <ConnectWalletButton className="bg-blue-500">
    Connect Wallet
  </ConnectWalletButton>
</ConnectWalletMenu>

// Fully custom trigger:
<ConnectWalletMenu>
  <button className="my-custom-button">Connect</button>
</ConnectWalletMenu>
```

#### Connected State (when wallet is connected)

```jsx
import { ConnectedWalletButton, ConnectedWalletMenu } from '@txnlab/use-wallet-ui-react'

// Just the menu with default button:
<ConnectedWalletMenu />

// Customized button:
<ConnectedWalletMenu>
  <ConnectedWalletButton className="border-2 border-green-500" />
</ConnectedWalletMenu>

// Fully custom trigger:
<ConnectedWalletMenu>
  <div className="flex items-center gap-2">
    <span>My Wallet</span>
  </div>
</ConnectedWalletMenu>
```

### NfdAvatar

Renders NFD avatars with automatic IPFS gateway handling:

```jsx
import { useNfd, NfdAvatar } from '@txnlab/use-wallet-ui-react'

function Profile() {
  const nfdQuery = useNfd()

  return (
    <NfdAvatar
      nfd={nfdQuery.data}
      size={48}
      className="rounded-full border-2"
      alt="User profile"
    />
  )
}
```

## NFD Integration

This library includes built-in support for [NFD (Non-Fungible Domains)](https://app.nf.domains/) - Algorand's naming service that provides human-readable identities for wallet addresses.

### The useNfd Hook

```jsx
import { useNfd } from '@txnlab/use-wallet-ui-react'

function Profile() {
  // Gets NFD data for the currently connected address
  const nfdQuery = useNfd()

  if (nfdQuery.isLoading) return <div>Loading...</div>

  // Access NFD properties
  const name = nfdQuery.data?.name
  const userProperties = nfdQuery.data?.properties?.userDefined

  return (
    <div>
      <h2>{name || 'No NFD found'}</h2>
      <p>{userProperties?.bio || 'No bio'}</p>
    </div>
  )
}
```

### NFD Features

- Automatic lookup for the active wallet address
- Support for different data views: 'tiny', 'thumbnail', 'brief', 'full'
- Efficient caching via Tanstack Query
- Works with both MainNet and TestNet

```jsx
// Customizing the NFD lookup
const nfdQuery = useNfd({
  enabled: true, // Whether to enable the lookup
  view: 'brief', // Data view to request (default: 'thumbnail')
})
```

## Account Information

Get account data like ALGO balance and asset holdings using the `useAccountInfo` hook:

```jsx
import { useAccountInfo } from '@txnlab/use-wallet-ui-react'

function Balance() {
  // Gets account data for the connected address
  const accountQuery = useAccountInfo()

  if (accountQuery.isLoading) return <div>Loading...</div>
  if (!accountQuery.data) return <div>No account data</div>

  // Convert microAlgos to Algos (1 ALGO = 1,000,000 microAlgos)
  const algoBalance = Number(accountQuery.data.amount) / 1_000_000

  // Available balance (total minus minimum required)
  const minBalance = Number(accountQuery.data.minBalance) / 1_000_000
  const availableBalance = Math.max(0, algoBalance - minBalance)

  return (
    <div>
      <div>Total: {algoBalance.toFixed(2)} ALGO</div>
      <div>Available: {availableBalance.toFixed(2)} ALGO</div>
    </div>
  )
}
```

## Advanced Customization

### Styling Without Tailwind

When not using Tailwind, you have two options for customizing components:

#### 1. Using the `style` prop

```jsx
<ConnectWalletButton
  style={{
    backgroundColor: '#3366FF',
    color: 'white',
    fontWeight: 'bold',
  }}
>
  Connect
</ConnectWalletButton>
```

#### 2. Using CSS selectors

First, add a custom class to the button:

```jsx
<ConnectWalletButton className="connect-button">Connect</ConnectWalletButton>
```

Then target it in your CSS:

```css
/* In your CSS */
[data-wallet-ui] .connect-button {
  font-family: 'Your Custom Font', sans-serif;
  background-color: #3366ff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

[data-wallet-ui] .connect-button:hover {
  background-color: #2952cc;
}
```

### Building Custom Wallet UI

For complete control, use the menu components with your own UI elements:

```jsx
import { useWallet } from '@txnlab/use-wallet-react'
import {
  ConnectWalletMenu,
  ConnectedWalletMenu,
} from '@txnlab/use-wallet-ui-react'

function CustomWalletButton() {
  const { activeAddress } = useWallet()

  return activeAddress ? (
    <ConnectedWalletMenu>
      <YourCustomConnectedButton />
    </ConnectedWalletMenu>
  ) : (
    <ConnectWalletMenu>
      <YourCustomConnectButton />
    </ConnectWalletMenu>
  )
}
```

## Integration with Tanstack Query

This library uses [Tanstack Query](https://tanstack.com/query/latest) internally for data fetching. If your application already uses Tanstack Query, you can integrate the two to avoid duplicate caches:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'

const queryClient = new QueryClient()
const walletManager = new WalletManager({...})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider manager={walletManager}>
        <WalletUIProvider queryClient={queryClient}>
          {/* Your app */}
        </WalletUIProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}
```

By sharing the QueryClient, both your application and the wallet UI components will use the same query cache.

## How It Works

The library follows a simple workflow:

1. **Disconnected State**: `WalletButton` shows a connect button
2. **Connection Dialog**: Clicking opens a dropdown with available Algorand wallets
3. **Connected State**: After connecting, it displays the wallet address/NFD and balance
4. **Account Management**: The dropdown provides options to switch accounts or disconnect

Behind the scenes, `WalletUIProvider` handles:

- Prefetching NFD data for all accounts in the wallet
- Converting IPFS URLs to HTTPS for avatars
- Caching API responses for better performance
- Handling network-specific behavior (MainNet/TestNet)

## Related Resources

- [use-wallet Documentation](https://github.com/TxnLab/use-wallet)
- [use-wallet-react NPM Package](https://www.npmjs.com/package/@txnlab/use-wallet-react)
- [NFD (Non-Fungible Domains)](https://nf.domains/)
- [Algorand Developer Portal](https://developer.algorand.org/)

## License

MIT
