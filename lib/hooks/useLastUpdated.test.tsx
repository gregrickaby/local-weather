import {render, screen} from '@/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

// Mock useWeatherData used inside the hook
vi.mock('./useWeatherData', () => ({
  useWeatherData: vi.fn()
}))

import {useLastUpdated} from './useLastUpdated'
import {useWeatherData} from './useWeatherData'

function HookProbe() {
  const {relative, absolute} = useLastUpdated()
  return (
    <div>
      <span data-testid="relative">{relative ?? ''}</span>
      <span data-testid="absolute">{absolute ?? ''}</span>
    </div>
  )
}

describe('useLastUpdated', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return relative time from RTK query fulfilledTimeStamp', () => {
    // Now: 12:10:00Z, fetched: 12:09:00Z => 1 min ago
    const now = new Date('2025-01-15T12:10:00.000Z')
    vi.setSystemTime(now)
    ;(useWeatherData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {current: {time: '2025-01-15T12:00:00.000Z'}},
      fulfilledTimeStamp: Date.parse('2025-01-15T12:09:00.000Z')
    })

    render(<HookProbe />)

    // Exact phrasing is covered by formatting unit tests; here we only assert that a relative label is present
    expect(screen.getByTestId('relative')).not.toHaveTextContent('')
    // absolute still available from API time
    expect(screen.getByTestId('absolute')).toHaveTextContent('12:00 PM')
  })

  it('should fall back to absolute time from API when timestamp missing', () => {
    const now = new Date('2025-01-15T12:10:00.000Z')
    vi.setSystemTime(now)
    ;(useWeatherData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {current: {time: '2025-01-15T14:42:00.000Z'}},
      fulfilledTimeStamp: undefined
    })

    render(<HookProbe />)

    expect(screen.getByTestId('relative')).toHaveTextContent('')
    expect(screen.getByTestId('absolute')).toHaveTextContent('2:42 PM')
  })

  it('should return nulls when no data available', () => {
    const now = new Date('2025-01-15T12:10:00.000Z')
    vi.setSystemTime(now)
    ;(useWeatherData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      fulfilledTimeStamp: undefined
    })

    render(<HookProbe />)

    expect(screen.getByTestId('relative')).toHaveTextContent('')
    expect(screen.getByTestId('absolute')).toHaveTextContent('')
  })
})
