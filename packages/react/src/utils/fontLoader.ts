/**
 * Initiates font injection process with SSR safety mechanisms.
 * Defers actual injection to ensure compatibility with various rendering environments.
 * @private
 */
const injectFonts = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      performFontInjection()
    })
  } else {
    setTimeout(performFontInjection, 0)
  }
}

/**
 * Handles the actual font injection process.
 * Creates a style element with font-face declarations and appends it to document head.
 * Includes fallback mechanisms for various failure scenarios.
 * @private
 */
const performFontInjection = (): void => {
  try {
    const existingStyle = document.getElementById('wallet-ui-fonts')
    if (existingStyle) return

    const style = document.createElement('style')
    style.id = 'wallet-ui-fonts'

    let fontUrl = ''
    try {
      fontUrl = new URL(
        '../fonts/Aeonik-Bold.woff2',
        import.meta.url,
      ).toString()
    } catch (urlError) {
      console.warn(
        'Could not resolve font URL. Using fallback styling.',
        urlError,
      )
    }

    style.textContent = `
      @font-face {
        font-family: 'Aeonik';
        src: url('${fontUrl}') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      
      .wallet-custom-font {
        font-family: 'Aeonik', system-ui, sans-serif !important;
      }
    `
    document.head.appendChild(style)
    console.log('Wallet UI fonts loaded')
  } catch (error) {
    console.warn(
      'Failed to load custom fonts, using system fonts instead',
      error,
    )
  }
}

/**
 * Initializes font loading for the UI components.
 * Safe to use in any environment (SSR, CSR, Next.js, etc).
 * Will automatically inject the Aeonik font for components using the 'wallet-custom-font' class.
 * Falls back gracefully to system fonts if loading fails.
 */
export const initializeFonts = (): void => {
  if (typeof window !== 'undefined') {
    injectFonts()
  }
}
