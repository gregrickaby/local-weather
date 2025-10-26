import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import Pressure from '../Pressure'

describe('Pressure', () => {
  it('should render pressure label', () => {
    render(<Pressure />, {
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

    expect(screen.getByText('Pressure')).toBeInTheDocument()
  })

  it('should display pressure in inHg for Fahrenheit users', async () => {
    render(<Pressure />, {
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
      expect(screen.getByText('inHg')).toBeInTheDocument()
      // 1013.25 hPa = 29.92 inHg
      expect(screen.getByText('29.92')).toBeInTheDocument()
    })
  })

  it('should display pressure in hPa for Celsius users', async () => {
    render(<Pressure />, {
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
      expect(screen.getByText('hPa')).toBeInTheDocument()
      expect(screen.getByText('1013')).toBeInTheDocument()
    })
  })

  it('should display pressure description', async () => {
    render(<Pressure />, {
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
      // 1013.25 hPa = Normal pressure
      expect(screen.getByText('Normal pressure')).toBeInTheDocument()
    })
  })

  it('should render Low/High labels', () => {
    render(<Pressure />, {
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

    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })
})
