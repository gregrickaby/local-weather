import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Fetch weather.
export function useWeather(coordinates) {
  const { data, error } = useSWR(
    `/api/weather?lat=${coordinates?.lat}&lng=${coordinates?.lng}`,
    fetcher
  );

  return {
    weather: data,
    isLoading: !error && !data,
    isError: error,
  };
}
