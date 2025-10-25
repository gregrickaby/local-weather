import type {AirQualityResponse, Location} from '@/lib/types'
import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react'
import {fetchWeatherApi} from 'openmeteo'

/**
 * RTK Query API for air quality data using Open-Meteo SDK.
 *
 * Fetches air quality data directly from Open-Meteo Air Quality API.
 *
 * @see https://open-meteo.com/en/docs/air-quality-api
 */
export const airQualityApi = createApi({
  reducerPath: 'airQualityApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AirQuality'],
  endpoints: (builder) => ({
    getAirQuality: builder.query<AirQualityResponse, Location | undefined>({
      queryFn: async (location) => {
        if (!location) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Location is required'
            }
          }
        }

        try {
          const params = {
            latitude: location.latitude,
            longitude: location.longitude,
            current: ['us_aqi', 'pm2_5', 'pm10', 'european_aqi']
          }

          const url = 'https://air-quality-api.open-meteo.com/v1/air-quality'
          const responses = await fetchWeatherApi(url, params)
          const response = responses[0]

          const utcOffsetSeconds = response.utcOffsetSeconds()
          const timezone = response.timezone()
          const current = response.current()

          if (!current) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Missing current data in air quality response'
              }
            }
          }

          const data: AirQualityResponse = {
            latitude: response.latitude(),
            longitude: response.longitude(),
            timezone: timezone || 'UTC',
            current: {
              time: new Date(
                (Number(current.time()) + utcOffsetSeconds) * 1000
              ).toISOString(),
              us_aqi: current.variables(0)?.value() ?? 0,
              pm2_5: current.variables(1)?.value() ?? 0,
              pm10: current.variables(2)?.value() ?? 0,
              european_aqi: current.variables(3)?.value() ?? 0
            }
          }

          return {data}
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: String(error)
            }
          }
        }
      },
      providesTags: ['AirQuality'],
      keepUnusedDataFor: 600 // 10 minutes
    })
  })
})

export const {useGetAirQualityQuery} = airQualityApi
