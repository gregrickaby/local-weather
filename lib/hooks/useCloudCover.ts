import {getCloudCoverDescription} from '@/lib/utils/conditions'
import {useWeatherData} from './useWeatherData'

/**
 * Custom hook for cloud cover data.
 *
 * Processes current cloud cover percentage.
 * Returns formatted values ready for display.
 *
 * @returns Cloud cover data object
 */
export function useCloudCover() {
  const {data: weather} = useWeatherData()

  const cloudCover = Math.round(weather?.current?.cloud_cover ?? 0)
  const description = getCloudCoverDescription(cloudCover)

  return {
    cloudCover,
    description
  }
}
