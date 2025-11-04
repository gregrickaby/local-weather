import {DEFAULT_LOCATION, POPULAR_CITIES} from '@/lib/constants'
import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {setLocation} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {parseLocationSlug} from '@/lib/utils/slug'
import {useEffect, useState} from 'react'

interface UseCityPageLocationParams {
  slug: string | string[]
}

interface UseCityPageLocationResult {
  locationResolved: boolean
  locationError: boolean
}

/**
 * Custom hook for managing city page location resolution.
 *
 * Simplified approach using coordinate-based URLs:
 * 1. Extract coordinates from slug (format: {name}-{admin}-{country}-{lat}-{lon})
 * 2. Look up location in known locations by matching coordinates (within tolerance)
 * 3. If found, update Redux with full location data
 * 4. If not found, create a basic location object from coordinates and set it
 *
 * This works because Open-Meteo weather API uses coordinates directly!
 *
 * @param params - Object containing the location slug
 * @returns Object containing location resolution state
 */
export function useCityPageLocation({
  slug
}: UseCityPageLocationParams): UseCityPageLocationResult {
  const dispatch = useAppDispatch()
  const [locationResolved, setLocationResolved] = useState(false)
  const [locationError, setLocationError] = useState(false)

  // Get favorites from Redux (these include full location data from search results)
  const favorites = useAppSelector((state) => state.preferences.favorites)

  // Extract coordinates from slug
  const {latitude, longitude} = parseLocationSlug(slug)

  // Build list of all known locations (popular cities, default, and favorites)
  const allKnownLocations: Location[] = [
    ...POPULAR_CITIES,
    DEFAULT_LOCATION,
    ...favorites
  ]

  useEffect(() => {
    // Reset state when slug changes
    setLocationResolved(false)
    setLocationError(false)

    if (latitude === null || longitude === null) {
      // Invalid slug format - no valid coordinates found
      setLocationError(true)
      return
    }

    // Try to find exact match in known locations (within 0.01 degree tolerance)
    const TOLERANCE = 0.01
    const location = allKnownLocations.find(
      (loc) =>
        Math.abs(loc.latitude - latitude) < TOLERANCE &&
        Math.abs(loc.longitude - longitude) < TOLERANCE
    )

    if (location) {
      // Found in known locations - use full location data
      dispatch(setLocation(location))
      setLocationResolved(true)
      setLocationError(false)
    } else {
      // Not in known locations - create basic location from coordinates
      // The weather API will still work with just lat/lon
      const basicLocation: Location = {
        id: 0, // Temporary ID for unknown locations
        name: 'Unknown Location',
        latitude,
        longitude,
        admin1: 'Unknown',
        country: 'Unknown',
        display: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
      }

      dispatch(setLocation(basicLocation))
      setLocationResolved(true)
      setLocationError(false)
    }
  }, [slug, latitude, longitude, dispatch])

  return {
    locationResolved,
    locationError
  }
}
