import {Middleware} from '@reduxjs/toolkit'
import {
  clearSearchHistory,
  removeFromSearchHistory,
  setColorScheme,
  setLocation,
  setTempUnit
} from '../slices/preferencesSlice'

/**
 * Middleware to sync preferences to localStorage.
 */
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action)

    // Only run on client-side
    if (globalThis.window !== undefined) {
      const state = store.getState()

      if (setLocation.match(action)) {
        localStorage.setItem('location', action.payload)
        // Save updated search history
        localStorage.setItem(
          'searchHistory',
          JSON.stringify(state.preferences.searchHistory)
        )
      }

      if (setTempUnit.match(action)) {
        localStorage.setItem('tempUnit', action.payload)
      }

      if (setColorScheme.match(action)) {
        localStorage.setItem('colorScheme', action.payload)
      }

      if (
        clearSearchHistory.match(action) ||
        removeFromSearchHistory.match(action)
      ) {
        localStorage.setItem(
          'searchHistory',
          JSON.stringify(state.preferences.searchHistory)
        )
      }
    }

    return result
  }
