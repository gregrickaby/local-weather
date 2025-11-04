import {DEFAULT_LOCATION} from '@/lib/constants'
import type {Location} from '@/lib/types'
import {renderHook, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useCityPageLocation} from './useCityPageLocation'

// Mock Redux hooks
const mockDispatch = vi.fn()
const mockFavorites: Location[] = []
const mockPreferencesState = {
  location: DEFAULT_LOCATION,
  tempUnit: 'f' as const,
  colorScheme: 'auto' as const,
  favorites: mockFavorites,
  mounted: true
}

vi.mock('@/lib/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      preferences: mockPreferencesState
    })
}))

describe('useCityPageLocation', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockFavorites.length = 0 // Clear favorites
  })

  describe('Known Locations (Popular Cities)', () => {
    it('should resolve location from popular cities by coordinates', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'new-york/new-york/united-states/40.71/-74.01'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      // Hook should dispatch the full known location object, not the rounded coordinates from URL
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: expect.objectContaining({
            id: 5128581,
            name: 'New York',
            admin1: 'New York',
            country: 'United States',
            display: 'New York, New York, United States',
            latitude: 40.71427,
            longitude: -74.00597
          })
        })
      )
    })

    it('should resolve default location by coordinates', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'enterprise/alabama/united-states/31.32/-85.86'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      // Hook should dispatch the full known location object, not the rounded coordinates from URL
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: expect.objectContaining({
            id: 4060791,
            name: 'Enterprise',
            admin1: 'Alabama',
            country: 'United States',
            display: 'Enterprise, Alabama, United States',
            latitude: 31.31517,
            longitude: -85.85522
          })
        })
      )
    })

    it('should resolve Chicago by coordinates', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'chicago/illinois/united-states/41.88/-87.63'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latitude: 41.88,
            longitude: -87.63
          })
        })
      )
    })
  })

  describe('Favorites Locations', () => {
    it('should resolve location from favorites by coordinates', async () => {
      const testLocation: Location = {
        id: 999888,
        name: 'TestCity',
        latitude: 40,
        longitude: -80,
        admin1: 'TestState',
        country: 'TestCountry',
        display: 'TestCity, TestState, TestCountry'
      }

      mockFavorites.push(testLocation)

      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'testcity/teststate/testcountry/40.00/-80.00'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: testLocation
        })
      )
    })

    it('should match coordinates with tolerance', async () => {
      const testLocation: Location = {
        id: 123456,
        name: 'ToleranceTest',
        latitude: 45.123,
        longitude: -75.456,
        admin1: 'TestState',
        country: 'TestCountry',
        display: 'ToleranceTest, TestState, TestCountry'
      }

      mockFavorites.push(testLocation)

      // Slightly different coordinates (within 0.01 tolerance)
      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'tolerancetest/teststate/testcountry/45.13/-75.46'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: testLocation
        })
      )
    })
  })

  describe('Unknown Coordinates (Fallback)', () => {
    it('should create basic location for unknown coordinates', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'unknown-city/country/country/45.67/-89.12'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: expect.objectContaining({
            id: 0, // Fallback ID
            latitude: 45.67,
            longitude: -89.12,
            name: 'Unknown Location',
            country: 'Unknown',
            display: '45.67, -89.12'
          })
        })
      )
    })

    it('should handle negative coordinates correctly', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'south-pole/antarctica/antarctica/-89.99/0.00'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latitude: -89.99,
            longitude: 0
          })
        })
      )
    })
  })

  describe('Invalid Slugs', () => {
    it('should set error for slug without coordinates', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'new-york-new-york-united-states'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })

      expect(result.current.locationResolved).toBe(false)
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should set error for invalid coordinate format', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'city-name-abc-xyz'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })

      expect(result.current.locationResolved).toBe(false)
    })

    it('should set error for out-of-range latitude', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'invalid-location-100.00-50.00'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })

      expect(result.current.locationResolved).toBe(false)
    })

    it('should set error for out-of-range longitude', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'invalid-location-45.00-200.00'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })

      expect(result.current.locationResolved).toBe(false)
    })
  })

  describe('State Reset on Slug Change', () => {
    it('should reset states when slug changes', async () => {
      const {result, rerender} = renderHook(
        ({slug}) => useCityPageLocation({slug}),
        {
          initialProps: {slug: 'new-york/new-york/united-states/40.71/-74.01'}
        }
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      // Change slug to different location
      rerender({slug: 'chicago/illinois/united-states/41.88/-87.63'})

      // Wait for the new location to resolve
      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      // Verify we got a new resolution
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latitude: 41.88,
            longitude: -87.63
          })
        })
      )
    })
  })

  describe('Edge Cases', () => {
    it('should not dispatch multiple times for same location', async () => {
      mockDispatch.mockClear()

      const {result} = renderHook(() =>
        useCityPageLocation({
          slug: 'new-york/new-york/united-states/40.71/-74.01'
        })
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      // Dispatch should be called exactly once
      const dispatchCalls = mockDispatch.mock.calls.filter(
        (call) => call[0].type === 'preferences/setLocation'
      )
      expect(dispatchCalls).toHaveLength(1)
    })

    it('should handle equator crossing (lat=0)', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'equator/location/location/0.00/10.00'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latitude: 0,
            longitude: 10
          })
        })
      )
    })

    it('should handle prime meridian crossing (lon=0)', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'greenwich/uk/uk/51.48/0.00'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latitude: 51.48,
            longitude: 0
          })
        })
      )
    })
  })
})
