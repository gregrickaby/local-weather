import type {OpenMeteoResponse} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface WeatherQueryParams {
  latitude: number
  longitude: number
  tempUnit: 'c' | 'f'
}

/**
 * RTK Query API for weather data.
 *
 * Uses coordinates directly for accurate weather data.
 *
 * @see https://redux-toolkit.js.org/rtk-query/overview
 */
export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getWeather: builder.query<OpenMeteoResponse, WeatherQueryParams>({
      query: ({latitude, longitude, tempUnit}) =>
        `/weather?latitude=${latitude}&longitude=${longitude}&tempUnit=${tempUnit}`,
      providesTags: ['Weather'],
      keepUnusedDataFor: 300 // 5 minutes cache
    })
  })
})

export const {useGetWeatherQuery} = weatherApi
