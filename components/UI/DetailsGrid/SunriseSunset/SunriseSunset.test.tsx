import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import SunriseSunset from './SunriseSunset'

describe('SunriseSunset', () => {
  it('should display "Sunrise / Sunset" label', async () => {
    render(<SunriseSunset />, {
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
      expect(screen.getByText('Sunrise / Sunset')).toBeInTheDocument()
    })
  })

  it('should display sunrise time', async () => {
    render(<SunriseSunset />, {
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
      expect(screen.getByText('Sunrise')).toBeInTheDocument()
      // Time will vary based on timezone, but should have a formatted time
      const timePattern = /\d{1,2}:\d{2}\s*(AM|PM)?/i
      const sunriseElement = screen.getByText('Sunrise').parentElement
      expect(sunriseElement?.textContent).toMatch(timePattern)
    })
  })

  it('should display sunset time', async () => {
    render(<SunriseSunset />, {
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
      expect(screen.getByText('Sunset')).toBeInTheDocument()
      // Time will vary based on timezone, but should have a formatted time
      const timePattern = /\d{1,2}:\d{2}\s*(AM|PM)?/i
      const sunsetElement = screen.getByText('Sunset').parentElement
      expect(sunsetElement?.textContent).toMatch(timePattern)
    })
  })

  it('should display sunrise and sunset labels', async () => {
    render(<SunriseSunset />, {
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
      // Both labels should be present
      expect(screen.getByText('Sunrise')).toBeInTheDocument()
      expect(screen.getByText('Sunset')).toBeInTheDocument()
    })
  })
})
