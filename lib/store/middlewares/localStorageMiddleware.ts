import {Middleware} from '@reduxjs/toolkit'
import {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation,
  setTempUnit
} from '../slices/preferencesSlice'

const STORAGE_DEBOUNCE_MS = 100

/**
 * Middleware to sync preferences to localStorage.
 * Debounces writes to reduce localStorage I/O operations.
 * Accumulates updates to ensure no writes are lost during rapid dispatches.
 */
export const localStorageMiddleware: Middleware = (store) => {
  // Debounce timer and pending updates are now per-store instance
  let storageTimer: NodeJS.Timeout | null = null
  let pendingUpdates: Record<string, string> = {}
  return (next) => (action) => {
    const result = next(action)

    // Only run on client-side
    if (globalThis.window !== undefined) {
      const state = store.getState()

      if (setLocation.match(action)) {
        pendingUpdates.location = JSON.stringify(action.payload)
      }

      if (setTempUnit.match(action)) {
        pendingUpdates.tempUnit = action.payload
      }

      if (setColorScheme.match(action)) {
        pendingUpdates.colorScheme = action.payload
      }

      if (
        addToFavorites.match(action) ||
        removeFromFavorites.match(action) ||
        clearFavorites.match(action)
      ) {
        pendingUpdates.favorites = JSON.stringify(state.preferences.favorites)
      }

      // If there are pending updates, debounce the actual localStorage writes
      if (Object.keys(pendingUpdates).length > 0) {
        // Clear existing timer
        if (storageTimer) {
          clearTimeout(storageTimer)
        }

        // Batch the writes after a short delay
        storageTimer = setTimeout(() => {
          for (const [key, value] of Object.entries(pendingUpdates)) {
            localStorage.setItem(key, value)
          }
          // Clear pending updates after writing
          pendingUpdates = {}
          storageTimer = null
        }, STORAGE_DEBOUNCE_MS)
      }
    }

    return result
  }
}
