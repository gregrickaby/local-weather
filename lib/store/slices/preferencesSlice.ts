import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type TempUnit = 'c' | 'f'
type ColorScheme = 'light' | 'dark' | 'auto'

interface PreferencesState {
  location: string
  tempUnit: TempUnit
  colorScheme: ColorScheme
  searchHistory: string[]
  mounted: boolean
}

const MAX_SEARCH_HISTORY = 10

/**
 * Load initial state from localStorage (with SSR safety).
 */
const getInitialState = (): PreferencesState => {
  if (globalThis.window === undefined) {
    return {
      location: 'Enterprise, AL',
      tempUnit: 'f',
      colorScheme: 'auto',
      searchHistory: [],
      mounted: false
    }
  }

  const storedHistory = localStorage.getItem('searchHistory')
  const searchHistory = storedHistory ? JSON.parse(storedHistory) : []

  return {
    location: localStorage.getItem('location') || 'Enterprise, AL',
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
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload

      // Add to search history if not already present
      const newLocation = action.payload
      if (state.searchHistory.includes(newLocation)) {
        // Move to front if already exists
        state.searchHistory = [
          newLocation,
          ...state.searchHistory.filter((loc) => loc !== newLocation)
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
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        (loc) => loc !== action.payload
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
