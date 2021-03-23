/**
 * An API route to reverse geocode the coordinates.
 *
 * The frontend app, will post a JSON formated
 * request to `/api/geocoding` and this handler
 * will return the city, state, zip, etc...
 *
 * @author Greg Rickaby
 * @see https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding
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
    // Attempt to fetch the city.
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.long}&key=${process.env.GOOGLE_MAPS_API_KEY}`
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
