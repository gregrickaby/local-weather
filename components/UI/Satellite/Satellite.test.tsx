import {render, screen, waitFor} from '@/test-utils'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import Satellite from './Satellite'

// Mock the useSatellite hook
vi.mock('@/lib/hooks/useSatellite', () => ({
  useSatellite: vi.fn()
}))

import {useSatellite} from '@/lib/hooks/useSatellite'

describe('Satellite', () => {
  const mockSatelliteData = {
    imageUrl:
      'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/se/GEOCOLOR/latest.jpg?t=1234567890',
    satelliteName: 'Southeast',
    satelliteType: 'GOES-East',
    lastUpdate: new Date('2025-01-15T12:00:00.000Z'),
    isLoading: false,
    error: null,
    refreshImage: vi.fn(),
    handleImageError: vi.fn(),
    handleImageLoad: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSatellite as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSatelliteData
    )
  })

  it('should render satellite component with title', () => {
    render(<Satellite />)

    expect(screen.getByText('Satellite')).toBeInTheDocument()
  })

  it('should display status message with satellite info when loaded', () => {
    render(<Satellite />)

    // Status should show satellite type and name
    expect(screen.getByText(/GOES-East/)).toBeInTheDocument()
    expect(screen.getByText(/Southeast/)).toBeInTheDocument()
  })

  it('should display loading state', () => {
    ;(useSatellite as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockSatelliteData,
      isLoading: true,
      imageUrl: ''
    })

    render(<Satellite />)

    expect(screen.getByText('Loading satellite data...')).toBeInTheDocument()
  })

  it('should display error state', () => {
    ;(useSatellite as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockSatelliteData,
      error: 'Failed to load satellite imagery',
      isLoading: false
    })

    render(<Satellite />)

    // Check for error in the imageContainer (red text)
    const errorElements = screen.getAllByText(
      'Failed to load satellite imagery'
    )
    expect(errorElements.length).toBeGreaterThan(0)
  })

  it('should render satellite image with correct alt text', () => {
    render(<Satellite />)

    const image = screen.getByAltText('GOES-East Southeast satellite imagery')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('GEOCOLOR'))
  })

  it('should call refreshImage when refresh button clicked', async () => {
    const user = userEvent.setup()
    render(<Satellite />)

    const refreshButton = screen.getByLabelText('refresh satellite imagery')
    await user.click(refreshButton)

    expect(mockSatelliteData.refreshImage).toHaveBeenCalledTimes(1)
  })

  it('should toggle expanded state when maximize/minimize clicked', async () => {
    const user = userEvent.setup()
    render(<Satellite />)

    const expandButton = screen.getByLabelText('maximize satellite')
    await user.click(expandButton)

    await waitFor(() => {
      expect(screen.getByLabelText('minimize satellite')).toBeInTheDocument()
    })

    const minimizeButton = screen.getByLabelText('minimize satellite')
    await user.click(minimizeButton)

    await waitFor(() => {
      expect(screen.getByLabelText('maximize satellite')).toBeInTheDocument()
    })
  })

  it('should show overlay when expanded', async () => {
    const user = userEvent.setup()
    render(<Satellite />)

    const expandButton = screen.getByLabelText('maximize satellite')
    await user.click(expandButton)

    await waitFor(() => {
      expect(screen.getByLabelText('close satellite')).toBeInTheDocument()
    })
  })

  it('should close when overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<Satellite />)

    // Expand first
    const expandButton = screen.getByLabelText('maximize satellite')
    await user.click(expandButton)

    await waitFor(() => {
      expect(screen.getByLabelText('close satellite')).toBeInTheDocument()
    })

    // Click overlay
    const overlay = screen.getByLabelText('close satellite')
    await user.click(overlay)

    await waitFor(() => {
      expect(screen.getByLabelText('maximize satellite')).toBeInTheDocument()
    })
  })

  it('should disable refresh button when loading', () => {
    ;(useSatellite as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockSatelliteData,
      isLoading: true
    })

    render(<Satellite />)

    const refreshButton = screen.getByLabelText('refresh satellite imagery')
    expect(refreshButton).toBeDisabled()
  })

  it('should not render when not mounted', () => {
    ;(useSatellite as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockSatelliteData
    })

    render(<Satellite />, {
      preloadedState: {
        preferences: {
          mounted: false,
          location: {
            id: 1,
            name: 'Test',
            latitude: 0,
            longitude: 0,
            country: 'US',
            admin1: '',
            display: 'Test, US'
          },
          tempUnit: 'f',
          colorScheme: 'auto',
          favorites: []
        }
      }
    })

    expect(screen.queryByText('Satellite')).not.toBeInTheDocument()
  })
})
