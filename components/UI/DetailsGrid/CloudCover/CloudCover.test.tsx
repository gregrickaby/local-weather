import {mockLocation, render, screen, waitFor} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import CloudCover from './CloudCover'

describe('CloudCover', () => {
  it('should render cloud cover label', () => {
    render(<CloudCover />, {
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

    expect(screen.getByText('Cloud Cover')).toBeInTheDocument()
  })

  it('should display cloud cover percentage', async () => {
    render(<CloudCover />, {
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

    // 25% from mockWeatherResponse
    await waitFor(() => {
      expect(screen.getByText('25%')).toBeInTheDocument()
    })
  })

  it('should display cloud cover description', async () => {
    render(<CloudCover />, {
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
      // 25% = "Mostly clear"
      expect(screen.getByText('Mostly clear')).toBeInTheDocument()
    })
  })

  it('should skip query when not mounted', () => {
    render(<CloudCover />, {
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

    expect(screen.getByText('Cloud Cover')).toBeInTheDocument()
  })
})
