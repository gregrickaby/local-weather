/**
 * Test utilities for Vitest + React Testing Library
 *
 * This module exports:
 * - Custom render function with Redux + Mantine providers
 * - Test store setup utilities
 * - Mock data for testing
 * - MSW handlers and server
 *
 * @example
 * ```tsx
 * import { render, screen, userEvent } from '@/test-utils'
 * import { mockLocation } from '@/test-utils/mocks/mockData'
 *
 * test('renders component', () => {
 *   render(<MyComponent />, {
 *     preloadedState: {
 *       preferences: { location: mockLocation }
 *     }
 *   })
 *   expect(screen.getByText('Hello')).toBeInTheDocument()
 * })
 * ```
 */

// Export custom render and all RTL utilities
export * from './render'

// Export test store utilities
export {setupTestStore, type TestStore} from './testStore'

// Export mock data
export * from './mocks/mockData'

// Export MSW utilities
export {server} from './msw/server'
export {handlers} from './msw/handlers'
