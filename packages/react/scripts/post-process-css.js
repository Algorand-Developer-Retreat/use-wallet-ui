#!/usr/bin/env node
/**
 * Post-processes the generated Tailwind CSS file to ensure utility classes
 * have higher specificity than preflight styles when scoped.
 *
 * This script adds [data-wallet-ui] prefix to CSS class selectors to increase
 * their specificity and prevent them from being overridden by preflight styles.
 */

import fs from 'fs/promises'
import path from 'path'

const STYLE_FILE_PATH = path.resolve('./dist/style.css')

// Check if a line contains a top-level class selector
function isTopLevelClassSelector(line) {
  const trimmed = line.trim()
  // Skip existing prefixed lines, at-rules, and comments
  if (
    line.includes('[data-wallet-ui]') ||
    trimmed.startsWith('@') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('*')
  ) {
    return false
  }
  // Match a line that starts with a period followed by valid CSS class characters
  return /^\s*\.[a-zA-Z0-9_\-\\:]+[^\{]*\{/.test(line)
}

async function main() {
  try {
    // Read the generated CSS file
    const cssContent = await fs.readFile(STYLE_FILE_PATH, 'utf8')
    const lines = cssContent.split('\n')

    // Process each line
    const processedLines = lines.map((line) => {
      if (isTopLevelClassSelector(line)) {
        // Replace the first occurrence of a period with '[data-wallet-ui] .'
        return line.replace(/(\s*)\./, '$1[data-wallet-ui] .')
      }
      return line
    })

    // Write the processed content back to the file
    await fs.writeFile(STYLE_FILE_PATH, processedLines.join('\n'))

    console.log(
      `Processed CSS file to add [data-wallet-ui] prefix to class selectors in ${STYLE_FILE_PATH}`,
    )
  } catch (error) {
    console.error('Error processing CSS file:', error)
    process.exit(1)
  }
}

main()
