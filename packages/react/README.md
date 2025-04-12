# @txnlab/use-wallet-ui-react

React components for use-wallet UI. This library provides polished UI components for Algorand wallet integration that work with or without Tailwind CSS.

## Dependencies

### Required

- `@txnlab/use-wallet-react` v4
- React v18 or v19

### Optional Integrations

- **Tanstack Query**: Used internally for NFD lookups. You can integrate with your existing Tanstack Query setup (see [Provider Integration](#integration-with-existing-tanstack-query-setup)).
- **Tailwind CSS**: Optional for styling. The library works with or without Tailwind (see [Styling Options](#styling-options)).

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
          <ConnectedWalletButton className="border-2 border-blue-500" />
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

This approach lets you leverage the pre-built button components while still customizing their appearance and getting the dropdown functionality. For customization options, see the [Styling Options](#styling-options) section.

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

## Styling Options

This library provides two styling approaches: using Tailwind CSS for maximum customization or using the pre-built CSS file for simpler integration.

### With Tailwind CSS v4

Tailwind CSS v4 introduced the `@source` directive which makes it easy to integrate with component libraries:

1. Install Tailwind CSS v4 according to your project's framework setup:

   - See the [Tailwind CSS Installation Guide](https://tailwindcss.com/docs/installation) for framework-specific instructions

2. In your CSS file, add:

   ```css
   @import 'tailwindcss';
   @source "../node_modules/@txnlab/use-wallet-ui-react";
   ```

   This uses the [`@source` directive](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources) to tell Tailwind to scan our library for classes. The path might need to be adjusted depending on your project structure.

### With Tailwind CSS v3

If you're using Tailwind CSS v3, you'll need to configure it to scan our library's components:

1. Install Tailwind CSS v3 according to your project's framework setup:

   - See the [Tailwind CSS v3 Installation Guide](https://v3.tailwindcss.com/docs/installation) for framework-specific instructions

2. Configure your `tailwind.config.js` to include our components in the content scanning:

   ```js
   module.exports = {
     content: [
       // Your project files
       './src/**/*.{js,ts,jsx,tsx}',

       // Add this line to scan our library's components
       './node_modules/@txnlab/use-wallet-ui-react/dist/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. In your CSS file, import Tailwind's styles as usual:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

The key difference between v3 and v4 is that v3 requires explicit content configuration to scan node_modules, while v4 provides the `@source` directive to simplify this process.

### For Projects Without Tailwind CSS

If your project doesn't use Tailwind CSS, you can still use this library by importing our pre-built CSS file. This approach provides a simpler integration path without requiring Tailwind in your project:

```jsx
// Import the pre-built CSS
import '@txnlab/use-wallet-ui-react/dist/style.css'

// Then use the components as usual
import { WalletButton } from '@txnlab/use-wallet-ui-react'

function App() {
  return (
    // Add the data-wallet-ui attribute to the container of your wallet components
    <div data-wallet-ui>
      <WalletButton />
    </div>
  )
}
```

**IMPORTANT:** You must add the `data-wallet-ui` attribute to the container of your wallet components. This scopes Tailwind's base styles to only affect components within this container, preventing style conflicts with your application's existing styles.

#### Customizing Components in Non-Tailwind Projects

You have two options for customizing components without Tailwind:

1. **Use the `style` prop**: Both `ConnectWalletButton` and `ConnectedWalletButton` components accept a `style` prop for inline CSS customization:

```jsx
import {
  ConnectWalletButton,
  ConnectWalletMenu,
} from '@txnlab/use-wallet-ui-react'

function App() {
  return (
    <ConnectWalletMenu>
      <ConnectWalletButton
        style={{
          backgroundColor: '#3366FF',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Connect your wallet
      </ConnectWalletButton>
    </ConnectWalletMenu>
  )
}
```

2. **Use CSS selectors**: Target the components with your own CSS rules:

```css
/* In your CSS file */
.wallet-custom-font {
  font-family: 'Your Custom Font', sans-serif;
}

button[type='button'] {
  /* Additional styling */
}
```

Note that when using the pre-built CSS without Tailwind:

- You won't be able to customize the components using Tailwind's theme system
- The bundle size might be larger than a targeted build with only the styles you need
- This is ideal for quickly integrating our components into an existing project without Tailwind

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

#### Account Data Prefetching

The WalletUIProvider automatically prefetches data for all accounts in a connected wallet, not just the active one. This provides a smoother user experience when switching between accounts in the same wallet, as the data is already in the cache.

This prefetching:

- Happens once when a wallet is first connected
- Uses efficient batch requests for NFD lookups (up to 20 addresses per request)
- Prefetches both NFD data and account balances
- Will trigger again if the wallet disconnects and reconnects

You can configure or disable this behavior:

```jsx
<WalletUIProvider
  // Turn off automatic prefetching if desired (enabled by default)
  enablePrefetching={false}
  // Change the NFD view type for prefetching (defaults to 'thumbnail')
  prefetchNfdView="brief"
>
  {/* Your app content */}
</WalletUIProvider>
```

### WalletButton

The main component for most use cases. It intelligently switches between:

- `ConnectWalletMenu` (with default connect button) when disconnected
- `ConnectedWalletMenu` (with default wallet display) when connected

```jsx
<WalletButton />
```

For styling and other customizations, use the component-specific approaches (Approach 2 or 3) instead.

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

You can also use inline styles with the `style` prop for projects without Tailwind CSS:

```jsx
<ConnectWalletButton
  style={{
    backgroundColor: '#FF5733',
    color: 'white',
    borderRadius: '8px',
  }}
/>
```

### ConnectedWalletButton

The default button for the connected state that displays the wallet address and NFD information. Can be used directly:

```jsx
<ConnectedWalletButton className="custom-class" />
```

You can also use inline styles with the `style` prop for projects without Tailwind CSS:

```jsx
<ConnectedWalletButton
  style={{
    border: '2px solid #3366FF',
    borderRadius: '8px',
  }}
/>
```

### NfdAvatar

A component that displays NFD avatar images with automatic handling of IPFS URLs and fallbacks.

```jsx
import { useNfd, NfdAvatar } from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  // Get NFD data for the connected address
  const nfdQuery = useNfd()

  return (
    <div className="flex items-center">
      {/* Basic usage with NFD data */}
      <NfdAvatar nfd={nfdQuery.data} />

      {/* Custom size, alt text, and additional classes */}
      <NfdAvatar
        nfd={nfdQuery.data}
        size={64}
        alt="User avatar"
        className="border-2 border-blue-500"
      />

      {/* With custom fallback element */}
      <NfdAvatar
        nfd={nfdQuery.data}
        fallback={<div className="custom-fallback">No Avatar</div>}
      />
    </div>
  )
}
```

**Props**:

- `nfd` - NFD record containing avatar data (from the `useNfd` hook)
- `alt` - Optional alt text for the image (defaults to NFD name or 'NFD Avatar')
- `className` - Optional className for styling the image
- `size` - Optional size in pixels (defaults to 40px)
- `fallback` - Optional custom element to show when no avatar is available

**Features**:

- Handles IPFS URLs by converting them to HTTPS
- Checks availability on images.nf.domains and falls back to IPFS gateway if needed
- Caches results using TanStack Query for better performance
- Provides a default user icon as fallback when no avatar is available
- Supports both light and dark mode with appropriate styling

### WalletList

The list of wallets shown in the connect dialog. Generally not used directly.

## NFD Integration

This library includes built-in support for NFD (Non-Fungible Domains) - the naming service for Algorand addresses. NFDs are unique, readable identities for Algorand wallets that allow users to replace their complex addresses with human-readable names.

When a wallet is connected, the library will automatically attempt to look up the NFD associated with the address and display it in the wallet menu.

### NFD Avatar Component

For displaying NFD avatars with proper handling of IPFS URLs, use the `NfdAvatar` component:

```jsx
import { useNfd, NfdAvatar } from '@txnlab/use-wallet-ui-react'

function MyNfdProfile() {
  const nfdQuery = useNfd()
  const nfd = nfdQuery.data

  return (
    <div className="flex items-center gap-3">
      <NfdAvatar nfd={nfd} size={48} />
      <div>
        <h2>{nfd?.name || 'No NFD found'}</h2>
      </div>
    </div>
  )
}
```

The `NfdAvatar` component automatically:

- Extracts the avatar URL from the NFD record
- Converts IPFS URLs to HTTPS URLs
- Checks availability on images.nf.domains and falls back to IPFS gateway if needed
- Provides a nice fallback user icon when no avatar is available
- Works with both light and dark mode

### NFD Data Hook

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

The library provides a `useAccountInfo` hook to easily fetch the account information for the connected wallet address, including the ALGO balance. This hook uses Tanstack Query for efficient data fetching and caching.

```jsx
import { useAccountInfo } from '@txnlab/use-wallet-ui-react'

function MyComponent() {
  const accountQuery = useAccountInfo()

  if (accountQuery.isLoading) {
    return <div>Loading account data...</div>
  }

  // The account info includes amount in microalgos (1 ALGO = 1,000,000 microalgos)
  const accountInfo = accountQuery.data

  if (!accountInfo) {
    return <div>No account data found</div>
  }

  // Convert microalgos to ALGO for display
  const algoBalance = Number(accountInfo.amount) / 1_000_000

  // Calculate available balance (total minus minimum required balance)
  const availableBalance = Math.max(
    0,
    (Number(accountInfo.amount) - Number(accountInfo.minBalance)) / 1_000_000,
  )

  return (
    <div>
      <p>Total Balance: {algoBalance} ALGO</p>
      <p>Available Balance: {availableBalance} ALGO</p>
    </div>
  )
}
```

The hook provides:

- Automatic fetching of the wallet's full account information
- Access to all account properties including total amount and minimum balance
- Loading and error states
- Proper caching to minimize API calls

You can also configure the account info lookup:

```jsx
// Using with options
const accountQuery = useAccountInfo({
  enabled: true, // Whether to enable the account lookup (default: true)
})
```

## How It Works

Both `ConnectWalletMenu` and `ConnectedWalletMenu` provide default UI elements when no children are passed:

1. When disconnected, `WalletButton` renders `ConnectWalletMenu` (which shows a default connect button)
2. When clicking the connect button, the wallet selection dialog appears
3. After connecting, `WalletButton` renders `ConnectedWalletMenu` (which shows the address and balance)
4. When clicking "Disconnect" in the menu, the wallet disconnects and `WalletButton` returns to step 1

## License

MIT
