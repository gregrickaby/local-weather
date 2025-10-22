import {OpenMeteoResponse} from '@/lib/types'

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
 * Fetch weather data from the Open-Meteo API.
 *
 * @example
 * /api/weather?location="enterprise al"
 *
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/geocoding/overview
 * @see https://open-meteo.com/en/docs
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 * @see https://nextjs.org/docs/pages/api-reference/edge
 */
export async function GET(request: Request) {
  // Get query params from request.
  const {searchParams} = new URL(request.url)

  // Parse params.
  const unsanitizedLocation = searchParams.get('location') || ''
  const tempUnit = searchParams.get('tempUnit') || 'f'

  // Sanitize the location.
  const location = encodeURI(unsanitizedLocation)

  // Determine temperature unit for API.
  const temperatureUnit = tempUnit === 'c' ? 'celsius' : 'fahrenheit'
  const windSpeedUnit = tempUnit === 'c' ? 'kmh' : 'mph'

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
    // Now, fetch the weather data from Open-Meteo.
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility,surface_pressure,dew_point_2m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,sunrise,sunset,uv_index_max&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=inch&forecast_days=10&timezone=auto`
    )

    // Issue with the weather response? Bail...
    if (weather.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `${weather.statusText}`
        }),
        {
          status: weather.status,
          statusText: weather.statusText
        }
      )
    }

    // Parse the response.
    const forecast = (await weather.json()) as OpenMeteoResponse

    // Issue with the forecast? Bail...
    if (!forecast.latitude || !forecast.longitude) {
      return new Response(
        JSON.stringify({
          error: 'No forecast data.'
        }),
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }

    // Return the weather data.
    return new Response(JSON.stringify(forecast), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate'
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
