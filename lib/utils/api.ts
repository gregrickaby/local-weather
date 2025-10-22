/**
 * API utility functions for consistent error handling and responses.
 */

import {COORDINATE_LIMITS} from '@/lib/constants'

/**
 * API error response structure.
 */
export interface ApiErrorResponse {
  error: string
}

/**
 * Create a consistent error response.
 *
 * @param message - Error message to return
 * @param status - HTTP status code
 * @returns Response object with JSON error
 */
export function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({error: message}), {
    status,
    headers: {'Content-Type': 'application/json'}
  })
}

/**
 * Create a success response with proper headers.
 *
 * @param data - Data to return
 * @param cacheMaxAge - Cache max age in seconds
 * @returns Response object with JSON data
 */
export function createSuccessResponse(
  data: unknown,
  cacheMaxAge: number
): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `s-maxage=${cacheMaxAge}, stale-while-revalidate`
    }
  })
}

/**
 * Validate and parse coordinates from query parameters.
 *
 * @param latParam - Latitude parameter string
 * @param lonParam - Longitude parameter string
 * @returns Parsed coordinates or error response
 */
export function validateCoordinates(
  latParam: string | null,
  lonParam: string | null
): {lat: number; lon: number} | Response {
  if (!latParam || !lonParam) {
    return createErrorResponse(
      'Latitude and longitude parameters are required',
      400
    )
  }

  const lat = Number.parseFloat(latParam)
  const lon = Number.parseFloat(lonParam)

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return createErrorResponse('Invalid latitude or longitude values', 400)
  }

  if (
    lat < COORDINATE_LIMITS.LAT_MIN ||
    lat > COORDINATE_LIMITS.LAT_MAX ||
    lon < COORDINATE_LIMITS.LON_MIN ||
    lon > COORDINATE_LIMITS.LON_MAX
  ) {
    return createErrorResponse(
      `Latitude must be between ${COORDINATE_LIMITS.LAT_MIN} and ${COORDINATE_LIMITS.LAT_MAX}, longitude between ${COORDINATE_LIMITS.LON_MIN} and ${COORDINATE_LIMITS.LON_MAX}`,
      400
    )
  }

  return {lat, lon}
}

/**
 * Log error in development only.
 *
 * @param context - Context/label for the error
 * @param error - Error object or message
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}
