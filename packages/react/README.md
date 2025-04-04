# @txnlab/use-wallet-ui-react

React components for use-wallet UI.

## Prerequisites

This package requires the following peer dependencies:

- `@txnlab/use-wallet-react` v4
- React v18 or v19
- Tailwind CSS v4 (v3 support will be added in a future release)

Make sure these dependencies are installed in your project before using this package.

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

There are three main ways to use the wallet UI components:

### Approach 1: Using Default Components (Recommended)

Use the `WalletButton` component for the simplest integration. It automatically handles both connected and disconnected states:

```jsx
import { WalletButton } from '@txnlab/use-wallet-ui-react'

function App() {
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

function App() {
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

function App() {
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

### Approach 4: Using Button Components Directly

You can also use the button components directly without the dropdown menus:

```jsx
import { useWallet } from '@txnlab/use-wallet-react'
import {
  ConnectWalletButton,
  ConnectedWalletButton,
} from '@txnlab/use-wallet-ui-react'

function App() {
  const { activeAddress } = useWallet()

  return (
    <div>
      {activeAddress ? (
        <ConnectedWalletButton
          className="custom-class"
          showBalance={false}
          onClick={() => console.log('Connected button clicked')}
        />
      ) : (
        <ConnectWalletButton
          className="custom-class"
          onClick={() => console.log('Connect button clicked')}
        />
      )}
    </div>
  )
}
```

## Components

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
