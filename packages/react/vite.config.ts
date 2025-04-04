import { promises as fs } from 'fs'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'use-wallet-ui-react',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', '@txnlab/use-wallet-react'],
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          entryFileNames: 'index.js',
          preserveModules: false,
          exports: 'named',
          assetFileNames: 'assets/[name][extname]',
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          entryFileNames: 'index.cjs',
          preserveModules: false,
          exports: 'named',
          assetFileNames: 'assets/[name][extname]',
        },
      ],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      onwarn(warning, warn) {
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('use client')
        ) {
          return
        }
        warn(warning)
      },
    },
    sourcemap: true,
    minify: true,
  },
  plugins: [
    dts({
      outDir: 'dist/types',
      rollupTypes: true,
      include: ['src'],
      compilerOptions: {
        declarationMap: true,
      },
      // Use afterBuild hook to copy .d.ts to .d.cts
      afterBuild: async () => {
        try {
          const dtsPath = resolve(__dirname, 'dist/types/index.d.ts')
          const dctsPath = resolve(__dirname, 'dist/types/index.d.cts')
          const content = await fs.readFile(dtsPath, 'utf-8')
          await fs.writeFile(dctsPath, content)
          console.log('Successfully created .d.cts file')
        } catch (error) {
          console.error('Error creating .d.cts file:', error)
        }
      },
    }),
  ],
  // Ensure proper asset handling
  assetsInclude: ['**/*.woff2'],
})
