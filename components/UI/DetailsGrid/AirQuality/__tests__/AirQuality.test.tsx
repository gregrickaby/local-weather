import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import AirQuality from '../AirQuality'

describe('AirQuality', () => {
  it('should display "Air Quality" label', async () => {
    render(<AirQuality />, {
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
      expect(screen.getByText('Air Quality')).toBeInTheDocument()
    })
  })

  it('should display AQI label', async () => {
    render(<AirQuality />, {
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
      // Check for AQI label
      expect(screen.getByText('AQI')).toBeInTheDocument()
    })
  })

  it('should display "Good" level for AQI <= 50', async () => {
    render(<AirQuality />, {
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
      // Mock AQI is 42, which is "Good"
      expect(screen.getByText('Good')).toBeInTheDocument()
    })
  })

  it('should display correct description for good air quality', async () => {
    render(<AirQuality />, {
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
      expect(
        screen.getByText('Air quality is satisfactory')
      ).toBeInTheDocument()
    })
  })

  it('should render badge with air quality level', async () => {
    render(<AirQuality />, {
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
      // Badge with quality level should be present
      expect(screen.getByText('Good')).toBeInTheDocument()
    })
  })
})
