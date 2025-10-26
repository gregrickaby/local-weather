import {DEFAULT_LOCATION} from '@/lib/constants'
import type {Location} from '@/lib/types'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type TempUnit = 'c' | 'f'
type ColorScheme = 'light' | 'dark' | 'auto'

interface PreferencesState {
  location: Location
  tempUnit: TempUnit
  colorScheme: ColorScheme
  favorites: Location[]
  mounted: boolean
}

/**
 * Load initial state from localStorage (with SSR safety).
 */
const getInitialState = (): PreferencesState => {
  if (globalThis.window === undefined) {
    return {
      location: DEFAULT_LOCATION,
      tempUnit: 'f',
      colorScheme: 'auto',
      favorites: [],
      mounted: false
    }
  }

  let location = DEFAULT_LOCATION
  let favorites: Location[] = []

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
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to parse favorites:', error)
    }
  }

  return {
    location,
    tempUnit: (localStorage.getItem('tempUnit') as TempUnit) || 'f',
    colorScheme: (localStorage.getItem('colorScheme') as ColorScheme) || 'auto',
    favorites,
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
    },
    addToFavorites: (state, action: PayloadAction<Location>) => {
      const newFavorite = action.payload
      // Only add if not already in favorites
      if (!state.favorites.some((loc) => loc.id === newFavorite.id)) {
        state.favorites = [...state.favorites, newFavorite]
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(
        (loc) => loc.id !== action.payload
      )
    },
    clearFavorites: (state) => {
      state.favorites = []
    },
    setTempUnit: (state, action: PayloadAction<TempUnit>) => {
      state.tempUnit = action.payload
    },
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload
    },
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.mounted = action.payload
    }
  }
})

export const {
  setLocation,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setTempUnit,
  setColorScheme,
  setMounted
} = preferencesSlice.actions

export default preferencesSlice.reducer
