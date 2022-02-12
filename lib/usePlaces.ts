import useSWR from 'swr'
import {PlacesData} from '../types'
import fetcher from './fetcher'

/**
 * Fetch places data.
 *
 * @author Greg Rickaby
 * @param  {boolean} loading Are we loading or not?
 * @param  {string}  city    The city to find.
 * @return {object}          The places data object.
 */
export default function usePlaces(loading: boolean, city: string): PlacesData {
  const {data, error} = useSWR(
    loading ? null : `/api/places?city=${city}`,
    fetcher
  )

  return {
    cities: data,
    isLoading: !error && !data,
    isError: error
  }
}
