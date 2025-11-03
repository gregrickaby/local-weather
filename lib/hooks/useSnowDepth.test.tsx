import {describe, it, expect} from 'vitest'
import {render, screen, waitFor, mockLocation} from '@/test-utils'
import {useSnowDepth} from './useSnowDepth'

// Test component that uses the hook
function TestComponent() {
  const {snowDepthMeters, formatted, hasSnow, description} = useSnowDepth()

  return (
    <div>
      <div data-testid="snow-depth">{snowDepthMeters}</div>
      <div data-testid="formatted">{formatted}</div>
      <div data-testid="has-snow">{hasSnow.toString()}</div>
      <div data-testid="description">{description}</div>
    </div>
  )
}

describe('useSnowDepth', () => {
  it('should return no snow data when weather data loaded', async () => {
    render(<TestComponent />, {
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
      expect(screen.getByTestId('has-snow')).toHaveTextContent('false')
      expect(screen.getByTestId('formatted')).toHaveTextContent('0')
      expect(screen.getByTestId('description')).toHaveTextContent(
        'No snow on ground'
      )
    })
  })
})
