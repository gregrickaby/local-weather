import useSWR from 'swr'
import fetcher from './fetcher'

interface WeatherData {
  weather: Object[]
  isLoading: boolean
  isError: boolean
}

/**
 * Fetch weather data from internal API route.
 *
 * @author Greg Rickaby
 * @param  {string} location The location to fetch weather for.
 * @return {object}          The weather data object.
 */
export default function useWeather(location: string): WeatherData {
  const {data, error} = useSWR(`/api/weather?location=${location}`, fetcher)

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
