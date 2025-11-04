import type {Location} from '@/lib/types'
import {act, renderHook, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useLocationSearch} from './useLocationSearch'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock Mantine hooks
vi.mock('@mantine/hooks', () => ({
  useDebouncedValue: (value: string) => [value, vi.fn()]
}))

// Mock Redux hooks and RTK Query
const mockDispatch = vi.fn()
const mockLocation: Location = {
  id: 4060791,
  name: 'Enterprise',
  latitude: 31.31517,
  longitude: -85.85522,
  admin1: 'Alabama',
  country: 'United States',
  display: 'Enterprise, Alabama, United States'
}

vi.mock('@/lib/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      preferences: {
        location: mockLocation,
        favorites: []
      }
    })
}))

vi.mock('@/lib/store/services/placesApi', () => ({
  useGetPlacesQuery: () => ({
    data: undefined,
    isLoading: false
  })
}))

describe('useLocationSearch', () => {
  it('should initialize with current location display', () => {
    const {result} = renderHook(() => useLocationSearch())
    expect(result.current.searchTerm).toBe('Enterprise, Alabama, United States')
  })

  it('should return default places in combobox data', () => {
    const {result} = renderHook(() => useLocationSearch())
    expect(result.current.comboboxData).toHaveLength(3)
    expect(result.current.comboboxData[0].label).toBe(
      'New York, New York, United States'
    )
  })

  it('should update search term on handleChange', () => {
    const {result} = renderHook(() => useLocationSearch())
    act(() => {
      result.current.handleChange('Chicago')
    })
    expect(result.current.searchTerm).toBe('Chicago')
  })

  it('should clear search term on handleClear', () => {
    const {result} = renderHook(() => useLocationSearch())
    act(() => {
      result.current.handleChange('Chicago')
    })
    act(() => {
      result.current.handleClear()
    })
    expect(result.current.searchTerm).toBe('')
    expect(result.current.dropdownOpened).toBe(false)
  })

  it('should close dropdown on handleDropdownClose', () => {
    const {result} = renderHook(() => useLocationSearch())
    act(() => {
      result.current.handleDropdownClose()
    })
    expect(result.current.dropdownOpened).toBe(false)
  })

  it('should dispatch setLocation and navigate on handleOptionSubmit', async () => {
    mockDispatch.mockClear()
    mockPush.mockClear()

    const {result} = renderHook(() => useLocationSearch())

    // Select New York (first default place)
    act(() => {
      result.current.handleOptionSubmit('5128581')
    })

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith(
        '/forecast/new-york/new-york/united-states/40.71/-74.01'
      )
    })
  })

  it('should return false for non-favorited location', () => {
    const {result} = renderHook(() => useLocationSearch())
    expect(result.current.isFavorited('5128581')).toBe(false)
  })

  it('should dispatch addToFavorites when toggling non-favorited location', () => {
    mockDispatch.mockClear()

    const {result} = renderHook(() => useLocationSearch())
    const location: Location = {
      id: 5128581,
      name: 'New York',
      latitude: 40.71427,
      longitude: -74.00597,
      admin1: 'New York',
      country: 'United States',
      display: 'New York, New York, United States'
    }

    act(() => {
      result.current.toggleFavorite(location)
    })

    expect(mockDispatch).toHaveBeenCalled()
  })
})
