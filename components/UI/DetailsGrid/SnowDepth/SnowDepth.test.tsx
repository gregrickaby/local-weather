import {mockLocation, render, screen} from '@/test-utils'
import {describe, expect, it} from 'vitest'
import SnowDepth from './SnowDepth'

describe('SnowDepth', () => {
  it('should not render when no snow present', () => {
    render(<SnowDepth />, {
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

    // Component should return null when no snow (0 from mockWeatherResponse)
    expect(screen.queryByText('Snow Depth')).not.toBeInTheDocument()
  })

  it('should skip query when not mounted', () => {
    render(<SnowDepth />, {
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

    expect(screen.queryByText('Snow Depth')).not.toBeInTheDocument()
  })
})
