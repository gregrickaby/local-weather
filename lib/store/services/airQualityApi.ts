import type {AirQualityResponse} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

/**
 * RTK Query API for air quality data.
 */
export const airQualityApi = createApi({
  reducerPath: 'airQualityApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['AirQuality'],
  endpoints: (builder) => ({
    getAirQuality: builder.query<AirQualityResponse, string | undefined>({
      query: (location) => {
        const params = new URLSearchParams()
        if (location) {
          params.append('location', location)
        }
        return `/air-quality?${params.toString()}`
      },
      providesTags: ['AirQuality']
    })
  })
})

export const {useGetAirQualityQuery} = airQualityApi
