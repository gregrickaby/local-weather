import {mockLocation, render, screen, waitFor} from '@/test-utils'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
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

  it('should show clear favorites button when there is favorites', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [mockLocation],
          mounted: true
        }
      }
    })

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('Favorites (1)')).toBeInTheDocument()
      expect(screen.getByText('Clear All Favorites')).toBeInTheDocument()
    })
  })

  it('should NOT show clear favorites button when there is no favorites', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    await waitFor(() => {
      expect(screen.queryByText('Clear All Favorites')).not.toBeInTheDocument()
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
          favorites: [],
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
          favorites: [],
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

  it('should toggle color scheme when switch is clicked', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const button = screen.getByLabelText('open settings')
    await user.click(button)

    const themeToggle = await screen.findByLabelText(
      'Toggle between light and theme.'
    )
    await user.click(themeToggle)

    // The switch should now be checked (dark mode)
    expect(themeToggle).toBeChecked()
  })

  it('should display unit selector with current selection', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
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

    const settingsButton = screen.getByLabelText('open settings')
    await user.click(settingsButton)

    await waitFor(() => {
      expect(screen.getByText('Select Units')).toBeInTheDocument()
      // Imperial should be shown (tempUnit is 'f')
      expect(
        screen.getByText(/Imperial \(°F, mph, inHg\)/i)
      ).toBeInTheDocument()
    })
  })

  it('should clear favorites when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<Settings />, {
      preloadedState: {
        preferences: {
          location: mockLocation,
          tempUnit: 'f',
          colorScheme: 'light',
          favorites: [mockLocation, {...mockLocation, name: 'Test City'}],
          mounted: true
        }
      }
    })

    const settingsButton = screen.getByLabelText('open settings')
    await user.click(settingsButton)

    // Should show 2 items in history
    await waitFor(() => {
      expect(screen.getByText('Favorites (2)')).toBeInTheDocument()
    })

    const clearButton = screen.getByText('Clear All Favorites')
    await user.click(clearButton)

    // History should be cleared, button should disappear
    await waitFor(() => {
      expect(screen.queryByText('Clear All Favorites')).not.toBeInTheDocument()
    })
  })

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const settingsButton = screen.getByLabelText('open settings')
    await user.click(settingsButton)

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    const closeButton = screen.getByLabelText('close settings')
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })
  })
})
