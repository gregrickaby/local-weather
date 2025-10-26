import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import Forecast from './Forecast'

describe('Forecast', () => {
  it('should not render forecast when not mounted', () => {
    render(<Forecast />, {
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

    // Component returns null, so section should not be present
    expect(screen.queryByText('The Next 4 Hours')).not.toBeInTheDocument()
  })

  it('should render section element', async () => {
    render(<Forecast />, {
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
      const section = document.querySelector('section')
      expect(section).toBeInTheDocument()
    })
  })

  it('should display "The Next 4 Hours" heading', async () => {
    render(<Forecast />, {
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
      expect(screen.getByText('The Next 4 Hours')).toBeInTheDocument()
    })
  })

  it('should display "Extended Forecast" heading', async () => {
    render(<Forecast />, {
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
      expect(screen.getByText('Extended Forecast')).toBeInTheDocument()
    })
  })

  it('should render hourly forecast cards', async () => {
    render(<Forecast />, {
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
          searchHistory: [],
          mounted: true
        }
      }
    })

    await waitFor(() => {
      // Should show "Today", "Tomorrow", or day names
      const section = document.querySelector('section')
      const text = section?.textContent || ''
      const hasDayLabel =
        text.includes('Today') ||
        text.includes('Tomorrow') ||
        /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/.test(text)
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
          searchHistory: [],
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
          searchHistory: [],
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
          searchHistory: [],
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
