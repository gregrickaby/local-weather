import type {RootState} from '@/lib/store'
import theme from '@/lib/theme'
import {MantineProvider} from '@mantine/core'
import {render, type RenderOptions} from '@testing-library/react'
import type {ReactElement} from 'react'
import {Provider} from 'react-redux'
import {setupTestStore} from './testStore'

/**
 * Extended render options that include preloaded state for Redux
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
}

/**
 * Custom render function that wraps components with necessary providers
 *
 * This includes:
 * - Redux Provider with test store (no localStorage middleware)
 * - Mantine Provider with theme
 *
 * @param ui - Component to render
 * @param options - Render options including preloadedState
 * @returns Render result with store
 *
 * @example
 * ```tsx
 * const { store } = renderWithProviders(<MyComponent />, {
 *   preloadedState: {
 *     preferences: {
 *       location: mockLocation,
 *       tempUnit: 'f'
 *     }
 *   }
 * })
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {preloadedState, ...renderOptions}: ExtendedRenderOptions = {}
) {
  const store = setupTestStore(preloadedState as any)

  function Wrapper({children}: {children: React.ReactNode}) {
    return (
      <Provider store={store}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, {wrapper: Wrapper, ...renderOptions})
  }
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react'
export {renderWithProviders as render}
