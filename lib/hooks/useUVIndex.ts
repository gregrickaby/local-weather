import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {getUVInfo} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed UV index data for display.
 *
 * Handles data fetching and UV interpretation.
 * Returns ready-to-display UV information with position for visualization.
 */
export function useUVIndex() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

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
