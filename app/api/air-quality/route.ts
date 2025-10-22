import {CACHE_DURATION} from '@/lib/constants'
import type {AirQualityResponse} from '@/lib/types'
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  validateCoordinates
} from '@/lib/utils/api'

/**
 * Fetch air quality data from the Open-Meteo Air Quality API.
 *
 * Accepts coordinates directly for accurate air quality data.
 *
 * @param request - HTTP request with query params: latitude, longitude
 * @returns AirQualityResponse with air quality data
 * @throws 400 - Invalid or missing coordinates
 * @throws 500 - API error or network failure
 *
 * @example
 * /api/air-quality?latitude=31.31517&longitude=-85.85522
 *
 * @author Greg Rickaby
 * @see https://open-meteo.com/en/docs/air-quality-api
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  const latParam = searchParams.get('latitude')
  const lonParam = searchParams.get('longitude')

  // Validate and parse coordinates
  const result = validateCoordinates(latParam, lonParam)
  if (result instanceof Response) {
    return result
  }

  const {lat, lon} = result

  try {
    // Build air quality API query parameters
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'us_aqi,pm2_5,pm10,european_aqi',
      timezone: 'auto'
    })

    const airQuality = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
    )

    if (!airQuality.ok) {
      logError(
        'air-quality-fetch',
        `Air Quality API failed: ${airQuality.statusText}`
      )
      return createErrorResponse(
        'Failed to fetch air quality data',
        airQuality.status
      )
    }

    const data = (await airQuality.json()) as AirQualityResponse

    if (!data.latitude || !data.longitude) {
      return createErrorResponse('Invalid air quality data received', 500)
    }

    return createSuccessResponse(data, CACHE_DURATION.AIR_QUALITY)
  } catch (error) {
    logError('air-quality-fetch', error)
    return createErrorResponse('Air quality fetch error occurred', 500)
  }
}
