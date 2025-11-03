import {useAppSelector} from '@/lib/store/hooks'
import {formatSnowDepth} from '@/lib/utils/formatting'
import {useWeatherData} from './useWeatherData'

/**
 * Custom hook for snow depth data.
 *
 * Processes current snow depth on the ground.
 * Returns formatted values ready for display.
 *
 * @returns Snow depth data object
 */
export function useSnowDepth() {
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const {data: weather} = useWeatherData()

  const snowDepthMeters = weather?.current?.snow_depth ?? 0
  const hasSnow = snowDepthMeters > 0

  const formatted = hasSnow ? formatSnowDepth(tempUnit, snowDepthMeters) : '0'

  // Description based on depth
  let description = 'No snow on ground'
  if (hasSnow) {
    const inches = snowDepthMeters * 39.3701
    if (inches < 1) {
      description = 'Light snow cover'
    } else if (inches < 6) {
      description = 'Moderate snow depth'
    } else {
      description = 'Significant snow depth'
    }
  }

  return {
    snowDepthMeters,
    formatted,
    hasSnow,
    description
  }
}
