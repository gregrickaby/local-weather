import {fetcher} from '@/lib/helpers'
import {PlacesData, WeatherData} from '@/lib/types'
import useSWR from 'swr'

/**
 * Fetches the list of locations from `/api/places`.
 *
 * @see https://swr.vercel.app/
 */
export function usePlaces(location: string): PlacesData {
  const {data, error} = useSWR(
    location ? `/api/places?location=${location}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 minute
    }
  )

  return {
    locations: data,
    isLoading: !error && !data,
    isError: error
  }
}

/**
 * Fetches the weather data from `/api/weather`.
 *
 * @see https://swr.vercel.app/
 */
export function useWeather(location: string): WeatherData {
  const {data, error} = useSWR(
    location ? `/api/weather?location=${location}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true // Prevents flash when changing locations
    }
  )

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
