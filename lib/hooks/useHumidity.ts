import {getHumidityDescription} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed humidity data for display.
 *
 * Handles data fetching and humidity interpretation.
 * Returns ready-to-display humidity information.
 */
export function useHumidity() {
  const {data: weather} = useWeatherData()

  const humidity = Math.round(weather?.current?.relative_humidity_2m || 0)
  const dewPoint = Math.round(weather?.current?.dew_point_2m || 0)
  const description = getHumidityDescription(humidity)

  return {
    humidity,
    dewPoint,
    description
  }
}
