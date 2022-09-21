import type {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge'
}

export interface PredictionResponse {
  description: string
}

export interface Place {
  predictions: PredictionResponse[]
  status: string
}

/**
 * Predict the location via Google's Places Autocomplete API.
 *
 * @example
 * /api/places?location="enterprise, al"
 *
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/places/web-service/autocomplete
 * @see https://nextjs.org/docs/api-routes/edge-api-routes
 * @see https://nextjs.org/docs/api-reference/edge-runtime
 */
export default async function places(req: NextRequest) {
  // Get the location from the query string.
  const location = new URL(req.url).searchParams.get('location')

  // No location? Bail...
  if (!location) {
    return new Response(JSON.stringify({error: 'No location provided.'}), {
      status: 400,
      statusText: 'Bad Request'
    })
  }

  try {
    // Attempt to fetch the city from Google's Places API.
    const places = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&types=(cities)&language=en&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )

    // Issue with the places response? Bail...
    if (places.status != 200) {
      return new Response(
        JSON.stringify({
          error: `${places.statusText}`
        }),
        {
          status: places.status,
          statusText: places.statusText
        }
      )
    }

    // Parse the response.
    const place = (await places.json()) as Place

    // Issue with the response? Bail...
    if (place.status != 'OK' || !place.predictions.length) {
      return new Response(
        JSON.stringify({
          error: place.status
        }),
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }

    // Build the list of locations.
    const locations = place.predictions.map(
      (prediction: PredictionResponse) => prediction.description
    ) as string[]

    // Return the list of locations.
    return new Response(JSON.stringify(locations), {
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
