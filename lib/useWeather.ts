import useSWR from 'swr'
import fetcher from '~/lib/fetcher'
import {WeatherData} from '~/lib/types'

export default function useWeather(location: string): WeatherData {
  const {data, error} = useSWR(`/api/weather?location=${location}`, fetcher)

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
