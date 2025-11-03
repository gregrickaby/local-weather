import {DEFAULT_LOCATION, POPULAR_CITIES} from '@/lib/constants'
import {useAppDispatch} from '@/lib/store/hooks'
import {useGetPlacesQuery} from '@/lib/store/services/placesApi'
import {setLocation} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {createLocationSlug, parseLocationSlug} from '@/lib/utils/slug'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

interface UseCityPageLocationParams {
  slug: string
}

interface UseCityPageLocationResult {
  locationResolved: boolean
  locationError: boolean
  isSearching: boolean
}

/**
 * Custom hook for managing city page location resolution.
 *
 * Handles the complex logic of:
 * - Resolving location from slug (checking popular cities first)
 * - Fetching location data via geocoding API if not found locally
 * - Updating Redux state with resolved location
 * - Redirecting to correct URL if slug doesn't match
 * - Managing loading and error states
 *
 * @param params - Object containing the location slug
 * @returns Object containing location resolution state
 */
export function useCityPageLocation({
  slug
}: UseCityPageLocationParams): UseCityPageLocationResult {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [locationResolved, setLocationResolved] = useState(false)
  const [locationError, setLocationError] = useState(false)

  // Try to find location in popular cities first
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  const knownLocation = allLocations.find(
    (city) => createLocationSlug(city) === slug
  )

  // If not in popular cities, try to resolve via geocoding
  const {searchTerm} = parseLocationSlug(slug)
  const {data: locations, isLoading: isSearching} = useGetPlacesQuery(
    searchTerm,
    {
      skip: !!knownLocation // Skip query if we already have the location
    }
  )

  // Reset location resolution when slug changes
  useEffect(() => {
    setLocationResolved(false)
    setLocationError(false)
  }, [slug])

  // Update Redux state with the resolved location
  useEffect(() => {
    let locationToSet: Location | null = null

    if (knownLocation) {
      locationToSet = knownLocation
    } else if (locations && locations.length > 0) {
      // Use the first result from geocoding
      locationToSet = locations[0]
    }

    if (locationToSet && !locationResolved) {
      dispatch(setLocation(locationToSet))
      setLocationResolved(true)
      setLocationError(false)

      // If the resolved location has a different slug, redirect to correct URL
      const correctSlug = createLocationSlug(locationToSet)
      if (correctSlug !== slug) {
        router.replace(`/${correctSlug}`)
      }
    } else if (
      !knownLocation &&
      !isSearching &&
      (!locations || locations.length === 0) &&
      !locationResolved
    ) {
      // Location could not be resolved
      setLocationError(true)
    }
  }, [
    knownLocation,
    locations,
    isSearching,
    locationResolved,
    dispatch,
    slug,
    router
  ])

  return {
    locationResolved,
    locationError,
    isSearching
  }
}
