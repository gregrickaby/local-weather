import {useAppSelector} from '@/lib/store/hooks'
import {selectTempUnit} from '@/lib/store/selectors'
import {getVisibilityDescription} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed visibility data for display.
 *
 * Handles data fetching, unit conversion, and description.
 * Returns ready-to-display visibility information.
 */
export function useVisibility() {
  const tempUnit = useAppSelector(selectTempUnit)
  const {data: weather} = useWeatherData()

  const visibilityMeters = weather?.current?.visibility || 0

  // Convert to miles (imperial) or kilometers (metric)
  const visibilityValue =
    tempUnit === 'c'
      ? Math.round(visibilityMeters / 1000) // km (whole number)
      : Math.round((visibilityMeters / 1000) * 0.621371) // mi (whole number)
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
