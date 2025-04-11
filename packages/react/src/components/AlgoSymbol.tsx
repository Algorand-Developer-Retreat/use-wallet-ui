import { cn } from '../utils'

interface AlgoSymbolProps {
  className?: string
  /**
   * Size relative to current font size (1em = 100%)
   * @default 0.85
   */
  scale?: number
}

export function AlgoSymbol({ className, scale = 0.85 }: AlgoSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn('inline-block align-baseline', className)}
      style={{
        width: `${scale}em`,
        height: `${scale}em`,
      }}
      aria-label="Algorand"
      fill="currentColor"
    >
      <path d="M23.98 23.99h-3.75l-2.44-9.07-5.25 9.07H8.34l8.1-14.04-1.3-4.88L4.22 24H.02L13.88 0h3.67l1.61 5.96h3.79l-2.59 4.5 3.62 13.53z" />
    </svg>
  )
}
