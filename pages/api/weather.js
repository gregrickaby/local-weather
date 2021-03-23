/**
 * An API route to fetch the weather forecast.
 *
 * Thefrontend app, will post a JSON formated
 * request to `/api/weather` and this handler
 * will return weather data.
 *
 * Used specificly to get around CORS issues
 * when using fetch() in the browser.
 *
 * @author Greg Rickaby
 * @see https://darksky.net/dev
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function handler(req, res) {
  // Convert the request to an object.
  const coordinates = JSON.parse(req.body);

  try {
    // Attempt to fetch the weather.
    const response = await fetch(
      `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${coordinates.lat},${coordinates.long}`
    );

    // Convert response to JSON.
    const data = await response.json();

    // Send the response to the user.
    res.status(200).json(data);
  } catch (error) {
    // Problem? Leave a message and bail.
    res.status(404).json({ message: `${error}` });
  }
}
