/**
 * Geocode the address into latitude and longitude coordinates.
 *
 * @example
 * /api/geocoding?address="orlando,+fl"
 *
 * @author Greg Rickaby
 * @see https://developers.google.com/maps/documentation/geocoding/overview
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function geocoding(req, res) {
  // Destructure the request.
  const { address } = req.query;

  try {
    // Attempt to fetch.
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    // Convert response to JSON.
    const data = await response.json();

    // Pluck out the coordinates.
    const coordinates = JSON.stringify(data?.results[0]?.geometry?.location);

    // Send the response to the user.
    res.status(200).json(coordinates);
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(404).json({ message: `${error}` });
  }
}
