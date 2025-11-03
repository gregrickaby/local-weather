import {DEFAULT_LOCATION} from '@/lib/constants'
import * as placesApi from '@/lib/store/services/placesApi'
import type {Location} from '@/lib/types'
import {renderHook, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useCityPageLocation} from './useCityPageLocation'

// Mock Next.js router
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace
  })
}))

// Mock Redux hooks
const mockDispatch = vi.fn()
const mockPreferencesState = {
  location: DEFAULT_LOCATION,
  tempUnit: 'f' as const,
  colorScheme: 'auto' as const,
  favorites: [] as Location[],
  mounted: true
}

vi.mock('@/lib/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      preferences: mockPreferencesState
    })
}))

// Mock RTK Query
let mockPlacesQueryResult = {
  data: undefined as Location[] | undefined,
  isLoading: false
}

vi.mock('@/lib/store/services/placesApi', () => ({
  useGetPlacesQuery: vi.fn(() => mockPlacesQueryResult)
}))

describe('useCityPageLocation', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockReplace.mockClear()
    mockPlacesQueryResult = {
      data: undefined,
      isLoading: false
    }
  })

  describe('Known Locations (Popular Cities)', () => {
    it('should resolve location from popular cities immediately', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'new-york-new-york-united-states'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(result.current.isSearching).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: expect.objectContaining({
            name: 'New York',
            admin1: 'New York',
            country: 'United States'
          })
        })
      )
    })

    it('should resolve default location', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'enterprise-alabama-united-states'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: expect.objectContaining({
            name: 'Enterprise',
            admin1: 'Alabama',
            country: 'United States'
          })
        })
      )
    })

    it('should not call geocoding API for known locations', () => {
      const mockedUseGetPlacesQuery = vi.spyOn(placesApi, 'useGetPlacesQuery')

      renderHook(() =>
        useCityPageLocation({slug: 'chicago-illinois-united-states'})
      )

      // Should be called with skip: true
      expect(mockedUseGetPlacesQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({skip: true})
      )
    })
  })

  describe('Unknown Locations (Geocoding)', () => {
    it('should search for location via geocoding API', async () => {
      const mockSearchResults: Location[] = [
        {
          id: 999,
          name: 'TestCity',
          latitude: 40,
          longitude: -80,
          admin1: 'TestState',
          country: 'TestCountry',
          display: 'TestCity, TestState, TestCountry'
        }
      ]

      mockPlacesQueryResult = {
        data: mockSearchResults,
        isLoading: false
      }

      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'testcity-teststate-testcountry'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(result.current.locationError).toBe(false)
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'preferences/setLocation',
          payload: mockSearchResults[0]
        })
      )
    })

    it('should show loading state while searching', () => {
      mockPlacesQueryResult = {
        data: undefined,
        isLoading: true
      }

      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'unknown-city-country'})
      )

      expect(result.current.isSearching).toBe(true)
      expect(result.current.locationResolved).toBe(false)
      expect(result.current.locationError).toBe(false)
    })

    it('should set error when location not found', async () => {
      mockPlacesQueryResult = {
        data: [],
        isLoading: false
      }

      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'nonexistent-location-nowhere'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })

      expect(result.current.locationResolved).toBe(false)
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should set error when geocoding returns undefined', async () => {
      mockPlacesQueryResult = {
        data: undefined,
        isLoading: false
      }

      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'invalid-slug-format'})
      )

      await waitFor(() => {
        expect(result.current.locationError).toBe(true)
      })
    })
  })

  describe('URL Correction', () => {
    it('should redirect to correct slug if different', async () => {
      const mockSearchResults: Location[] = [
        {
          id: 888,
          name: 'Correct Name',
          latitude: 40,
          longitude: -80,
          admin1: 'State',
          country: 'Country',
          display: 'Correct Name, State, Country'
        }
      ]

      mockPlacesQueryResult = {
        data: mockSearchResults,
        isLoading: false
      }

      renderHook(() => useCityPageLocation({slug: 'wrong-slug-name'}))

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/correct-name-state-country')
      })
    })

    it('should not redirect if slug matches location', async () => {
      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'new-york-new-york-united-states'})
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  describe('State Reset on Slug Change', () => {
    it('should reset states when slug changes', async () => {
      const {result, rerender} = renderHook(
        ({slug}) => useCityPageLocation({slug}),
        {
          initialProps: {slug: 'new-york-new-york-united-states'}
        }
      )

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      // Change slug
      rerender({slug: 'chicago-illinois-united-states'})

      // Wait for the new location to resolve
      await waitFor(() => {
        // The hook should have been called with the new slug and resolved
        expect(result.current.locationResolved).toBe(true)
      })

      // Verify we got a new resolution (dispatch was called)
      expect(mockDispatch).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple results from geocoding (uses first)', async () => {
      const mockSearchResults: Location[] = [
        {
          id: 1,
          name: 'City1',
          latitude: 40,
          longitude: -80,
          admin1: 'State1',
          country: 'Country1',
          display: 'City1, State1, Country1'
        },
        {
          id: 2,
          name: 'City2',
          latitude: 41,
          longitude: -81,
          admin1: 'State2',
          country: 'Country2',
          display: 'City2, State2, Country2'
        }
      ]

      mockPlacesQueryResult = {
        data: mockSearchResults,
        isLoading: false
      }

      const {result} = renderHook(() => useCityPageLocation({slug: 'city'}))

      await waitFor(() => {
        expect(result.current.locationResolved).toBe(true)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: mockSearchResults[0] // First result
        })
      )
    })

    it('should not dispatch multiple times for same location', async () => {
      mockDispatch.mockClear()

      const {result} = renderHook(() =>
        useCityPageLocation({slug: 'new-york-new-york-united-states'})
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
  })
})
