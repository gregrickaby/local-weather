import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import UVIndex from './UVIndex'

describe('UVIndex', () => {
  it('should display "UV Index" label', async () => {
    render(<UVIndex />, {
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
      expect(screen.getByText('UV Index')).toBeInTheDocument()
    })
  })

  it('should display UV index value', async () => {
    render(<UVIndex />, {
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
      // Mock data has uv_index: 5
      expect(screen.getByText(/5/)).toBeInTheDocument()
    })
  })

  it('should display "Moderate" level for UV 3-5', async () => {
    render(<UVIndex />, {
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
      // Mock UV is 5, which is "Moderate"
      expect(screen.getByText('Moderate')).toBeInTheDocument()
    })
  })

  it('should display protection message', async () => {
    render(<UVIndex />, {
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
      expect(screen.getByText('Some protection required')).toBeInTheDocument()
    })
  })

  it('should display UV level and description', async () => {
    render(<UVIndex />, {
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
      // Both UV level and description should be present
      expect(screen.getByText('Moderate')).toBeInTheDocument()
      expect(screen.getByText('Some protection required')).toBeInTheDocument()
    })
  })
})
