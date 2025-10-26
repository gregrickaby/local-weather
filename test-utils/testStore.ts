import {
  configureStore,
  type PreloadedStateShapeFromReducersMapObject
} from '@reduxjs/toolkit'
import {airQualityApi} from '@/lib/store/services/airQualityApi'
import {placesApi} from '@/lib/store/services/placesApi'
import {weatherApi} from '@/lib/store/services/weatherApi'
import preferencesReducer from '@/lib/store/slices/preferencesSlice'

/**
 * Create a test store with optional preloaded state
 *
 * This is useful for testing Redux-connected components with specific initial state.
 * Unlike the production store, this excludes the localStorage middleware.
 *
 * @param preloadedState - Optional initial state for the store
 * @returns Configured Redux store for testing
 *
 * @example
 * ```tsx
 * const store = setupTestStore({
 *   preferences: {
 *     location: mockLocation,
 *     tempUnit: 'f'
 *   }
 * })
 * ```
 */
export function setupTestStore(
  preloadedState?: PreloadedStateShapeFromReducersMapObject<{
    preferences: ReturnType<typeof preferencesReducer>
    [weatherApi.reducerPath]: ReturnType<typeof weatherApi.reducer>
    [placesApi.reducerPath]: ReturnType<typeof placesApi.reducer>
    [airQualityApi.reducerPath]: ReturnType<typeof airQualityApi.reducer>
  }>
) {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      [weatherApi.reducerPath]: weatherApi.reducer,
      [placesApi.reducerPath]: placesApi.reducer,
      [airQualityApi.reducerPath]: airQualityApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(weatherApi.middleware)
        .concat(placesApi.middleware)
        .concat(airQualityApi.middleware),
    // Note: localStorage middleware is NOT included in test store
    preloadedState
  })
}

export type TestStore = ReturnType<typeof setupTestStore>
