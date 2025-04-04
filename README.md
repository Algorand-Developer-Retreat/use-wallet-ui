# use-wallet UI

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

Use the `WalletButton` component for the simplest integration:

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

The `WalletButton` component automatically handles both connected and disconnected states.

### Approach 2: Using Customized Button Components with Menus

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
        <ConnectedWalletMenu>
          <ConnectedWalletButton className="border-2 border-blue-500" />
        </ConnectedWalletMenu>
      ) : (
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

### Approach 3: Using Completely Custom UI Elements

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
        <ConnectedWalletMenu>
          <button className="custom-connected-button">
            My Custom Connected Button
          </button>
        </ConnectedWalletMenu>
      ) : (
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

For more detailed documentation, please refer to the [package README](./packages/react/README.md).

## Example

Check out the [working example](./examples/react) in the `examples/react` directory.

## Package

- [@txnlab/use-wallet-ui-react](./packages/react) - React components for use-wallet UI

## Development

This project uses PNPM workspaces. To get started:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## Contributing

Please see our [Contributing Guidelines](./CONTRIBUTING.md) for more details on how to get involved.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes following our [commit message guidelines](./CONTRIBUTING.md#git-commit-guidelines)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License
