import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Geocode the address into latitude and longitude coordinates.
 *
 * @example
 * /api/geocoding?address="orlando,+fl"
 *
 * Note: In Google Cloud Platform --> Credentials, you must set
 * application restrictions to "None" and then "Restrict key" to "Geocoding".
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/geocoding/overview
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
  const {city} = req.query

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${city}&types=(cities)&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    // If the response is "OK", continue.
    if (data.status === 'OK') {
      // Return the predictions.
      res.status(200).json(data)

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
