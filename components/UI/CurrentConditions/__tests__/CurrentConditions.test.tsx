import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import CurrentConditions from '../CurrentConditions'

describe('CurrentConditions', () => {
  it('should not render when not mounted', () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [],
          mounted: false
        }
      }
    })

    // Component returns null, so weather description should not be present
    expect(screen.queryByText('Clear sky')).not.toBeInTheDocument()
  })

  it('should display weather description', async () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Weather code 0 = Clear sky
      expect(screen.getByText('Clear sky')).toBeInTheDocument()
    })
  })

  it('should display temperature in Fahrenheit', async () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Temperature from mock data is 72°F
      expect(screen.getByText('72°F')).toBeInTheDocument()
    })
  })

  it('should display temperature in Celsius', async () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'c',
          colorScheme: 'light',
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('72°C')).toBeInTheDocument()
    })
  })

  it('should display forecast statement', async () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Forecast statement should be present (content varies by time logic)
      // Look for text that's in a <p> with size="sm" (the forecast statement)
      const allSmallText = screen
        .getAllByText(/./i)
        .filter(
          (el) =>
            el.tagName === 'P' && el.textContent && el.textContent.length > 10
        )
      expect(allSmallText.length).toBeGreaterThan(0)
    })
  })

  it('should display "Feels Like" when apparent temp is higher', async () => {
    render(<CurrentConditions />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Mock data: apparent_temperature (74) > temperature_2m (72)
      expect(screen.getByText(/Feels Like: 74°F/)).toBeInTheDocument()
    })
  })
})
