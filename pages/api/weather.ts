import type {NextApiRequest, NextApiResponse} from 'next'

/**
 * Fetch weather data from the OpenWeather API.
 *
 * @example
 * /api/weather?location="enterprise al"
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
  // Set default coordinates as fallback.
  let lat = 28.3886186
  let lon = -81.5659069

  // No address? Bail...
  if (!req.query.location) {
    return res.status(400).json({
      message: 'Cannot fetch weather information without a location query.'
    })
  }

  // First, try to geocode the address.
  try {
    const geocode = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${req?.query?.location}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const coordinates = await geocode.json()

    // If the response is "OK", continue.
    if (coordinates.status === 'OK') {
      // Pluck out the coordinates.
      lat = coordinates?.results[0]?.geometry?.location?.lat
      lon = coordinates?.results[0]?.geometry?.location?.lng

      // Otherwise, return an error.
    } else {
      return res.status(500).json({message: coordinates?.status})
    }
  } catch (error) {
    // Other issue? Leave a message and bail.
    return res.status(500).json({message: error})
  }

  // Now, fetch the weather data.
  try {
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${process.env.OPENWEATHER_API_KEY}`
    )
    const forecast = await weather.json()

    // If there's a forecast, return it.
    if (Object.keys(forecast).length) {
      return res.status(200).json(forecast)

      // Otherwise, return an error.
    } else {
      return res.status(500).json({message: 'Cannot fetch weather data.'})
    }
  } catch (error) {
    // Other issue? Leave a message and bail.
    return res.status(500).json({message: error})
  }
}
