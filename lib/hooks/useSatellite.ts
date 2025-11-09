import {SATELLITE_REFRESH_INTERVAL} from '@/lib/constants/satellite'
import {useAppSelector} from '@/lib/store/hooks'
import {selectLocation} from '@/lib/store/selectors'
import {generateSatelliteUrl, getSatelliteSector} from '@/lib/utils/satellite'
import {useEffect, useState} from 'react'

/**
 * Custom hook to manage satellite imagery based on user location.
 *
 * Handles automatic satellite selection, image URL generation, auto-refresh, and error states.
 * Chooses appropriate satellite (GOES-East, GOES-West, Himawari, Meteosat) based on coordinates.
 */
export function useSatellite() {
  const location = useAppSelector(selectLocation)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [satelliteName, setSatelliteName] = useState<string>('')
  const [satelliteType, setSatelliteType] = useState<string>('')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate image URL based on location
  const refreshImage = () => {
    const sector = getSatelliteSector(location.latitude, location.longitude)
    const url = generateSatelliteUrl(sector.url, sector.satellite)

    setImageUrl(url)
    setSatelliteName(sector.name)
    setSatelliteType(sector.satellite)
    setLastUpdate(new Date())
    setIsLoading(false)
    setError(null)
  }

  // Initial load and when location changes
  useEffect(() => {
    refreshImage()
  }, [location.latitude, location.longitude])

  // Auto-refresh on interval
  useEffect(() => {
    const interval = setInterval(() => {
      refreshImage()
    }, SATELLITE_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [location.latitude, location.longitude])

  // Handle image load error
  const handleImageError = () => {
    setError('Failed to load satellite imagery')
    setIsLoading(false)
  }

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  return {
    imageUrl,
    satelliteName,
    satelliteType,
    lastUpdate,
    isLoading,
    error,
    refreshImage,
    handleImageError,
    handleImageLoad
  }
}
