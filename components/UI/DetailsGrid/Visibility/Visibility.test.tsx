import {mockLocation, render, screen, waitFor} from '@/test-utils'
import {describe, expect, it} from 'vitest'
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
      expect(screen.getByText('6')).toBeInTheDocument()
      expect(screen.getByText('mi')).toBeInTheDocument()
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
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('km')).toBeInTheDocument()
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
      // 6 miles = "Very good visibility"
      expect(screen.getByText('Very good visibility')).toBeInTheDocument()
    })
  })
})
