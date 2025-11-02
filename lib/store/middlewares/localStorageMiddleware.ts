import {Middleware} from '@reduxjs/toolkit'
import {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation,
  setTempUnit
} from '../slices/preferencesSlice'

// Debounce timer for batching localStorage writes
let storageTimer: NodeJS.Timeout | null = null
const STORAGE_DEBOUNCE_MS = 100

/**
 * Middleware to sync preferences to localStorage.
 * Debounces writes to reduce localStorage I/O operations.
 */
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action)

    // Only run on client-side
    if (globalThis.window !== undefined) {
      const state = store.getState()

      // Track which keys need to be updated
      const updates: Record<string, string> = {}

      if (setLocation.match(action)) {
        updates.location = JSON.stringify(action.payload)
      }

      if (setTempUnit.match(action)) {
        updates.tempUnit = action.payload
      }

      if (setColorScheme.match(action)) {
        updates.colorScheme = action.payload
      }

      if (
        addToFavorites.match(action) ||
        removeFromFavorites.match(action) ||
        clearFavorites.match(action)
      ) {
        updates.favorites = JSON.stringify(state.preferences.favorites)
      }

      // If there are updates, debounce the actual localStorage writes
      if (Object.keys(updates).length > 0) {
        // Clear existing timer
        if (storageTimer) {
          clearTimeout(storageTimer)
        }

        // Batch the writes after a short delay
        storageTimer = setTimeout(() => {
          for (const [key, value] of Object.entries(updates)) {
            localStorage.setItem(key, value)
          }
          storageTimer = null
        }, STORAGE_DEBOUNCE_MS)
      }
    }

    return result
  }
