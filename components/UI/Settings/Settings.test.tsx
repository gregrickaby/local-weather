import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Settings from './Settings'

describe('Settings', () => {
  it('should render settings button', () => {
    render(<Settings />)
    const button = screen.getByLabelText('open settings')
    expect(button).toBeInTheDocument()
  })

  it('should open modal when settings button is clicked', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  it('should display unit selector', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Select Units')).toBeInTheDocument()
    })
  })

  it('should display dark mode toggle', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(
        screen.getByLabelText('Toggle between light and theme.')
      ).toBeInTheDocument()
    })
  })

  it('should show clear history button when there is search history', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          searchHistory: [mockLocation],
          mounted: true
        }
      }
    })

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Search History (1)')).toBeInTheDocument()
      expect(screen.getByText('Clear History')).toBeInTheDocument()
    })
  })

  it('should NOT show clear history button when there is no search history', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.queryByText('Clear History')).not.toBeInTheDocument()
    })
  })

  it('should show imperial units by default', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Select Units')).toBeInTheDocument()
      // Verify imperial is displayed
      expect(
        screen.getByText(/Imperial \(°F, mph, inHg\)/i)
      ).toBeInTheDocument()
    })
  })

  it('should show metric units when tempUnit is celsius', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Select Units')).toBeInTheDocument()
      // Verify metric is displayed
      expect(screen.getByText(/Metric \(°C, km\/h, hPa\)/i)).toBeInTheDocument()
    })
  })
})
