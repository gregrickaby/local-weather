import {createSelector} from '@reduxjs/toolkit'
import type {RootState} from './index'

/**
 * Memoized Redux selectors for efficient state access.
 *
 * Using createSelector from Redux Toolkit provides automatic memoization,
 * preventing unnecessary re-renders when selector inputs haven't changed.
 */

// Base selector for preferences slice
export const selectPreferences = (state: RootState) => state.preferences

// Memoized selector for weather query parameters
// This combines commonly-used preferences into a single selector
// to reduce the number of useAppSelector calls in hooks
export const selectWeatherQueryParams = createSelector(
  [selectPreferences],
  (prefs) => ({
    location: prefs.location,
    tempUnit: prefs.tempUnit,
    mounted: prefs.mounted,
    latitude: prefs.location.latitude,
    longitude: prefs.location.longitude
  })
)

// Individual memoized selectors for specific preferences
export const selectLocation = createSelector(
  [selectPreferences],
  (prefs) => prefs.location
)

export const selectTempUnit = createSelector(
  [selectPreferences],
  (prefs) => prefs.tempUnit
)

export const selectMounted = createSelector(
  [selectPreferences],
  (prefs) => prefs.mounted
)

export const selectColorScheme = createSelector(
  [selectPreferences],
  (prefs) => prefs.colorScheme
)

export const selectFavorites = createSelector(
  [selectPreferences],
  (prefs) => prefs.favorites
)
