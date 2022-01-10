import useSWR from 'swr'

// eslint-disable-next-line func-style
const fetcher = (url) => fetch(url).then((res) => res.json())

// Fetch weather.
export function useWeather(loading, coordinates) {
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
