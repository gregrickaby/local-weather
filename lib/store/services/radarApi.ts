import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface RadarFrame {
  path: string
  time: number
}

interface RainViewerResponse {
  radar: {
    past: RadarFrame[]
    nowcast: RadarFrame[]
  }
  host: string
}

/**
 * RTK Query API for RainViewer radar data.
 *
 * Fetches radar frame metadata from RainViewer API.
 *
 * @see https://www.rainviewer.com/api.html
 */
export const radarApi = createApi({
  reducerPath: 'radarApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.rainviewer.com/public'
  }),
  tagTypes: ['Radar'],
  endpoints: (builder) => ({
    getRadarFrames: builder.query<string[], void>({
      query: () => '/weather-maps.json',
      transformResponse: (response: RainViewerResponse) => {
        if (!response.radar?.past) {
          return []
        }
        return response.radar.past.map(
          (frame) =>
            `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/4/1_1.png`
        )
      },
      providesTags: ['Radar'],
      keepUnusedDataFor: 600 // 10 minutes cache
    })
  })
})

export const {useGetRadarFramesQuery} = radarApi
