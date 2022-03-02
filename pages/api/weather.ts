import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Fetch weather data from the OpenWeather API.
 *
 * @example
 * /api/weather?location=bay lake,+fl
 *
 * @author Greg Rickaby
 * @see https://console.cloud.google.com/apis/credentials
 * @see https://developers.google.com/maps/documentation/geocoding/overview
 * @see https://openweathermap.org/api/one-call-api
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 */
export default async function weather(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Destructure the request.
  const {location} = req.query

  // Set default coordinates as fallback.
  let lat: number = 28.3886186
  let lon: number = -81.5659069

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
      lon = coordinates?.results[0]?.geometry?.location?.lng

      // Otherwise, return an error.
    } else {
      res.status(500).json({
        status: `${coordinates?.status}`,
        message: `${coordinates?.error_message}`
      })
    }
  } catch (error) {
    res.status(500).json({message: `${error}`})
  }

  try {
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${process.env.OPENWEATHER_API_KEY}`
    )
    // Send the response.
    res.status(200).json(await weather.json())
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(500).json({message: `${error}`})
  }
}
