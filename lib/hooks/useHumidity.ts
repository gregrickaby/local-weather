import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {getHumidityDescription} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed humidity data for display.
 *
 * Handles data fetching and humidity interpretation.
 * Returns ready-to-display humidity information.
 */
export function useHumidity() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const humidity = Math.round(weather?.current?.relative_humidity_2m || 0)
  const dewPoint = Math.round(weather?.current?.dew_point_2m || 0)
  const description = getHumidityDescription(humidity)

  return {
    humidity,
    dewPoint,
    description
  }
}
