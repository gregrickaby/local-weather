import {mockLocation, render, screen, waitFor} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import Precipitation from './Precipitation'

describe('Precipitation', () => {
  it('should render precipitation label', () => {
    render(<Precipitation />, {
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

    expect(screen.getByText('Precipitation')).toBeInTheDocument()
  })

  it('should display "None" when no precipitation', async () => {
    render(<Precipitation />, {
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
      expect(screen.getByText('None')).toBeInTheDocument()
      expect(screen.getByText('No precipitation')).toBeInTheDocument()
    })
  })

  it('should skip query when not mounted', () => {
    render(<Precipitation />, {
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

    expect(screen.getByText('Precipitation')).toBeInTheDocument()
  })
})
