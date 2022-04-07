import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Predict the city via Google's Places Autocomplete API.
 *
 * @example
 * /api/places?location="enterprise, al"
 *
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/places/web-service/autocomplete
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 */
export default async function places(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // No location? Bail...
  if (!req.query.location) {
    return res
      .status(400)
      .json({message: 'Cannot locate city and state without a location query.'})
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req?.query?.location}&types=(cities)&language=en&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    // If the response is "OK", continue.
    if (data.status === 'OK') {
      // Build the list of locations.
      const locations = data?.predictions?.map(
        (prediction: Record<string, string>) => {
          return prediction?.description
        }
      )

      // Return the predictions.
      return res.status(200).json(locations)

      // Otherwise, return a message.
    } else {
      return res.status(500).json({message: data?.status})
    }
  } catch (error) {
    // Other issue? Leave a message and bail.
    return res.status(500).json({message: error})
  }
}
