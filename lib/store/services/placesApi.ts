import type {Location} from '@/lib/types'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

/**
 * RTK Query API for places autocomplete.
 *
 * Returns location objects with coordinates.
 *
 * @see https://redux-toolkit.js.org/rtk-query/overview
 */
export const placesApi = createApi({
  reducerPath: 'placesApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Places'],
  endpoints: (builder) => ({
    getPlaces: builder.query<Location[], string>({
      query: (location) => `/places?location=${encodeURIComponent(location)}`,
      providesTags: ['Places'],
      keepUnusedDataFor: 60 // 1 minute cache
    })
  })
})

export const {useGetPlacesQuery} = placesApi
