import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {getFeelsLikeDescription} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed feels like (apparent temperature) data for display.
 *
 * Handles data fetching and comparison description.
 * Returns ready-to-display feels like information.
 */
export function useFeelsLike() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const unit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {
      latitude: location.latitude,
      longitude: location.longitude,
      tempUnit: unit
    },
    {
      skip: !mounted || !location
    }
  )

  const feelsLike = weather?.current?.apparent_temperature || 0
  const actual = weather?.current?.temperature_2m || 0
  const description = getFeelsLikeDescription(feelsLike, actual)

  return {
    feelsLike,
    unit,
    description
  }
}
