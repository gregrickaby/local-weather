/**
 * Reverse geocoding latitude and longitude coordinates.
 *
 * @example
 * /api/reversegeocoding?lat=28.3802&long=-81.5612
 *
 * @author Greg Rickaby
 * @see https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding
 * @see https://nextjs.org/docs/api-routes/introduction
 * @see https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @param {object} req The incoming request object.
 * @param {object} res The outgoing response object.
 */
export default async function reverseGeocoding(req, res) {
  // Destructure the request.
  const { lat, long } = req.query;

  try {
    // Attempt to fetch.
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    // Bail if there's an issue.
    if (!response.ok) {
      res.status(400).json({ message: `${response.statusText}` });
    }

    // Convert response to JSON.
    const data = await response.json();

    // Pluck out the address.
    const address = JSON.stringify(data.results[0].formatted_address);

    // Send the response to the user.
    res.status(200).json(address);
  } catch (error) {
    // Issue? Leave a message and bail.
    res.status(404).json({ message: `${error}` });
  }
}
