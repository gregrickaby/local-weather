/**
 * Custom hook for moon phase data.
 *
 * Encapsulates moon phase calculations and formatting logic.
 * Returns processed moon phase data ready for component rendering.
 */

import {getMoonIllumination} from '@/lib/utils/calculations'
import {getMoonPhaseEmoji, getMoonPhaseName} from '@/lib/utils/conditions'
import {getMoonIlluminationPercentage} from '@/lib/utils/formatting'

export interface MoonPhaseData {
  phaseName: string
  phaseEmoji: string
  illumination: string
  fraction: number
  phase: number
}

/**
 * Hook to get current moon phase information.
 *
 * @returns Moon phase data including name, emoji, and illumination percentage
 */
export function useMoonPhase(): MoonPhaseData {
  const moonData = getMoonIllumination()

  return {
    phaseName: getMoonPhaseName(moonData.phase),
    phaseEmoji: getMoonPhaseEmoji(moonData.phase),
    illumination: getMoonIlluminationPercentage(moonData.fraction),
    fraction: moonData.fraction,
    phase: moonData.phase
  }
}
