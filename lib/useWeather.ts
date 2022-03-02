import useSWR from 'swr'
import fetcher from '~/lib/fetcher'

interface WeatherData {
  weather: Object[]
  isLoading: boolean
  isError: boolean
}

export default function useWeather(location: string): WeatherData {
  const {data, error} = useSWR(`/api/weather?location=${location}`, fetcher)

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
