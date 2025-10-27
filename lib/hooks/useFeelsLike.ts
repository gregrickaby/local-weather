import {useAppSelector} from '@/lib/store/hooks'
import {selectTempUnit} from '@/lib/store/selectors'
import {getFeelsLikeDescription} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Hook to get processed feels like (apparent temperature) data for display.
 *
 * Handles data fetching and comparison description.
 * Returns ready-to-display feels like information.
 */
export function useFeelsLike() {
  const unit = useAppSelector(selectTempUnit)
  const {data: weather} = useWeatherData()

  const feelsLike = weather?.current?.apparent_temperature || 0
  const actual = weather?.current?.temperature_2m || 0
  const description = getFeelsLikeDescription(feelsLike, actual)

  return {
    feelsLike,
    unit,
    description
  }
}
