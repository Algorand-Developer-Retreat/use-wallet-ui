# use-wallet UI

Ready-to-use UI components for Algorand wallet integration, built as a companion to [@txnlab/use-wallet](https://github.com/TxnLab/use-wallet).

[![npm version](https://img.shields.io/npm/v/@txnlab/use-wallet-ui-react.svg)](https://www.npmjs.com/package/@txnlab/use-wallet-ui-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![Preview of use-wallet UI components](./preview.png)

## Features

- 🔌 **Simple Integration**: Drop-in components for wallet connection
- 🧠 **Smart Components**: Automatic detection of connected state
- 🎨 **Styling Options**: Works with or without Tailwind CSS
- 🏷️ **NFD Support**: Built-in NFD integration
- 🔄 **Account Management**: Switch between accounts and wallets
- 🌓 **Dark Mode**: Automatic light/dark theme support
- 🚀 **Framework Support**: Currently React, with Vue and SolidJS coming soon

## Quick Start

```bash
npm install @txnlab/use-wallet-ui-react
```

```jsx
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider, WalletButton } from '@txnlab/use-wallet-ui-react'

// Optional: Import pre-built styles if not using Tailwind
// import '@txnlab/use-wallet-ui-react/dist/style.css'

// Configure the wallets you want to use
const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    // Add more wallets as needed
  ],
  defaultNetwork: NetworkId.TESTNET,
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        {/* Add data-wallet-ui attribute if NOT using Tailwind */}
        <div data-wallet-ui>
          <WalletButton />
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}
```

That's it! You now have a fully functional wallet connection system.

For complete documentation, see [React Package Documentation](./packages/react/README.md).

## Packages

- [@txnlab/use-wallet-ui-react](./packages/react) - React components for use-wallet UI

## Examples

Check out our working examples:

- [Tailwind CSS Example](./examples/react) - Integration with Tailwind CSS
- [CSS-only Example](./examples/react-css-only) - Integration without Tailwind CSS

## Documentation

For detailed documentation, please see:

- [React Package README](./packages/react/README.md)

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
