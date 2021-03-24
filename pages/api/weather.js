/**
 * The weather forecast from DarkSky.
 *
 * @example
 * /api/weather?lat=28.3802&lng=-81.5612
 *
 * @author Greg Rickaby
 * @see https://darksky.net/dev
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
    // Attempt to fetch.
    const response = await fetch(
      `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${lat},${lng}`
    );

    // Convert response to JSON.
    const data = await response.json();

    // Send the response to the user.
    res.status(200).json(data);
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(500).json({ message: `${error}` });
  }
}
