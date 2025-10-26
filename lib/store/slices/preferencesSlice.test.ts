import {DEFAULT_LOCATION} from '@/lib/constants'
import type {Location} from '@/lib/types'
import {mockLocation} from '@/test-utils'
import {beforeEach, describe, expect, it} from 'vitest'
import preferencesReducer, {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation,
  setMounted,
  setTempUnit
} from './preferencesSlice'

describe('preferencesSlice', () => {
  const initialState = {
    location: DEFAULT_LOCATION,
    tempUnit: 'f' as 'c' | 'f',
    colorScheme: 'auto' as 'light' | 'dark' | 'auto',
    favorites: [] as Location[],
    mounted: false
  }

  beforeEach(() => {
    // Clear any localStorage before each test
    if (globalThis.window) {
      localStorage.clear()
    }
  })

  describe('setLocation', () => {
    it('should set location', () => {
      const state = preferencesReducer(initialState, setLocation(mockLocation))
      expect(state.location).toEqual(mockLocation)
    })

    it('should not automatically add location to favorites', () => {
      const state = preferencesReducer(initialState, setLocation(mockLocation))
      expect(state.favorites).toHaveLength(0)
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

  describe('addToFavorites', () => {
    it('should add location to favorites', () => {
      const state = preferencesReducer(
        initialState,
        addToFavorites(mockLocation)
      )
      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0]).toEqual(mockLocation)
    })

    it('should not add duplicate locations to favorites', () => {
      let state = preferencesReducer(initialState, addToFavorites(mockLocation))
      state = preferencesReducer(state, addToFavorites(mockLocation))

      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0]).toEqual(mockLocation)
    })

    it('should add multiple different locations to favorites', () => {
      const location2: Location = {
        ...mockLocation,
        id: 2,
        name: 'New York',
        display: 'New York, New York, United States'
      }

      let state = preferencesReducer(initialState, addToFavorites(mockLocation))
      state = preferencesReducer(state, addToFavorites(location2))

      expect(state.favorites).toHaveLength(2)
      expect(state.favorites[0]).toEqual(mockLocation)
      expect(state.favorites[1]).toEqual(location2)
    })
  })

  describe('removeFromFavorites', () => {
    it('should remove location from favorites by ID', () => {
      const location2: Location = {
        ...mockLocation,
        id: 2,
        name: 'New York',
        display: 'New York, New York, United States'
      }

      let state = preferencesReducer(initialState, addToFavorites(mockLocation))
      state = preferencesReducer(state, addToFavorites(location2))

      expect(state.favorites).toHaveLength(2)

      state = preferencesReducer(state, removeFromFavorites(mockLocation.id))

      expect(state.favorites).toHaveLength(1)
      expect(state.favorites[0]).toEqual(location2)
    })

    it('should not error when removing non-existent ID', () => {
      const state = preferencesReducer(initialState, removeFromFavorites(999))
      expect(state.favorites).toHaveLength(0)
    })
  })

  describe('clearFavorites', () => {
    it('should clear all favorites', () => {
      let state = preferencesReducer(initialState, addToFavorites(mockLocation))
      expect(state.favorites).toHaveLength(1)

      state = preferencesReducer(state, clearFavorites())
      expect(state.favorites).toHaveLength(0)
    })

    it('should clear multiple favorites', () => {
      const location2: Location = {
        ...mockLocation,
        id: 2,
        name: 'New York',
        display: 'New York, New York, United States'
      }

      let state = preferencesReducer(initialState, addToFavorites(mockLocation))
      state = preferencesReducer(state, addToFavorites(location2))
      expect(state.favorites).toHaveLength(2)

      state = preferencesReducer(state, clearFavorites())
      expect(state.favorites).toHaveLength(0)
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
