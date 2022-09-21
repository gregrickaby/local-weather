import useSWR from 'swr'
import {fetcher} from '~/lib/helpers'
import {WeatherResponse} from '~/lib/types'

export interface PlacesData {
  locations: string[]
  isLoading: boolean
  isError: boolean
}

export function usePlaces(location: string): PlacesData {
  const {data, error} = useSWR(`/api/places?location=${location}`, fetcher)

  return {
    locations: data,
    isLoading: !error && !data,
    isError: error
  }
}

export interface WeatherData {
  weather: WeatherResponse
  isLoading: boolean
  isError: boolean
}

export function useWeather(location: string): WeatherData {
  const {data, error} = useSWR(`/api/weather?location=${location}`, fetcher)

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
