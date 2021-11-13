/**
 * Weather data from The National Weather Service.
 *
 * @example
 * /api/weather?lat=28.3802&lng=-81.5612
 *
 * @author Greg Rickaby
 * @see https://weather-gov.github.io/api/general-faqs
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function weather(req, res) {
  // Destructure the request.
  const { lat, lng } = req.query;

  try {
    // NWS requires two requests.
    // The first request is to get the forecast point based on geocoding.
    const requestOne = await fetch(
      `https://api.weather.gov/points/${lat},${lng}`
    );
    const point = await requestOne.json();

    // The second request is to get the actual forecast.
    const requestTwo = await fetch(point.properties.forecast);
    const forecast = await requestTwo.json();

    // Third request is to get the alerts.
    const requestThree = await fetch(
      `https://api.weather.gov/alerts/active?status=actual&message_type=alert&point=${lat},${lng}`
    );
    const alerts = await requestThree.json();

    // Four request is to get the local weather office.
    const requestFour = await fetch(point.properties.forecastOffice);
    const station = await requestFour.json();

    // Send the response.
    res.status(200).json({
      alerts,
      forecast,
      location: point?.properties,
      station,
    });
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(500).json({ message: `${error}` });
  }
}
