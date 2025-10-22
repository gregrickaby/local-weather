import {CACHE_DURATION} from '@/lib/constants'
import type {Location, OpenMeteoGeocodeResponse} from '@/lib/types'
import {
  createErrorResponse,
  createSuccessResponse,
  logError
} from '@/lib/utils/api'

/**
 * Search for locations via Open-Meteo Geocoding API.
 *
 * Returns location objects with coordinates instead of strings.
 *
 * @param request - HTTP request with query param: location
 * @returns Location[] array of matching locations
 * @throws 400 - Missing location parameter
 * @throws 404 - No locations found
 * @throws 500 - API error or network failure
 *
 * @example
 * /api/places?location=enterprise
 *
 * @author Greg Rickaby
 * @see https://open-meteo.com/en/docs/geocoding-api
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  const locationParam = searchParams.get('location')

  if (!locationParam || !locationParam.trim()) {
    return createErrorResponse('Location parameter is required', 400)
  }

  try {
    // Build geocoding API query parameters
    const params = new URLSearchParams({
      name: locationParam.trim(),
      count: '10',
      language: 'en',
      format: 'json'
    })

    const geocode = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
    )

    if (!geocode.ok) {
      logError('places-geocode', `Geocoding failed: ${geocode.statusText}`)
      return createErrorResponse('Failed to search locations', geocode.status)
    }

    const data = (await geocode.json()) as OpenMeteoGeocodeResponse

    if (!data.results || data.results.length === 0) {
      return createErrorResponse('No locations found', 404)
    }

    // Build the list of location objects with coordinates
    const locations: Location[] = data.results.map((result) => {
      const parts = [result.name]
      if (result.admin1) parts.push(result.admin1)
      if (result.country) parts.push(result.country)
      const display = parts.join(', ')

      return {
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        admin1: result.admin1,
        country: result.country,
        display
      }
    })

    return createSuccessResponse(locations, CACHE_DURATION.PLACES)
  } catch (error) {
    logError('places-geocode', error)
    return createErrorResponse('Location search error occurred', 500)
  }
}
