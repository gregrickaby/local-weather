import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {generateForecastStatement, getWeatherInfo} from '@/lib/utils/helpers'

/**
 * Hook to get processed current conditions data for display.
 *
 * Handles data fetching, weather code interpretation, and forecast generation.
 * Returns ready-to-display current weather information.
 */
export function useCurrentConditions() {
  const location = useAppSelector((state) => state.preferences.location)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const mounted = useAppSelector((state) => state.preferences.mounted)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  // Return null if weather data isn't loaded yet
  if (!weather?.current) {
    return null
  }

  const {
    current: {weather_code, temperature_2m, apparent_temperature, time},
    daily: {sunrise, sunset}
  } = weather

  // Get current conditions with day/night icon
  const {description, icon} = getWeatherInfo(
    weather_code,
    time,
    sunrise[0],
    sunset[0]
  )

  // Generate forecast statement
  const forecastStatement = generateForecastStatement(weather)

  // Should show "Feels Like" if apparent temp is significantly higher
  const showFeelsLike = apparent_temperature > temperature_2m

  return {
    tempUnit,
    temperature: temperature_2m,
    apparentTemperature: apparent_temperature,
    description,
    icon,
    forecastStatement,
    showFeelsLike
  }
}
