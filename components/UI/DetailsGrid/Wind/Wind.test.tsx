import {mockLocation, render, screen, waitFor} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import Wind from './Wind'

describe('Wind', () => {
  it('should render wind label', () => {
    render(<Wind />, {
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

    // Check for uppercase "WIND" label
    expect(screen.getByText(/WIND/i)).toBeInTheDocument()
  })

  it('should display wind speed with mph for Fahrenheit', async () => {
    render(<Wind />, {
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

    // Wind speed from mock data is 8 mph - check for separate elements
    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('mph')).toBeInTheDocument()
    })
  })

  it('should display wind gusts', async () => {
    render(<Wind />, {
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

    // Wind gusts from mock data is 12 mph
    await waitFor(() => {
      expect(screen.getByText('Gusts')).toBeInTheDocument()
      expect(screen.getByText('12 mph')).toBeInTheDocument()
    })
  })

  it('should display wind direction', async () => {
    render(<Wind />, {
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

    // Wind direction from mock data is 180° = South
    await waitFor(() => {
      expect(screen.getByText('Direction')).toBeInTheDocument()
    })
  })

  it('should render compass SVG', () => {
    render(<Wind />, {
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

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should show cardinal directions on compass', () => {
    render(<Wind />, {
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

    // Cardinal directions are now outside the SVG
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('W')).toBeInTheDocument()
  })
})
