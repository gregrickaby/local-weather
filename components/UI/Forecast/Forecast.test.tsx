import {mockLocation, render, screen, waitFor} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import Forecast from './Forecast'

describe('Forecast', () => {
  it('should not render forecast when not mounted', () => {
    render(<Forecast />, {
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

    // Component returns null, so section should not be present
    expect(screen.queryByText('Hourly Forecast')).not.toBeInTheDocument()
  })

  it('should render section element', async () => {
    render(<Forecast />, {
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
      const section = document.querySelector('section')
      expect(section).toBeInTheDocument()
    })
  })

  it('should display "Hourly Forecast" heading', async () => {
    render(<Forecast />, {
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
      expect(screen.getByText('Hourly Forecast')).toBeInTheDocument()
    })
  })

  it('should display "10-Day Forecast" heading', async () => {
    render(<Forecast />, {
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
      expect(screen.getByText('10-Day Forecast')).toBeInTheDocument()
    })
  })

  it('should render hourly forecast cards', async () => {
    render(<Forecast />, {
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
      // Should have hourly forecast times displayed
      const section = document.querySelector('section')
      expect(section).toBeInTheDocument()
      // Mock data has 24 hours, so next 4 hours should be available
      expect(section?.textContent).toContain('Clear sky')
    })
  })

  it('should render daily forecast items', async () => {
    render(<Forecast />, {
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
      // Should show "Tod", "Tom", or 3-character day names
      const section = document.querySelector('section')
      const text = section?.textContent || ''
      const hasDayLabel =
        text.includes('Tod') ||
        text.includes('Tom') ||
        /Mon|Tue|Wed|Thu|Fri|Sat|Sun/.test(text)
      expect(hasDayLabel).toBe(true)
    })
  })

  it('should display temperatures in Fahrenheit', async () => {
    render(<Forecast />, {
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
      // Should contain °F in the document
      const section = document.querySelector('section')
      expect(section?.textContent).toMatch(/°F/)
    })
  })

  it('should display temperatures in Celsius', async () => {
    render(<Forecast />, {
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
      // Should contain °C in the document
      const section = document.querySelector('section')
      expect(section?.textContent).toMatch(/°C/)
    })
  })

  it('should render weather icons', async () => {
    render(<Forecast />, {
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
      // Should have weather icon images
      const images = document.querySelectorAll('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })
})
