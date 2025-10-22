import {AirQualityResponse} from '@/lib/types'

export interface GeocodeResponse {
  status: string
  results: [
    {
      geometry: {
        location: {
          lat: number
          lng: number
        }
      }
    }
  ]
}

/**
 * Fetch air quality data from the Open-Meteo Air Quality API.
 *
 * @example
 * /api/air-quality?location="enterprise al"
 *
 * @author Greg Rickaby
 * @see https://open-meteo.com/en/docs/air-quality-api
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export async function GET(request: Request) {
  // Get query params from request.
  const {searchParams} = new URL(request.url)

  // Parse params.
  const unsanitizedLocation = searchParams.get('location') || ''

  // Sanitize the location.
  const location = encodeURI(unsanitizedLocation)

  // No location? Bail...
  if (!location) {
    return new Response(JSON.stringify({error: 'No location provided.'}), {
      status: 400,
      statusText: 'Bad Request'
    })
  }

  // Set default coordinates as fallback.
  let lat = 28.3886186
  let lon = -81.5659069

  try {
    // First, try to geocode the address.
    const geocode = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )

    // Issue with the geocode request? Bail...
    if (geocode.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `${geocode.statusText}`
        }),
        {
          status: geocode.status,
          statusText: geocode.statusText
        }
      )
    }

    // Parse the response.
    const coordinates = (await geocode.json()) as GeocodeResponse

    // Issue with the response? Bail...
    if (coordinates.status !== 'OK' || !coordinates.results.length) {
      return new Response(
        JSON.stringify({
          error: `${coordinates.status}`
        }),
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }

    // Pluck out and set the coordinates.
    lat = coordinates?.results[0]?.geometry?.location?.lat
    lon = coordinates?.results[0]?.geometry?.location?.lng
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({error: `${error}`}), {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }

  try {
    // Now, fetch the air quality data from Open-Meteo.
    const airQuality = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,european_aqi&timezone=auto`
    )

    // Issue with the air quality response? Bail...
    if (airQuality.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `${airQuality.statusText}`
        }),
        {
          status: airQuality.status,
          statusText: airQuality.statusText
        }
      )
    }

    // Parse the response.
    const data = (await airQuality.json()) as AirQualityResponse

    // Issue with the data? Bail...
    if (!data.latitude || !data.longitude) {
      return new Response(
        JSON.stringify({
          error: 'No air quality data.'
        }),
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }

    // Return the air quality data.
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=600, stale-while-revalidate'
      },
      status: 200,
      statusText: 'OK'
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({error: `${error}`}), {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
