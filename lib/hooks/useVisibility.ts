import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {getVisibilityDescription} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed visibility data for display.
 *
 * Handles data fetching, unit conversion, capping, and description.
 * Returns ready-to-display visibility information.
 */
export function useVisibility() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const visibilityMeters = weather?.current?.visibility || 0

  // Open-Meteo can return theoretical max visibility (24km+)
  // But weather services typically cap at 10 miles / 16 km (standard reporting limit)
  // This matches what NOAA and other services show
  const cappedVisibilityMeters = Math.min(visibilityMeters, 16000)

  // Convert to miles (imperial) or kilometers (metric)
  const visibilityValue =
    tempUnit === 'c'
      ? Math.round(cappedVisibilityMeters / 1000) // km (whole number)
      : Math.round((cappedVisibilityMeters / 1000) * 0.621371) // mi (whole number)
  const visibilityUnit = tempUnit === 'c' ? 'km' : 'mi'

  const description = getVisibilityDescription(
    visibilityValue,
    tempUnit === 'c'
  )

  return {
    visibilityValue,
    visibilityUnit,
    description
  }
}
