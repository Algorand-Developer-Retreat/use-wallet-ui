import { afterEach, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

// Silence console messages during tests
console.error = vi.fn()
console.info = vi.fn()
console.warn = vi.fn()

// Reset mocks after each test
afterEach(() => {
  vi.resetAllMocks()
})
