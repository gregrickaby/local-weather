import type {Location} from '@/lib/types'
import {mockWeatherResponse, render, screen} from '@/test-utils'
import {describe, expect, it, vi} from 'vitest'
import CityPage from './CityPage'

// Mock the custom hook
const mockUseCityPageLocation = vi.fn()
vi.mock('@/lib/hooks/useCityPageLocation', () => ({
  useCityPageLocation: (params: any) => mockUseCityPageLocation(params)
}))

// Mock useWeatherData
const mockUseWeatherData = vi.fn()
vi.mock('@/lib/hooks/useWeatherData', () => ({
  useWeatherData: () => mockUseWeatherData()
}))

// Mock Radar component to avoid radarApi middleware issues
vi.mock('@/components/UI/Radar/Radar', () => ({
  default: () => <div data-testid="radar-component">Radar</div>
}))

const mockLocation: Location = {
  id: 1,
  name: 'Enterprise',
  latitude: 31.3115,
  longitude: -85.855,
  admin1: 'Alabama',
  country: 'United States',
  display: 'Enterprise, Alabama, United States'
}

describe('CityPage', () => {
  it('should show loading skeleton when location is resolving', () => {
    mockUseCityPageLocation.mockReturnValue({
      locationResolved: false,
      locationError: false,
      isSearching: true
    })

    mockUseWeatherData.mockReturnValue({
      data: undefined,
      isLoading: true
    })

    render(<CityPage slug="enterprise-alabama-united-states" />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'auto',
          favorites: [],
          mounted: true
        }
      }
    })

    // Should show Mantine Skeleton components
    const skeletons = document.querySelectorAll('.mantine-Skeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show error message when location cannot be resolved', () => {
    mockUseCityPageLocation.mockReturnValue({
      locationResolved: false,
      locationError: true,
      isSearching: false
    })

    mockUseWeatherData.mockReturnValue({
      data: undefined,
      isLoading: false
    })

    render(<CityPage slug="nonexistent-location-nowhere" />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'auto',
          favorites: [],
          mounted: true
        }
      }
    })

    expect(screen.getByText('Location Not Found')).toBeInTheDocument()
  })

  it('should pass correct slug to useCityPageLocation hook', () => {
    mockUseCityPageLocation.mockReturnValue({
      locationResolved: false,
      locationError: false,
      isSearching: true
    })

    mockUseWeatherData.mockReturnValue({
      data: undefined,
      isLoading: true
    })

    const testSlug = 'new-york-new-york-united-states'

    render(<CityPage slug={testSlug} />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'auto',
          favorites: [],
          mounted: true
        }
      }
    })

    expect(mockUseCityPageLocation).toHaveBeenCalledWith({slug: testSlug})
  })

  it('should use useCityPageLocation hook for location resolution logic', () => {
    mockUseCityPageLocation.mockReturnValue({
      locationResolved: true,
      locationError: false,
      isSearching: false
    })

    mockUseWeatherData.mockReturnValue({
      data: mockWeatherResponse,
      isLoading: false
    })

    render(<CityPage slug="enterprise-alabama-united-states" />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'auto',
          favorites: [],
          mounted: true
        }
      }
    })

    // Verify the hook was called (business logic is delegated to the hook)
    expect(mockUseCityPageLocation).toHaveBeenCalled()
  })
})
