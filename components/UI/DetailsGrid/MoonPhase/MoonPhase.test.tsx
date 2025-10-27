import {render, screen} from '@/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import MoonPhase from './MoonPhase'

// Mock the useMoonPhase hook
vi.mock('@/lib/hooks/useMoonPhase', () => ({
  useMoonPhase: vi.fn()
}))

import {useMoonPhase} from '@/lib/hooks/useMoonPhase'

describe('MoonPhase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render moon phase name', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'Waxing Crescent',
      phaseEmoji: '🌒',
      illumination: '23%',
      fraction: 0.23,
      phase: 0.1
    })

    render(<MoonPhase />)

    expect(screen.getByText('Waxing Crescent')).toBeInTheDocument()
  })

  it('should render moon phase emoji', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'Full Moon',
      phaseEmoji: '🌕',
      illumination: '100%',
      fraction: 1.0,
      phase: 0.5
    })

    render(<MoonPhase />)

    expect(screen.getByText('🌕')).toBeInTheDocument()
  })

  it('should render illumination percentage', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'First Quarter',
      phaseEmoji: '🌓',
      illumination: '50%',
      fraction: 0.5,
      phase: 0.25
    })

    render(<MoonPhase />)

    expect(screen.getByText('50% illuminated')).toBeInTheDocument()
  })

  it('should render "Moon Phase" heading', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'New Moon',
      phaseEmoji: '🌑',
      illumination: '0%',
      fraction: 0.0,
      phase: 0.0
    })

    render(<MoonPhase />)

    expect(screen.getByText('Moon Phase')).toBeInTheDocument()
  })

  it('should display different moon phases correctly', () => {
    const testCases = [
      {
        phaseName: 'New Moon',
        phaseEmoji: '🌑',
        illumination: '0%',
        fraction: 0.0,
        phase: 0.0
      },
      {
        phaseName: 'Waxing Gibbous',
        phaseEmoji: '🌔',
        illumination: '75%',
        fraction: 0.75,
        phase: 0.35
      },
      {
        phaseName: 'Last Quarter',
        phaseEmoji: '🌗',
        illumination: '50%',
        fraction: 0.5,
        phase: 0.75
      }
    ]

    testCases.forEach((testCase) => {
      vi.mocked(useMoonPhase).mockReturnValue(testCase)
      const {rerender} = render(<MoonPhase />)

      expect(screen.getByText(testCase.phaseName)).toBeInTheDocument()
      expect(screen.getByText(testCase.phaseEmoji)).toBeInTheDocument()
      expect(
        screen.getByText(`${testCase.illumination} illuminated`)
      ).toBeInTheDocument()

      rerender(<MoonPhase />)
    })
  })
})
