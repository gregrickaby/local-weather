import {OpenMeteoResponse} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface WeatherQueryParams {
  location: string
  tempUnit: 'c' | 'f'
}

/**
 * RTK Query API for weather data.
 *
 * @see https://redux-toolkit.js.org/rtk-query/overview
 */
export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getWeather: builder.query<OpenMeteoResponse, WeatherQueryParams>({
      query: ({location, tempUnit}) =>
        `/weather?location=${encodeURIComponent(location)}&tempUnit=${tempUnit}`,
      providesTags: ['Weather'],
      keepUnusedDataFor: 300 // 5 minutes cache
    })
  })
})

export const {useGetWeatherQuery} = weatherApi
