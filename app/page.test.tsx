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
        '/forecast/enterprise/alabama/united-states/31.32/-85.86'
      )
    })
  })

  it('should redirect to stored location when available', async () => {
    const storedLocation = {
      id: 5128581,
      name: 'New York',
      latitude: 40.7143,
      longitude: -74.006,
      admin1: 'New York',
      country: 'United States',
      display: 'New York, New York, United States'
    }

    localStorage.setItem('location', JSON.stringify(storedLocation))

    render(<HomePage />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/forecast/new-york/new-york/united-states/40.71/-74.01'
      )
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
        '/forecast/enterprise/alabama/united-states/31.32/-85.86'
      )
    })

    consoleError.mockRestore()
  })

  it('should render nothing while redirecting', () => {
    const {container} = render(<HomePage />)
    expect(container).toBeEmptyDOMElement()
  })
})
