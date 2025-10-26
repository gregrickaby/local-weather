import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import Visibility from './Visibility'

describe('Visibility', () => {
  it('should display "Visibility" label', async () => {
    render(<Visibility />, {
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
      expect(screen.getByText('Visibility')).toBeInTheDocument()
    })
  })

  it('should display visibility in miles for Fahrenheit users', async () => {
    render(<Visibility />, {
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
      // Mock data: visibility = 10000 meters = ~6 miles
      expect(screen.getByText(/6 mi/i)).toBeInTheDocument()
    })
  })

  it('should display visibility in kilometers for Celsius users', async () => {
    render(<Visibility />, {
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
      // Mock data: visibility = 10000 meters = 10 km
      expect(screen.getByText(/10 km/i)).toBeInTheDocument()
    })
  })

  it('should display visibility description', async () => {
    render(<Visibility />, {
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
      // 6 miles = "Good visibility"
      expect(screen.getByText('Good visibility')).toBeInTheDocument()
    })
  })
})
