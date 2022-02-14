import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Fetch weather data from the National Weather Service.
 *
 * @example
 * /api/weather?location=bay lake,+fl
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/geocoding/overview
 * @see https://weather-gov.github.io/api/general-faqs
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function weather(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Destructure the request.
  const {location} = req.query

  // Set default coordinates as fallback.
  let lat: number = 28.3886186
  let lng: number = -81.5659069

  // No address? Bail...
  if (!location) {
    res.status(400).json({
      error: 'Cannot fetch weather information without a location query.'
    })
    return
  }

  try {
    const geocode = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const coordinates = await geocode.json()

    // If the response is "OK", continue.
    if (coordinates.status === 'OK') {
      // Pluck out the coordinates.
      lat = coordinates?.results[0]?.geometry?.location?.lat
      lng = coordinates?.results[0]?.geometry?.location?.lng

      // Otherwise, return an error.
    } else {
      res.status(500).json({
        status: `${coordinates?.status}`,
        message: `${coordinates?.error_message}`
      })
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }

  try {
    // NWS requires two requests.
    // The first request is to get the forecast point based on geocoding.
    const requestOne = await fetch(
      `https://api.weather.gov/points/${lat},${lng}`
    )
    const point = await requestOne.json()

    // The second request is to get the actual forecast.
    const requestTwo = await fetch(point.properties.forecast)
    const forecast = await requestTwo.json()

    // Third request is to get the alerts.
    const requestThree = await fetch(
      `https://api.weather.gov/alerts/active?status=actual&message_type=alert&point=${lat},${lng}`
    )
    const alerts = await requestThree.json()

    // Four request is to get the local weather office.
    const requestFour = await fetch(point.properties.forecastOffice)
    const station = await requestFour.json()

    // Send the response.
    res.status(200).json({
      alerts: alerts?.features,
      coordinates: {lat, lng},
      forecast: forecast?.properties?.periods,
      location: {
        city: point?.properties?.relativeLocation?.properties?.city,
        state: point?.properties?.relativeLocation?.properties?.state
      },
      radar: point?.properties?.radarStation,
      station: station?.name,
      updated: forecast?.properties?.updated
    })
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(500).json({message: `${error}`})
  }
}
