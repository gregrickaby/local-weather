import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import FeelsLike from './FeelsLike'

describe('FeelsLike', () => {
  it('should display "Feels Like" label', async () => {
    render(<FeelsLike />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('Feels Like')).toBeInTheDocument()
    })
  })

  it('should display feels like temperature in Fahrenheit', async () => {
    render(<FeelsLike />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Mock data: apparent_temperature = 74
      expect(screen.getByText('74°F')).toBeInTheDocument()
    })
  })

  it('should display feels like temperature in Celsius', async () => {
    render(<FeelsLike />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'c',
          colorScheme: 'light',
          favorites: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Mock data returns 74°C when unit is C
      expect(screen.getByText('74°C')).toBeInTheDocument()
    })
  })

  it('should display warmer description when feels like > actual', async () => {
    render(<FeelsLike />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Mock: apparent_temperature (74) > temperature_2m (72) = 2° warmer
      expect(screen.getByText('Feels 2° warmer')).toBeInTheDocument()
    })
  })
})
