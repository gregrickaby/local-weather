import {Middleware} from '@reduxjs/toolkit'
import {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
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
        localStorage.setItem('location', JSON.stringify(action.payload))
      }

      if (setTempUnit.match(action)) {
        localStorage.setItem('tempUnit', action.payload)
      }

      if (setColorScheme.match(action)) {
        localStorage.setItem('colorScheme', action.payload)
      }

      if (
        addToFavorites.match(action) ||
        removeFromFavorites.match(action) ||
        clearFavorites.match(action)
      ) {
        localStorage.setItem(
          'favorites',
          JSON.stringify(state.preferences.favorites)
        )
      }
    }

    return result
  }
