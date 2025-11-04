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
          // Try progressively simpler search terms if initial search returns no results
          const searchTerms = [
            location,
            // Remove extra words from the end (usually admin/country)
            location.split(' ').slice(0, -1).join(' '),
            // Keep only first 2-3 words (city name, maybe multi-word)
            location.split(' ').slice(0, 2).join(' '),
            // Keep only first word (city)
            location.split(' ')[0]
          ].filter((term) => term.length >= 2)

          // Remove duplicates
          const uniqueSearchTerms = [...new Set(searchTerms)]

          let locations: Location[] = []

          for (const searchTerm of uniqueSearchTerms) {
            const params = new URLSearchParams({
              name: searchTerm,
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

            if (json.results && json.results.length > 0) {
              // Transform to our Location type
              locations = json.results.map((result) => ({
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
              break // Success - use these results
            }
          }

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
    }),
    getLocationById: builder.query<Location, number>({
      queryFn: async (_locationId) => {
        try {
          // Open-Meteo doesn't have a direct "get by ID" endpoint
          // But we can use the search endpoint with specific coordinates
          // or rely on cached data. For now, we'll fetch and find by ID.
          // This is a limitation of the API - ideally we'd store locations locally.

          // Note: This is a workaround. Open-Meteo geocoding doesn't support ID lookup.
          // In production, you'd want to cache location data or use a different approach.
          throw new Error(
            'Open-Meteo API does not support direct ID lookup. Location must be resolved from search results.'
          )
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
      keepUnusedDataFor: 3600 // 1 hour cache for location data
    })
  })
})

export const {useGetPlacesQuery, useGetLocationByIdQuery} = placesApi
