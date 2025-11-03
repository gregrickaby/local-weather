import type {Location, OpenMeteoGeocodeResponse} from '@/lib/types'

/**
 * Mock weather data for testing
 */
export const mockWeatherResponse = {
  latitude: 31.3115,
  longitude: -85.855,
  timezone: 'America/Chicago',
  current: {
    time: '2025-01-15T12:00:00.000Z',
    temperature_2m: 72,
    relative_humidity_2m: 65,
    apparent_temperature: 74,
    precipitation: 0,
    weather_code: 0,
    wind_speed_10m: 8,
    wind_direction_10m: 180,
    wind_gusts_10m: 12,
    uv_index: 5,
    visibility: 10000,
    pressure_msl: 1013.25,
    dew_point_2m: 60,
    cloud_cover: 25,
    rain: 0,
    showers: 0,
    snowfall: 0,
    snow_depth: 0
  },
  hourly: {
    time: Array.from({length: 24}, (_, i) => {
      const date = new Date('2025-01-15T00:00:00.000Z')
      date.setHours(i)
      return date.toISOString()
    }),
    temperature_2m: Array.from({length: 24}, (_, i) => 65 + i * 0.5),
    apparent_temperature: Array.from({length: 24}, (_, i) => 67 + i * 0.5),
    precipitation_probability: Array.from({length: 24}, () => 10),
    weather_code: Array.from({length: 24}, () => 0),
    wind_speed_10m: Array.from({length: 24}, () => 8)
  },
  daily: {
    time: Array.from({length: 10}, (_, i) => {
      const date = new Date('2025-01-15')
      date.setDate(date.getDate() + i)
      return date.toISOString().split('T')[0]
    }),
    weather_code: Array.from({length: 10}, () => 0),
    temperature_2m_max: Array.from({length: 10}, () => 75),
    temperature_2m_min: Array.from({length: 10}, () => 55),
    apparent_temperature_max: Array.from({length: 10}, () => 77),
    apparent_temperature_min: Array.from({length: 10}, () => 53),
    precipitation_probability_max: Array.from({length: 10}, () => 10),
    sunrise: Array.from({length: 10}, (_, i) => {
      const date = new Date('2025-01-15T07:00:00.000Z')
      date.setDate(date.getDate() + i)
      return date.toISOString()
    }),
    sunset: Array.from({length: 10}, (_, i) => {
      const date = new Date('2025-01-15T17:30:00.000Z')
      date.setDate(date.getDate() + i)
      return date.toISOString()
    }),
    uv_index_max: Array.from({length: 10}, () => 5)
  }
}

/**
 * Mock location for testing
 */
export const mockLocation: Location = {
  id: 1,
  name: 'Enterprise',
  latitude: 31.3115,
  longitude: -85.855,
  admin1: 'Alabama',
  country: 'United States',
  display: 'Enterprise, Alabama, United States'
}

/**
 * Mock geocoding response for testing
 */
export const mockGeocodeResponse: OpenMeteoGeocodeResponse = {
  results: [
    {
      id: 1,
      name: 'Enterprise',
      latitude: 31.3115,
      longitude: -85.855,
      admin1: 'Alabama',
      country: 'United States',
      feature_code: 'PPL',
      country_code: 'US'
    },
    {
      id: 2,
      name: 'Enterprise',
      latitude: 38.4037,
      longitude: -121.3708,
      admin1: 'California',
      country: 'United States',
      feature_code: 'PPL',
      country_code: 'US'
    }
  ],
  generationtime_ms: 0.5
}

/**
 * Mock air quality data for testing
 */
export const mockAirQualityResponse = {
  latitude: 31.3115,
  longitude: -85.855,
  current: {
    time: '2025-01-15T12:00:00.000Z',
    us_aqi: 42,
    pm10: 15.5,
    pm2_5: 8.2
  }
}
