import type {OpenMeteoResponse} from '@/lib/types'
import {range} from '@/lib/utils/calculations'
import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react'
import {fetchWeatherApi} from 'openmeteo'

interface WeatherQueryParams {
  latitude: number
  longitude: number
  tempUnit: 'c' | 'f'
}

/**
 * RTK Query API for weather data using Open-Meteo SDK.
 *
 * Fetches weather data directly from Open-Meteo API using FlatBuffers for efficiency.
 *
 * @see https://redux-toolkit.js.org/rtk-query/overview
 * @see https://open-meteo.com/en/docs
 */
export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getWeather: builder.query<OpenMeteoResponse, WeatherQueryParams>({
      queryFn: async ({latitude, longitude, tempUnit}) => {
        try {
          const params = {
            latitude,
            longitude,
            current: [
              'temperature_2m',
              'relative_humidity_2m',
              'apparent_temperature',
              'precipitation',
              'weather_code',
              'wind_speed_10m',
              'wind_direction_10m',
              'wind_gusts_10m',
              'uv_index',
              'visibility',
              'pressure_msl',
              'dew_point_2m'
            ],
            hourly: [
              'temperature_2m',
              'apparent_temperature',
              'precipitation_probability',
              'weather_code',
              'wind_speed_10m'
            ],
            daily: [
              'weather_code',
              'temperature_2m_max',
              'temperature_2m_min',
              'apparent_temperature_max',
              'apparent_temperature_min',
              'precipitation_probability_max',
              'sunrise',
              'sunset',
              'uv_index_max'
            ],
            temperature_unit: tempUnit === 'c' ? 'celsius' : 'fahrenheit',
            wind_speed_unit: 'mph',
            precipitation_unit: 'inch',
            timezone: 'auto',
            forecast_days: 10
          }

          const url = 'https://api.open-meteo.com/v1/forecast'
          const responses = await fetchWeatherApi(url, params)

          // Fetch sunrise/sunset separately using JSON API (SDK doesn't support it)
          const sunriseSunsetParams = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            daily: 'sunrise,sunset',
            timezone: 'auto',
            forecast_days: '10'
          })
          const sunriseSunsetResponse = await fetch(
            `${url}?${sunriseSunsetParams}`
          )
          const sunriseSunsetData = await sunriseSunsetResponse.json()

          if (!responses || responses.length === 0) {
            throw new Error('No response from Open-Meteo API')
          }

          const response = responses[0]

          // Get timezone and location info
          const utcOffsetSeconds = response.utcOffsetSeconds()
          const timezone = response.timezone()
          const current = response.current()
          const hourly = response.hourly()
          const daily = response.daily()

          if (!current || !hourly || !daily) {
            throw new Error('Missing required data sections in API response')
          }

          // Transform SDK response to match our existing type structure
          const data: OpenMeteoResponse = {
            latitude: response.latitude(),
            longitude: response.longitude(),
            timezone: timezone || 'UTC',
            current: {
              time: new Date(
                (Number(current.time()) + utcOffsetSeconds) * 1000
              ).toISOString(),
              temperature_2m: current.variables(0)?.value() ?? 0,
              relative_humidity_2m: current.variables(1)?.value() ?? 0,
              apparent_temperature: current.variables(2)?.value() ?? 0,
              precipitation: current.variables(3)?.value() ?? 0,
              weather_code: current.variables(4)?.value() ?? 0,
              wind_speed_10m: current.variables(5)?.value() ?? 0,
              wind_direction_10m: current.variables(6)?.value() ?? 0,
              wind_gusts_10m: current.variables(7)?.value() ?? 0,
              uv_index: current.variables(8)?.value() ?? 0,
              visibility: current.variables(9)?.value() ?? 0,
              pressure_msl: current.variables(10)?.value() ?? 0,
              dew_point_2m: current.variables(11)?.value() ?? 0
            },
            hourly: {
              time: range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
              ).map((t) =>
                new Date((t + utcOffsetSeconds) * 1000).toISOString()
              ),
              temperature_2m: Array.from(
                hourly.variables(0)?.valuesArray() ?? []
              ),
              apparent_temperature: Array.from(
                hourly.variables(1)?.valuesArray() ?? []
              ),
              precipitation_probability: Array.from(
                hourly.variables(2)?.valuesArray() ?? []
              ),
              weather_code: Array.from(
                hourly.variables(3)?.valuesArray() ?? []
              ),
              wind_speed_10m: Array.from(
                hourly.variables(4)?.valuesArray() ?? []
              )
            },
            daily: {
              time: range(
                Number(daily.time()),
                Number(daily.timeEnd()),
                daily.interval()
              ).map(
                (t) =>
                  new Date((t + utcOffsetSeconds) * 1000)
                    .toISOString()
                    .split('T')[0]
              ),
              weather_code: Array.from(daily.variables(0)?.valuesArray() ?? []),
              temperature_2m_max: Array.from(
                daily.variables(1)?.valuesArray() ?? []
              ),
              temperature_2m_min: Array.from(
                daily.variables(2)?.valuesArray() ?? []
              ),
              apparent_temperature_max: Array.from(
                daily.variables(3)?.valuesArray() ?? []
              ),
              apparent_temperature_min: Array.from(
                daily.variables(4)?.valuesArray() ?? []
              ),
              precipitation_probability_max: Array.from(
                daily.variables(5)?.valuesArray() ?? []
              ),
              sunrise:
                sunriseSunsetData?.daily?.sunrise?.map((time: string) => {
                  // API returns ISO strings like "2025-10-26T07:28"
                  // Add seconds and Z to make them full ISO strings
                  return `${time}:00.000Z`
                }) ?? [],
              sunset:
                sunriseSunsetData?.daily?.sunset?.map((time: string) => {
                  // API returns ISO strings like "2025-10-26T17:40"
                  // Add seconds and Z to make them full ISO strings
                  return `${time}:00.000Z`
                }) ?? [],
              uv_index_max: Array.from(daily.variables(8)?.valuesArray() ?? [])
            }
          }

          return {data}
        } catch (error) {
          console.error('[weatherApi] Error:', error)
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: String(error)
            }
          }
        }
      },
      providesTags: ['Weather'],
      keepUnusedDataFor: 300 // 5 minutes cache
    })
  })
})

export const {useGetWeatherQuery} = weatherApi
