import {useAppSelector} from '@/lib/store/hooks'
import {selectLocation} from '@/lib/store/selectors'
import {useGetAirQualityQuery} from '@/lib/store/services/airQualityApi'
import {getAQIDescription, getAQILevel} from '@/lib/utils/conditions'

/**
 * Hook to get processed air quality data for display.
 *
 * Handles data fetching and AQI interpretation.
 * Returns ready-to-display air quality information.
 */
export function useAirQuality() {
  const location = useAppSelector(selectLocation)
  const {data} = useGetAirQualityQuery(location, {
    skip: !location
  })

  const aqi = data?.current?.us_aqi || 0
  const {level, color} = getAQILevel(aqi)
  const description = getAQIDescription(aqi)

  return {
    aqi,
    level,
    color,
    description
  }
}
