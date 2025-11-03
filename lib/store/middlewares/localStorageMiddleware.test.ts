import {mockLocation} from '@/test-utils'
import {configureStore} from '@reduxjs/toolkit'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import preferencesReducer, {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation,
  setTempUnit
} from '../slices/preferencesSlice'
import {localStorageMiddleware} from './localStorageMiddleware'

describe('localStorageMiddleware', () => {
  let store: ReturnType<typeof configureStore>
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {}
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      }),
      key: vi.fn(),
      length: 0
    } as Storage

    // Create store with middleware
    store = configureStore({
      reducer: {
        preferences: preferencesReducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware)
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should save location to localStorage', async () => {
    store.dispatch(setLocation(mockLocation))

    // Fast-forward past debounce
    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'location',
      JSON.stringify(mockLocation)
    )
  })

  it('should save temperature unit to localStorage', async () => {
    store.dispatch(setTempUnit('c'))

    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith('tempUnit', 'c')
  })

  it('should save color scheme to localStorage', async () => {
    store.dispatch(setColorScheme('dark'))

    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith('colorScheme', 'dark')
  })

  it('should save favorites when adding a favorite', async () => {
    store.dispatch(addToFavorites(mockLocation))

    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify([mockLocation])
    )
  })

  it('should save favorites when removing a favorite', async () => {
    store.dispatch(addToFavorites(mockLocation))
    vi.advanceTimersByTime(150)

    store.dispatch(removeFromFavorites(mockLocation.id))
    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith('favorites', '[]')
  })

  it('should save favorites when clearing favorites', async () => {
    store.dispatch(addToFavorites(mockLocation))
    vi.advanceTimersByTime(150)

    store.dispatch(clearFavorites())
    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledWith('favorites', '[]')
  })

  it('should debounce multiple rapid updates', async () => {
    store.dispatch(setTempUnit('c'))
    store.dispatch(setTempUnit('f'))
    store.dispatch(setTempUnit('c'))

    // Only advance part way
    vi.advanceTimersByTime(50)

    // Should not have written yet
    expect(localStorage.setItem).not.toHaveBeenCalled()

    // Advance past debounce
    vi.advanceTimersByTime(100)

    // Should only write once with final value
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith('tempUnit', 'c')
  })

  it('should batch multiple different updates together', async () => {
    store.dispatch(setTempUnit('f'))
    store.dispatch(setColorScheme('dark'))
    store.dispatch(setLocation(mockLocation))

    vi.advanceTimersByTime(150)

    expect(localStorage.setItem).toHaveBeenCalledTimes(3)
    expect(localStorage.setItem).toHaveBeenCalledWith('tempUnit', 'f')
    expect(localStorage.setItem).toHaveBeenCalledWith('colorScheme', 'dark')
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'location',
      JSON.stringify(mockLocation)
    )
  })
})
