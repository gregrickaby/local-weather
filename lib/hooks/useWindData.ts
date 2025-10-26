import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {getWindDirection} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed wind data for display.
 *
 * Handles data fetching, transformation, and unit conversion.
 * Returns ready-to-display wind information.
 */
export function useWindData() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

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
