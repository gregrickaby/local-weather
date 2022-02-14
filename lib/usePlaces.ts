import useSWR from 'swr'
import {PlacesData} from '../types'
import fetcher from './fetcher'

/**
 * Fetch places data from internal API route.
 *
 * @author Greg Rickaby
 * @param  {string} location The location to find.
 * @return {object}          The places data object.
 */
export default function usePlaces(location: string): PlacesData {
  const {data, error} = useSWR(`/api/places?location=${location}`, fetcher)

  return {
    locations: data,
    isLoading: !error && !data,
    isError: error
  }
}
