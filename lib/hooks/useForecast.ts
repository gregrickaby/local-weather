import {useAppSelector} from '@/lib/store/hooks'
import {selectTempUnit} from '@/lib/store/selectors'
import {getHourFromISO} from '@/lib/utils/calculations'
import {useWeatherData} from './useWeatherData'

type HourlyForecast = {
  time: string
  temp: number
  feels_like: number
  weather_code: number
  precipitation_probability: number
}

type DailyForecast = {
  date: string
  weather_code: number
  temp_max: number
  temp_min: number
  temp_current?: number
  feels_like: number
  precipitation_probability: number
}

/**
 * Hook to get processed forecast data for display.
 *
 * Handles complex hourly/daily forecast transformations, filtering, and calculations.
 * Returns ready-to-display forecast information with weather data.
 */
export function useForecast() {
  const tempUnit = useAppSelector(selectTempUnit)
  const {data: weather} = useWeatherData()

  if (!weather?.hourly || !weather?.daily) {
    return null
  }

  // Use the location's current time from the API (not browser time)
  // This ensures correct time display for any timezone
  // Parse the hour directly from the ISO string to avoid timezone conversion
  const currentHourIndex = getHourFromISO(weather.current.time)

  // Generate hourly forecast starting from current hour
  const hourlyForecasts: HourlyForecast[] = Array.from({length: 24}, (_, i) => {
    const index = currentHourIndex + i
    // Validate array bounds before accessing
    if (index >= weather.hourly.time.length) {
      return null
    }
    return {
      time: weather.hourly.time[index],
      temp: weather.hourly.temperature_2m[index],
      feels_like: weather.hourly.apparent_temperature[index],
      weather_code: weather.hourly.weather_code[index],
      precipitation_probability: weather.hourly.precipitation_probability[index]
    }
  }).filter((item): item is HourlyForecast => item !== null)

  // Skip "Today" in daily forecast if it's after 8 PM (late evening)
  // At this point, users are more interested in tomorrow's forecast
  const skipToday = currentHourIndex >= 20
  const dailyForecastsRaw: DailyForecast[] = weather.daily.time.map(
    (date, index) => ({
      date,
      weather_code: weather.daily.weather_code[index],
      temp_max: weather.daily.temperature_2m_max[index],
      temp_min: weather.daily.temperature_2m_min[index],
      temp_current:
        index === 0 && !skipToday
          ? weather.hourly.temperature_2m[currentHourIndex]
          : undefined,
      feels_like: weather.daily.apparent_temperature_max[index],
      precipitation_probability:
        weather.daily.precipitation_probability_max[index]
    })
  )

  // Filter out today if it's late evening
  const dailyForecasts = skipToday
    ? dailyForecastsRaw.slice(1)
    : dailyForecastsRaw

  // Calculate dynamic temperature scale based on actual data
  const allTemps = dailyForecasts.flatMap((f) => [
    f.temp_min,
    f.temp_max,
    f.temp_current
  ])
  const validTemps = allTemps.filter(
    (t): t is number => typeof t === 'number' && !Number.isNaN(t)
  )
  const minTempScale = Math.floor(Math.min(...validTemps) - 5)
  const maxTempScale = Math.ceil(Math.max(...validTemps) + 5)
  const tempRange = maxTempScale - minTempScale

  return {
    weather,
    hourlyForecasts,
    dailyForecasts,
    tempUnit,
    tempScale: {
      min: minTempScale,
      max: maxTempScale,
      range: tempRange
    }
  }
}
