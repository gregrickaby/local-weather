import {
  formatRelativeFromMs,
  formatTimeWithMinutes
} from '@/lib/utils/formatting'
import {useWeatherData} from './useWeatherData'

/**
 * Provides "last updated" information for weather data.
 *
 * Prefers RTK Query's fulfilledTimeStamp (relative "x min ago")
 * and falls back to Open-Meteo's current.time (absolute local time label).
 */

export function useLastUpdated(): {
  relative: string | null
  absolute: string | null
  iso: string | null
} {
  const {data, fulfilledTimeStamp} = useWeatherData()

  const iso = data?.current?.time ?? null

  // Absolute label from API's current.time (already converted to location's timezone in our transformer)
  const absolute = iso ? formatTimeWithMinutes(iso) : null

  // Relative label from RTK Query's fulfilledTimeStamp
  let relative: string | null = null
  if (
    typeof fulfilledTimeStamp === 'number' &&
    Number.isFinite(fulfilledTimeStamp)
  ) {
    const now = Date.now()
    const diffMs = Math.max(0, now - fulfilledTimeStamp)
    relative = formatRelativeFromMs(diffMs)
  }

  return {relative, absolute, iso}
}
