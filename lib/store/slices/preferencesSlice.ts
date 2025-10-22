import {DEFAULT_LOCATION} from '@/lib/constants'
import type {Location} from '@/lib/types'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type TempUnit = 'c' | 'f'
type ColorScheme = 'light' | 'dark' | 'auto'

interface PreferencesState {
  location: Location
  tempUnit: TempUnit
  colorScheme: ColorScheme
  searchHistory: Location[]
  mounted: boolean
}

const MAX_SEARCH_HISTORY = 10

/**
 * Load initial state from localStorage (with SSR safety).
 */
const getInitialState = (): PreferencesState => {
  if (globalThis.window === undefined) {
    return {
      location: DEFAULT_LOCATION,
      tempUnit: 'f',
      colorScheme: 'auto',
      searchHistory: [],
      mounted: false
    }
  }

  let location = DEFAULT_LOCATION
  let searchHistory: Location[] = []

  // Safely parse localStorage with try-catch
  try {
    const storedLocation = localStorage.getItem('location')
    if (storedLocation) {
      location = JSON.parse(storedLocation)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to parse stored location:', error)
    }
  }

  try {
    const storedHistory = localStorage.getItem('searchHistory')
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to parse search history:', error)
    }
  }

  return {
    location,
    tempUnit: (localStorage.getItem('tempUnit') as TempUnit) || 'f',
    colorScheme: (localStorage.getItem('colorScheme') as ColorScheme) || 'auto',
    searchHistory,
    mounted: true
  }
}

/**
 * Preferences slice for user settings.
 */
const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: getInitialState(),
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload

      // Add to search history if not already present (check by ID)
      const newLocation = action.payload
      const existingIndex = state.searchHistory.findIndex(
        (loc) => loc.id === newLocation.id
      )

      if (existingIndex >= 0) {
        // Move to front if already exists
        state.searchHistory = [
          newLocation,
          ...state.searchHistory.filter((loc) => loc.id !== newLocation.id)
        ]
      } else {
        state.searchHistory = [newLocation, ...state.searchHistory].slice(
          0,
          MAX_SEARCH_HISTORY
        )
      }
    },
    setTempUnit: (state, action: PayloadAction<TempUnit>) => {
      state.tempUnit = action.payload
    },
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload
    },
    clearSearchHistory: (state) => {
      state.searchHistory = []
    },
    removeFromSearchHistory: (state, action: PayloadAction<number>) => {
      state.searchHistory = state.searchHistory.filter(
        (loc) => loc.id !== action.payload
      )
    },
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.mounted = action.payload
    }
  }
})

export const {
  setLocation,
  setTempUnit,
  setColorScheme,
  clearSearchHistory,
  removeFromSearchHistory,
  setMounted
} = preferencesSlice.actions

export default preferencesSlice.reducer
