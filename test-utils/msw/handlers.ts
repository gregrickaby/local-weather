import {http, HttpResponse} from 'msw'
import {
  mockWeatherResponse,
  mockGeocodeResponse,
  mockAirQualityResponse
} from '../mocks/mockData'

/**
 * MSW handlers for Open-Meteo APIs
 *
 * @see https://mswjs.io/docs/
 */
export const handlers = [
  // Mock weather API endpoint
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json(mockWeatherResponse)
  }),

  // Mock geocoding API endpoint
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({request}) => {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')

    // Return empty results for short queries
    if (!name || name.length < 2) {
      return HttpResponse.json({results: []})
    }

    return HttpResponse.json(mockGeocodeResponse)
  }),

  // Mock air quality API endpoint
  http.get('https://air-quality-api.open-meteo.com/v1/air-quality', () => {
    return HttpResponse.json(mockAirQualityResponse)
  })
]
