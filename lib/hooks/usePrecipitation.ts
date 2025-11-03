import {useAppSelector} from '@/lib/store/hooks'
import {formatPrecipitation} from '@/lib/utils/formatting'
import {useWeatherData} from './useWeatherData'

/**
 * Custom hook for precipitation data.
 *
 * Processes current precipitation data including rain, showers, and snow.
 * Returns formatted values ready for display.
 *
 * @returns Precipitation data object
 */
export function usePrecipitation() {
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const {data: weather} = useWeatherData()

  const rain = weather?.current?.rain ?? 0
  const showers = weather?.current?.showers ?? 0
  const snowfall = weather?.current?.snowfall ?? 0

  // Total liquid precipitation (rain + showers)
  const totalLiquid = rain + showers

  // Format values
  const formattedRain = formatPrecipitation(tempUnit, totalLiquid)
  const formattedSnow = formatPrecipitation(tempUnit, snowfall)

  // Determine primary precipitation type
  const hasRain = totalLiquid > 0
  const hasSnow = snowfall > 0
  const hasPrecipitation = hasRain || hasSnow

  // Description - optimized with early returns
  const getDescription = (): string => {
    if (!hasPrecipitation) return 'No precipitation'
    if (hasRain && hasSnow) return 'Mixed precipitation'
    if (hasRain) return totalLiquid < 0.1 ? 'Light rain' : 'Rain'
    return snowfall < 0.1 ? 'Light snow' : 'Snow'
  }

  return {
    rain,
    showers,
    snowfall,
    totalLiquid,
    formattedRain,
    formattedSnow,
    hasRain,
    hasSnow,
    hasPrecipitation,
    description: getDescription()
  }
}
