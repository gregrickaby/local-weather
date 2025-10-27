import {useAppSelector} from '@/lib/store/hooks'
import {selectTempUnit} from '@/lib/store/selectors'
import {generateForecastStatement} from '@/lib/utils/calculations'
import {getWeatherInfo} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed current conditions data for display.
 *
 * Handles data fetching, weather code interpretation, and forecast generation.
 * Returns ready-to-display current weather information.
 */
export function useCurrentConditions() {
  const tempUnit = useAppSelector(selectTempUnit)
  const {data: weather} = useWeatherData()

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
