import {act, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {useSatellite} from './useSatellite'

// Mock the Redux hooks
vi.mock('@/lib/store/hooks', () => ({
  useAppSelector: vi.fn()
}))

import {useAppSelector} from '@/lib/store/hooks'

describe('useSatellite', () => {
  const mockLocation = {
    id: 1,
    name: 'Enterprise, Alabama, United States',
    latitude: 31.32,
    longitude: -85.86,
    elevation: 121,
    country: 'United States',
    admin1: 'Alabama',
    countryCode: 'US',
    timezone: 'America/Chicago'
  }

  beforeEach(() => {
    vi.useFakeTimers()
    ;(useAppSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockLocation
    )
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should generate satellite info based on location', () => {
    const {result} = renderHook(() => useSatellite())

    expect(result.current.satelliteType).toBe('GOES-East')
    expect(result.current.satelliteName).toBe('Southeast')
    expect(result.current.imageUrl).toMatch(/GOES16/)
  })

  it('should update when location changes', () => {
    const {result, rerender} = renderHook(() => useSatellite())

    expect(result.current.satelliteType).toBe('GOES-East')

    // Change to Los Angeles (GOES-West)
    ;(useAppSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockLocation,
      latitude: 34.05,
      longitude: -118.24
    })

    rerender()

    expect(result.current.satelliteType).toBe('GOES-West')
    expect(result.current.satelliteName).toBe('Pacific Southwest')
  })

  it('should handle image load success', () => {
    const {result} = renderHook(() => useSatellite())

    act(() => {
      result.current.handleImageLoad()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle image load error', () => {
    const {result} = renderHook(() => useSatellite())

    act(() => {
      result.current.handleImageError()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Failed to load satellite imagery')
  })

  it('should refresh image on manual refresh', () => {
    const {result} = renderHook(() => useSatellite())

    const initialUrl = result.current.imageUrl
    const initialUpdate = result.current.lastUpdate

    act(() => {
      vi.advanceTimersByTime(1000)
      result.current.refreshImage()
    })

    expect(result.current.imageUrl).not.toBe(initialUrl)
    expect(result.current.lastUpdate).not.toBe(initialUpdate)
  })

  it('should clear error on successful refresh', () => {
    const {result} = renderHook(() => useSatellite())

    act(() => {
      result.current.handleImageError()
    })

    expect(result.current.error).toBe('Failed to load satellite imagery')

    act(() => {
      result.current.refreshImage()
    })

    expect(result.current.error).toBeNull()
  })
})
