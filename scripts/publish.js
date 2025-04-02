import { publish } from '@tanstack/config/publish'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const config = {
  packages: [
    {
      name: '@txnlab/use-wallet-ui-react',
      packageDir: 'packages/react',
    },
  ],
  branchConfigs: {
    main: {
      prerelease: false,
    },
    next: {
      prerelease: true,
    },
    beta: {
      prerelease: true,
    },
    alpha: {
      prerelease: true,
    },
  },
  rootDir,
}

await publish({
  ...config,
  branch: process.env.BRANCH,
  tag: process.env.TAG,
  ghToken: process.env.GH_TOKEN,
})

process.exit(0)
