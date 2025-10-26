import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
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

    expect(screen.getByText('Wind')).toBeInTheDocument()
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

    // Wind speed from mock data is 8 mph
    await waitFor(() => {
      expect(screen.getByText(/8 mph/)).toBeInTheDocument()
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
      expect(screen.getByText(/Gusts 12 mph/)).toBeInTheDocument()
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
      expect(screen.getByText('S')).toBeInTheDocument()
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

    const svg = document.querySelector('svg')
    expect(svg?.textContent).toContain('N')
    expect(svg?.textContent).toContain('E')
    expect(svg?.textContent).toContain('S')
    expect(svg?.textContent).toContain('W')
  })
})
