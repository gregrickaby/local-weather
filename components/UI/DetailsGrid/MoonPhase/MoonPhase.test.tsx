import {render, screen} from '@/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import MoonPhase from './MoonPhase'

// Mock the useMoonPhase hook
vi.mock('@/lib/hooks/useMoonPhase', () => ({
  useMoonPhase: vi.fn()
}))

import {useMoonPhase, type MoonPhaseData} from '@/lib/hooks/useMoonPhase'

describe('MoonPhase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render moon phase name', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'Waxing Crescent',
      phaseIcon: 'moon-waxing-crescent',
      illumination: '23%',
      fraction: 0.23,
      phase: 0.1
    } as MoonPhaseData)

    render(<MoonPhase />)

    expect(screen.getByText('Waxing Crescent')).toBeInTheDocument()
  })

  it('should render moon phase icon', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'Full Moon',
      phaseIcon: 'moon-full',
      illumination: '100%',
      fraction: 1,
      phase: 0.5
    } as MoonPhaseData)

    render(<MoonPhase />)

    expect(screen.getByAltText(/moon-full/)).toBeInTheDocument()
  })

  it('should render illumination percentage', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'First Quarter',
      phaseIcon: 'moon-first-quarter',
      illumination: '50%',
      fraction: 0.5,
      phase: 0.25
    } as MoonPhaseData)

    render(<MoonPhase />)

    expect(screen.getByText('50% illuminated')).toBeInTheDocument()
  })

  it('should render "Moon Phase" heading', () => {
    vi.mocked(useMoonPhase).mockReturnValue({
      phaseName: 'New Moon',
      phaseIcon: 'moon-new',
      illumination: '0%',
      fraction: 0,
      phase: 0
    } as MoonPhaseData)

    render(<MoonPhase />)

    expect(screen.getByText('Moon Phase')).toBeInTheDocument()
  })

  it('should display different moon phases correctly', () => {
    const testCases: MoonPhaseData[] = [
      {
        phaseName: 'New Moon',
        phaseIcon: 'moon-new',
        illumination: '0%',
        fraction: 0,
        phase: 0
      } as MoonPhaseData,
      {
        phaseName: 'Waxing Gibbous',
        phaseIcon: 'moon-waxing-gibbous',
        illumination: '75%',
        fraction: 0.75,
        phase: 0.35
      } as MoonPhaseData,
      {
        phaseName: 'Last Quarter',
        phaseIcon: 'moon-last-quarter',
        illumination: '50%',
        fraction: 0.5,
        phase: 0.75
      } as MoonPhaseData
    ]

    for (const testCase of testCases) {
      vi.mocked(useMoonPhase).mockReturnValue(testCase)
      const {rerender} = render(<MoonPhase />)

      expect(screen.getByText(testCase.phaseName)).toBeInTheDocument()
      expect(
        screen.getByAltText(new RegExp(testCase.phaseIcon))
      ).toBeInTheDocument()
      expect(
        screen.getByText(`${testCase.illumination} illuminated`)
      ).toBeInTheDocument()

      rerender(<MoonPhase />)
    }
  })
})
