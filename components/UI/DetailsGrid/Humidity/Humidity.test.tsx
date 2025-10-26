import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import Humidity from './Humidity'

describe('Humidity', () => {
  it('should render humidity label', () => {
    render(<Humidity />, {
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

    expect(screen.getByText('Humidity')).toBeInTheDocument()
  })

  it('should display humidity percentage from weather data', async () => {
    render(<Humidity />, {
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

    // Wait for weather data to load (65% from mockWeatherResponse)
    await waitFor(() => {
      expect(screen.getByText('65%')).toBeInTheDocument()
    })
  })

  it('should display dew point', async () => {
    render(<Humidity />, {
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
      expect(screen.getByText(/Dew point: 60°/)).toBeInTheDocument()
    })
  })

  it('should display comfort description', async () => {
    render(<Humidity />, {
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
      // 65% humidity = "Slightly humid"
      expect(screen.getByText('Slightly humid')).toBeInTheDocument()
    })
  })

  it('should skip query when not mounted', () => {
    render(<Humidity />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [],
          mounted: false
        }
      }
    })

    // Should still render the component structure
    expect(screen.getByText('Humidity')).toBeInTheDocument()
  })
})
