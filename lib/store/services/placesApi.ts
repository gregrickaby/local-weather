import type {Location, OpenMeteoGeocodeResponse} from '@/lib/types'
import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react'

/**
 * RTK Query API for places/geocoding autocomplete using Open-Meteo Geocoding API.
 *
 * Fetches location suggestions directly from Open-Meteo Geocoding API.
 *
 * @see https://redux-toolkit.js.org/rtk-query/overview
 * @see https://open-meteo.com/en/docs/geocoding-api
 */
export const placesApi = createApi({
  reducerPath: 'placesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Places'],
  endpoints: (builder) => ({
    getPlaces: builder.query<Location[], string>({
      queryFn: async (location) => {
        if (!location || location.length < 2) {
          return {data: []}
        }

        try {
          const params = new URLSearchParams({
            name: location,
            count: '10',
            language: 'en',
            format: 'json'
          })

          const url = `https://geocoding-api.open-meteo.com/v1/search?${params}`
          const response = await fetch(url)

          if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.statusText}`)
          }

          const json: OpenMeteoGeocodeResponse = await response.json()

          if (!json.results || json.results.length === 0) {
            return {data: []}
          }

          // Transform to our Location type
          const locations: Location[] = json.results.map((result) => ({
            id: result.id,
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            admin1: result.admin1,
            country: result.country,
            display: [result.name, result.admin1, result.country]
              .filter(Boolean)
              .join(', ')
          }))

          return {data: locations}
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: String(error)
            }
          }
        }
      },
      providesTags: ['Places'],
      keepUnusedDataFor: 60 // 1 minute cache
    })
  })
})

export const {useGetPlacesQuery} = placesApi
