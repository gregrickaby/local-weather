import useSWR from 'swr'
import fetcher from '~/lib/fetcher'

interface PlacesData {
  locations: string[]
  isLoading: boolean
  isError: boolean
}

export default function usePlaces(location: string): PlacesData {
  const {data, error} = useSWR(`/api/places?location=${location}`, fetcher)

  return {
    locations: data,
    isLoading: !error && !data,
    isError: error
  }
}
