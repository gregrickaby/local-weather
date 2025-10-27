import {useAppSelector} from '@/lib/store/hooks'
import {selectTempUnit} from '@/lib/store/selectors'
import {getWindDirection} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed wind data for display.
 *
 * Handles data fetching, transformation, and unit conversion.
 * Returns ready-to-display wind information.
 */
export function useWindData() {
  const tempUnit = useAppSelector(selectTempUnit)
  const {data: weather} = useWeatherData()

  const windSpeed = Math.round(weather?.current?.wind_speed_10m || 0)
  const windGusts = Math.round(weather?.current?.wind_gusts_10m || 0)
  const windDirection = weather?.current?.wind_direction_10m || 0
  const directionLabel = getWindDirection(windDirection)
  const speedUnit = tempUnit === 'c' ? 'km/h' : 'mph'

  return {
    windSpeed,
    windGusts,
    windDirection,
    directionLabel,
    speedUnit
  }
}
