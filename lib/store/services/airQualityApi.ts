import type {AirQualityResponse, Location} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

/**
 * RTK Query API for air quality data.
 *
 * Uses coordinates directly for accurate air quality data.
 */
export const airQualityApi = createApi({
  reducerPath: 'airQualityApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['AirQuality'],
  endpoints: (builder) => ({
    getAirQuality: builder.query<AirQualityResponse, Location | undefined>({
      query: (location) => {
        if (!location) {
          return ''
        }
        const params = new URLSearchParams()
        params.append('latitude', location.latitude.toString())
        params.append('longitude', location.longitude.toString())
        return `/air-quality?${params.toString()}`
      },
      providesTags: ['AirQuality'],
      keepUnusedDataFor: 600 // 10 minutes
    })
  })
})

export const {useGetAirQualityQuery} = airQualityApi
