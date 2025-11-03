import {render, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import HomePage from './page'

// Mock next/navigation
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace
  })
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should redirect to default location when no stored location', async () => {
    render(<HomePage />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/enterprise-alabama-united-states'
      )
    })
  })

  it('should redirect to stored location when available', async () => {
    const storedLocation = {
      id: 5128581,
      name: 'New York',
      latitude: 40.7143,
      longitude: -74.006,
      elevation: 10,
      timezone: 'America/New_York',
      country_code: 'US',
      admin1: 'New York',
      display: 'New York, New York, United States'
    }

    localStorage.setItem('location', JSON.stringify(storedLocation))

    render(<HomePage />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/new-york-new-york')
    })
  })

  it('should handle invalid stored location gracefully', async () => {
    localStorage.setItem('location', 'invalid json')

    // Mock console.error to verify error handling
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<HomePage />)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to parse stored location:',
        expect.any(Error)
      )
      expect(mockReplace).toHaveBeenCalledWith(
        '/enterprise-alabama-united-states'
      )
    })

    consoleError.mockRestore()
  })

  it('should render nothing while redirecting', () => {
    const {container} = render(<HomePage />)
    expect(container).toBeEmptyDOMElement()
  })
})
