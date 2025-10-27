import {getUVInfo} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed UV index data for display.
 *
 * Handles data fetching and UV interpretation.
 * Returns ready-to-display UV information with position for visualization.
 */
export function useUVIndex() {
  const {data: weather} = useWeatherData()

  const currentUV = Math.round(weather?.current?.uv_index || 0)
  const uvScale = 11
  const indicatorPercent = (currentUV / uvScale) * 100
  const {level, description} = getUVInfo(currentUV)

  return {
    currentUV,
    indicatorPercent,
    level,
    description
  }
}
