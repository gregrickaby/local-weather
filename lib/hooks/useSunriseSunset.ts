import {calculateSunPosition} from '@/lib/utils/calculations'
import {formatTimeWithMinutes} from '@/lib/utils/formatting'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed sunrise/sunset data for display.
 *
 * Handles data fetching, time formatting, and sun position calculation.
 * Returns ready-to-display sunrise/sunset information.
 */
export function useSunriseSunset() {
  const {data: weather} = useWeatherData()

  const sunriseISO = weather?.daily?.sunrise?.[0]
  const sunsetISO = weather?.daily?.sunset?.[0]

  const sunrise = sunriseISO ? formatTimeWithMinutes(sunriseISO) : '--:--'
  const sunset = sunsetISO ? formatTimeWithMinutes(sunsetISO) : '--:--'
  const sunPosition = calculateSunPosition(
    weather?.current?.time,
    sunriseISO,
    sunsetISO
  )

  return {
    sunrise,
    sunset,
    sunPosition
  }
}
