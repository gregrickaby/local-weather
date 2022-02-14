import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Predict the city via Google's Places Autocomplete API.
 *
 * @example
 * /api/places?location="bay lake, fl"
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/places/web-service/autocomplete
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function places(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Destructure the request.
  const {location} = req.query

  // No location? Bail...
  if (!location) {
    res
      .status(400)
      .json({error: 'Cannot locate city and state without a location query.'})
    return
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&components=country:us&types=(cities)&language=en&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    // If the response is "OK", continue.
    if (data.status === 'OK') {
      // Build the list of locations.
      const locations = data?.predictions.map((prediction: any) => {
        return prediction?.description.replace(', USA', '')
      })

      // Return the predictions.
      res.status(200).json(locations)

      // Otherwise, return an error.
    } else {
      res.status(500).json({
        status: `${data?.status}`,
        message: `${data?.error_message}`
      })
    }
  } catch (error) {
    // Other issue? Leave a message and bail.
    res.status(500).json({message: `${error}`})
  }
}
