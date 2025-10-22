import {CACHE_DURATION} from '@/lib/constants'
import type {OpenMeteoGeocodeResponse, OpenMeteoResponse} from '@/lib/types'
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  validateCoordinates
} from '@/lib/utils/api'

/**
 * Fetch weather data from the Open-Meteo API.
 *
 * Accepts coordinates directly for accurate weather data, with fallback to geocoding.
 *
 * @param request - HTTP request with query params: latitude, longitude, tempUnit
 * @returns OpenMeteoResponse with weather data
 * @throws 400 - Invalid or missing parameters
 * @throws 404 - Location not found (fallback geocoding)
 * @throws 500 - API error or network failure
 *
 * @example
 * /api/weather?latitude=31.31517&longitude=-85.85522&tempUnit=f
 *
 * @author Greg Rickaby
 * @see https://open-meteo.com/en/docs/geocoding-api
 * @see https://open-meteo.com/en/docs
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  // Parse params - accept coordinates directly or location name for fallback
  const latParam = searchParams.get('latitude')
  const lonParam = searchParams.get('longitude')
  const locationParam = searchParams.get('location')
  const tempUnit = searchParams.get('tempUnit') || 'f'

  // Determine temperature unit for API
  const temperatureUnit = tempUnit === 'c' ? 'celsius' : 'fahrenheit'
  const windSpeedUnit = tempUnit === 'c' ? 'kmh' : 'mph'

  let lat: number
  let lon: number

  // If coordinates are provided, use them directly (preferred method)
  if (latParam && lonParam) {
    const result = validateCoordinates(latParam, lonParam)
    if (result instanceof Response) {
      return result
    }
    lat = result.lat
    lon = result.lon
  } else if (locationParam) {
    // Fallback: geocode the location name
    const params = new URLSearchParams({
      name: locationParam.trim(),
      count: '1',
      language: 'en',
      format: 'json'
    })

    try {
      const geocode = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
      )

      if (!geocode.ok) {
        logError('weather-geocode', `Geocoding failed: ${geocode.statusText}`)
        return createErrorResponse('Failed to geocode location', geocode.status)
      }

      const data = (await geocode.json()) as OpenMeteoGeocodeResponse

      if (!data.results || data.results.length === 0) {
        return createErrorResponse('Location not found', 404)
      }

      lat = data.results[0].latitude
      lon = data.results[0].longitude
    } catch (error) {
      logError('weather-geocode', error)
      return createErrorResponse('Geocoding error occurred', 500)
    }
  } else {
    return createErrorResponse(
      'Either coordinates (latitude, longitude) or location name is required',
      400
    )
  }

  try {
    // Build weather API query parameters
    const weatherParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility,pressure_msl,dew_point_2m',
      hourly:
        'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,sunrise,sunset,uv_index_max',
      temperature_unit: temperatureUnit,
      wind_speed_unit: windSpeedUnit,
      precipitation_unit: 'inch',
      forecast_days: '10',
      timezone: 'auto'
    })

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`
    )

    if (!weather.ok) {
      logError('weather-fetch', `Weather API failed: ${weather.statusText}`)
      return createErrorResponse('Failed to fetch weather data', weather.status)
    }

    const forecast = (await weather.json()) as OpenMeteoResponse

    if (!forecast.latitude || !forecast.longitude) {
      return createErrorResponse('Invalid weather data received', 500)
    }

    return createSuccessResponse(forecast, CACHE_DURATION.WEATHER)
  } catch (error) {
    logError('weather-fetch', error)
    return createErrorResponse('Weather fetch error occurred', 500)
  }
}
