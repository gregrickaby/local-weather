import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterAll, afterEach, beforeAll, vi} from 'vitest'
import {mockWeatherResponse} from './test-utils/mocks/mockData'
import {server} from './test-utils/msw/server'

// Helper functions to reduce nesting in openmeteo mock
const createCurrentVariables = (index: number) => {
  const values = [
    mockWeatherResponse.current.temperature_2m,
    mockWeatherResponse.current.relative_humidity_2m,
    mockWeatherResponse.current.apparent_temperature,
    mockWeatherResponse.current.precipitation,
    mockWeatherResponse.current.weather_code,
    mockWeatherResponse.current.wind_speed_10m,
    mockWeatherResponse.current.wind_direction_10m,
    mockWeatherResponse.current.wind_gusts_10m,
    mockWeatherResponse.current.uv_index,
    mockWeatherResponse.current.visibility,
    mockWeatherResponse.current.pressure_msl,
    mockWeatherResponse.current.dew_point_2m,
    mockWeatherResponse.current.cloud_cover,
    mockWeatherResponse.current.rain,
    mockWeatherResponse.current.showers,
    mockWeatherResponse.current.snowfall,
    mockWeatherResponse.current.snow_depth
  ]
  return {value: () => values[index]}
}

const createHourlyVariables = (index: number) => {
  const arrays = [
    mockWeatherResponse.hourly.temperature_2m,
    mockWeatherResponse.hourly.apparent_temperature,
    mockWeatherResponse.hourly.precipitation_probability,
    mockWeatherResponse.hourly.weather_code,
    mockWeatherResponse.hourly.wind_speed_10m
  ]
  return {valuesArray: () => new Float32Array(arrays[index])}
}

const createDailyVariables = (index: number) => {
  const sunriseTimestamps = mockWeatherResponse.daily.sunrise.map(
    (t) => new Date(t).getTime() / 1000
  )
  const sunsetTimestamps = mockWeatherResponse.daily.sunset.map(
    (t) => new Date(t).getTime() / 1000
  )
  const arrays = [
    mockWeatherResponse.daily.weather_code,
    mockWeatherResponse.daily.temperature_2m_max,
    mockWeatherResponse.daily.temperature_2m_min,
    mockWeatherResponse.daily.apparent_temperature_max,
    mockWeatherResponse.daily.apparent_temperature_min,
    mockWeatherResponse.daily.precipitation_probability_max,
    sunriseTimestamps,
    sunsetTimestamps,
    mockWeatherResponse.daily.uv_index_max
  ]
  return {valuesArray: () => new Float32Array(arrays[index])}
}

// Mock openmeteo SDK
vi.mock('openmeteo', () => ({
  fetchWeatherApi: vi.fn(async () => {
    // Return mock data in the expected SDK format
    return [
      {
        latitude: () => mockWeatherResponse.latitude,
        longitude: () => mockWeatherResponse.longitude,
        timezone: () => mockWeatherResponse.timezone,
        utcOffsetSeconds: () => 0,
        current: () => ({
          time: () =>
            new Date(mockWeatherResponse.current.time).getTime() / 1000,
          variables: createCurrentVariables
        }),
        hourly: () => ({
          time: () =>
            new Date(mockWeatherResponse.hourly.time[0]).getTime() / 1000,
          timeEnd: () =>
            new Date(mockWeatherResponse.hourly.time.at(-1)!).getTime() / 1000,
          interval: () => 3600,
          variables: createHourlyVariables
        }),
        daily: () => ({
          time: () =>
            new Date(mockWeatherResponse.daily.time[0]).getTime() / 1000,
          timeEnd: () =>
            new Date(mockWeatherResponse.daily.time.at(-1)!).getTime() / 1000,
          interval: () => 86400,
          variables: createDailyVariables
        })
      }
    ]
  })
}))

// Establish API mocking before all tests (for placesApi)
beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))

// Reset any request handlers that we may add during tests
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Clean up after tests are finished
afterAll(() => server.close())

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn()
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  }
}))

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock ResizeObserver (required by Mantine)
globalThis.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
