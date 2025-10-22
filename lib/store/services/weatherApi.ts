import {OpenMeteoResponse} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

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
    getWeather: builder.query<OpenMeteoResponse, string>({
      query: (location) => `/weather?location=${encodeURIComponent(location)}`,
      providesTags: ['Weather'],
      keepUnusedDataFor: 300 // 5 minutes cache
    })
  })
})

export const {useGetWeatherQuery} = weatherApi
