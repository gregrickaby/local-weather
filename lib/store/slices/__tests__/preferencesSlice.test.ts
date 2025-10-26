import {describe, it, expect, beforeEach} from 'vitest'
import preferencesReducer, {
  setLocation,
  setTempUnit,
  setColorScheme,
  clearSearchHistory,
  removeFromSearchHistory,
  setMounted
} from '../preferencesSlice'
import {mockLocation} from '@/test-utils'
import {DEFAULT_LOCATION} from '@/lib/constants'
import type {Location} from '@/lib/types'

describe('preferencesSlice', () => {
  const initialState = {
    location: DEFAULT_LOCATION,
    tempUnit: 'f' as 'c' | 'f',
    colorScheme: 'auto' as 'light' | 'dark' | 'auto',
    searchHistory: [] as Location[],
    mounted: false
  }

  beforeEach(() => {
    // Clear any localStorage before each test
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('setLocation', () => {
    it('should set location', () => {
      const state = preferencesReducer(initialState, setLocation(mockLocation))
      expect(state.location).toEqual(mockLocation)
    })

    it('should add location to search history', () => {
      const state = preferencesReducer(initialState, setLocation(mockLocation))
      expect(state.searchHistory).toHaveLength(1)
      expect(state.searchHistory[0]).toEqual(mockLocation)
    })

    it('should move existing location to front of history', () => {
      const location2: Location = {
        ...mockLocation,
        id: 2,
        name: 'New York'
      }

      let state = preferencesReducer(initialState, setLocation(mockLocation))
      state = preferencesReducer(state, setLocation(location2))
      state = preferencesReducer(state, setLocation(mockLocation))

      expect(state.searchHistory).toHaveLength(2)
      expect(state.searchHistory[0]).toEqual(mockLocation)
      expect(state.searchHistory[1]).toEqual(location2)
    })

    it('should limit search history to 10 items', () => {
      let state = initialState

      // Add 15 locations
      for (let i = 1; i <= 15; i++) {
        const location: Location = {
          ...mockLocation,
          id: i,
          name: `City ${i}`
        }
        state = preferencesReducer(state, setLocation(location))
      }

      expect(state.searchHistory).toHaveLength(10)
      expect(state.searchHistory[0].name).toBe('City 15')
      expect(state.searchHistory[9].name).toBe('City 6')
    })
  })

  describe('setTempUnit', () => {
    it('should set temperature unit to Celsius', () => {
      const state = preferencesReducer(initialState, setTempUnit('c'))
      expect(state.tempUnit).toBe('c')
    })

    it('should set temperature unit to Fahrenheit', () => {
      const state = preferencesReducer(initialState, setTempUnit('f'))
      expect(state.tempUnit).toBe('f')
    })
  })

  describe('setColorScheme', () => {
    it('should set color scheme to light', () => {
      const state = preferencesReducer(initialState, setColorScheme('light'))
      expect(state.colorScheme).toBe('light')
    })

    it('should set color scheme to dark', () => {
      const state = preferencesReducer(initialState, setColorScheme('dark'))
      expect(state.colorScheme).toBe('dark')
    })

    it('should set color scheme to auto', () => {
      const state = preferencesReducer(initialState, setColorScheme('auto'))
      expect(state.colorScheme).toBe('auto')
    })
  })

  describe('clearSearchHistory', () => {
    it('should clear all search history', () => {
      let state = preferencesReducer(initialState, setLocation(mockLocation))
      expect(state.searchHistory).toHaveLength(1)

      state = preferencesReducer(state, clearSearchHistory())
      expect(state.searchHistory).toHaveLength(0)
    })
  })

  describe('removeFromSearchHistory', () => {
    it('should remove location from search history by ID', () => {
      const location2: Location = {
        ...mockLocation,
        id: 2,
        name: 'New York'
      }

      let state = preferencesReducer(initialState, setLocation(mockLocation))
      state = preferencesReducer(state, setLocation(location2))

      expect(state.searchHistory).toHaveLength(2)

      state = preferencesReducer(
        state,
        removeFromSearchHistory(mockLocation.id)
      )

      expect(state.searchHistory).toHaveLength(1)
      expect(state.searchHistory[0]).toEqual(location2)
    })

    it('should not error when removing non-existent ID', () => {
      const state = preferencesReducer(
        initialState,
        removeFromSearchHistory(999)
      )
      expect(state.searchHistory).toHaveLength(0)
    })
  })

  describe('setMounted', () => {
    it('should set mounted to true', () => {
      const state = preferencesReducer(initialState, setMounted(true))
      expect(state.mounted).toBe(true)
    })

    it('should set mounted to false', () => {
      const state = preferencesReducer(
        {...initialState, mounted: true},
        setMounted(false)
      )
      expect(state.mounted).toBe(false)
    })
  })
})
