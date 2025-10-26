import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {formatTimeWithMinutes} from '@/lib/utils/helpers'
import {calculateSunPosition} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed sunrise/sunset data for display.
 *
 * Handles data fetching, time formatting, and sun position calculation.
 * Returns ready-to-display sunrise/sunset information.
 */
export function useSunriseSunset() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

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
