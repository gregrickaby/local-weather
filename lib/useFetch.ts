import useSWR from 'swr'
import {WeatherData} from '../types'

// Generic fetcher.
const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Reusable hook to fetch data from an API.
 *
 * @author Greg Rickaby
 * @param  {boolean} loading         Are we loading or not?
 * @param  {object}  coordinates     The coordinates to fetch weather for.
 * @param  {number}  coordinates.lat The latitude of the location.
 * @param  {number}  coordinates.lng The longitude of the location.
 * @return {object}                  The weather data object.
 */
export default function useFetch(
  loading: boolean,
  coordinates: {lat: number; lng: number}
): WeatherData {
  const {data, error} = useSWR(
    loading
      ? null
      : `/api/weather?lat=${coordinates?.lat}&lng=${coordinates?.lng}`,
    fetcher
  )

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error
  }
}
