import {useAppSelector} from '@/lib/store/hooks'
import {selectWeatherQueryParams} from '@/lib/store/selectors'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'

/**
 * Centralized hook for fetching weather data.
 *
 * This hook provides a single source of truth for weather API calls,
 * preventing duplicate subscriptions and reducing re-renders.
 *
 * All other weather-related hooks should use this hook instead of
 * calling useGetWeatherQuery directly.
 *
 * Uses memoized selector to prevent unnecessary re-renders when
 * preferences haven't changed.
 *
 * @returns RTK Query result object with weather data
 */
export function useWeatherData() {
  const {latitude, longitude, tempUnit, mounted, location} = useAppSelector(
    selectWeatherQueryParams
  )

  return useGetWeatherQuery(
    {latitude, longitude, tempUnit},
    {
      skip: !mounted || !location,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: 300
    }
  )
}
