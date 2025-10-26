import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {formatPressure} from '@/lib/utils/helpers'
import {getPressureDescription} from '@/lib/utils/weather-helpers'

/**
 * Hook to get processed pressure data for display.
 *
 * Handles data fetching, unit conversion, normalization, and description.
 * Returns ready-to-display pressure information.
 */
export function usePressure() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const pressureHpa = weather?.current?.pressure_msl || 1013
  const {value: pressureValue, unit: pressureUnit} = formatPressure(
    tempUnit,
    pressureHpa
  )

  // Normalize pressure to 0-100 scale matching description thresholds
  // For hPa: range 1000-1040 (Very low < 1000, Low 1000-1010, Normal 1010-1020, High >= 1020)
  // For inHg: range 29.53-30.71 (converted from hPa range)
  const normalizedValue =
    tempUnit === 'f'
      ? Math.max(
          0,
          Math.min(
            100,
            ((Number.parseFloat(pressureValue) - 29.53) / 1.18) * 100
          )
        )
      : Math.max(0, Math.min(100, ((pressureHpa - 1000) / 40) * 100))

  const description = getPressureDescription(pressureHpa)

  return {
    pressureValue,
    pressureUnit,
    normalizedValue,
    description
  }
}
