import Head from "next/head";
import { useState, useEffect } from "react";
import { useWeather } from "../lib/swr-hooks";
import Link from "next/link";
import dayjs from "dayjs";

/**
 * The Homepage component.
 *
 * @author Greg Rickaby
 * @returns {Element} The Homepage component.
 */
export default function Home() {
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    lng: -81.5612,
  });
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearch] = useState("Bay Lake, FL");
  const { weather, isLoading } = useWeather(loading, coordinates);

  // The location returned from NWS API all prettied up.
  const nwsLocation = `${weather?.location?.relativeLocation?.properties?.city}, ${weather?.location?.relativeLocation?.properties?.state}`;

  /**
   * Fetch user's coordinates.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  function getUsersPostion() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoordinates({
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude,
        }),
      (err) => {
        console.warn(`There was a problem getting your location ${err}`);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
    setLoading(false);
  }

  /**
   * Convert city and state into lat/lng coordinates.
   */
  async function getCoordinates(search) {
    setLoading(true);
    const response = await fetch(
      `/api/geocoding?address=${JSON.stringify(search)}`
    );
    const coordinates = await response.json();
    setCoordinates(coordinates);
    setLoading(false);
  }

  /**
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setSearch(searchValue);
    getCoordinates(searchValue);
  }

  /**
   * Attempt to get the user's location
   * on initial page load.
   */
  useEffect(() => {
    getUsersPostion();
  }, []);

  // When the user searches, update the
  // location with data from NWS.
  useEffect(() => {
    if (!isLoading) setSearch(nwsLocation);
  }, [weather]);

  return (
    <>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.weather.gov/" />
      </Head>

      <header className="flex items-center space-x-2">
        <img src="logo.webp" alt="" height="32" width="32" loading="eager" />
        <h1>Weather</h1>
      </header>

      <form onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="search">
          Enter your location
        </label>
        <div className="grid grid-cols-12 gap-2">
          <input
            className=" px-3 py-2 col-span-8 text-xl border border-zinc-500 rounded-md"
            id="search"
            minLength="4"
            onChange={(e) => setSearch(e.target.value)}
            pattern="^[^~`^<>]+$"
            placeholder="Bay Lake, FL"
            type="text"
            value={searchValue}
          />
          <button className="col-span-4 button">Search</button>
        </div>
      </form>

      <main>
        <>
          {loading || isLoading ? (
            <p>Loading forecast...</p>
          ) : (
            <>
              <p className="my-4">
                As of{" "}
                <time className="font-bold">
                  {dayjs(weather?.properties?.updated).format(
                    "MMMM D, YYYY @ h:mm A"
                  )}
                </time>{" "}
                from{" "}
                <a
                  href="https://www.weather.gov/"
                  className="dark:text-zinc-300"
                >
                  National Weather Service
                </a>{" "}
                office in {weather?.station?.name}.
              </p>
              <h2>Alerts</h2>
              {weather?.alerts?.features.length >= 1 ? (
                weather?.alerts?.features?.map((alert, index) => (
                  <div key={index}>
                    <p className="text-red-500">
                      {alert?.properties?.headline}
                    </p>
                    <p>{alert?.properties?.description}</p>
                    <p>{alert?.properties?.instruction}</p>
                  </div>
                ))
              ) : (
                <p>No active weather alerts.</p>
              )}
              <h2>Forecast for {nwsLocation}</h2>
              <p>
                <code>
                  {coordinates?.lat},{coordinates?.lng}
                </code>{" "}
                @{" "}
                <code>
                  {Math.round(
                    weather?.forecast?.properties?.elevation?.value * 3.2808
                  )}{" "}
                  feet
                </code>
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {weather.forecast?.properties?.periods.map((period, index) => (
                  <div key={index} className="p-4 bg-zinc-300 dark:bg-zinc-800">
                    <div>
                      <h2>{period.name}</h2>
                      <img
                        alt={period.name}
                        height="86"
                        loading="lazy"
                        src={period.icon}
                        width="86"
                      />
                    </div>
                    <div>
                      <p>
                        {period?.isDaytime ? <>High</> : <>Low</>}{" "}
                        {period?.temperature}° {period?.temperatureUnit}
                      </p>
                      <p>
                        Wind {period?.windDirection} at {period?.windSpeed}
                      </p>
                      <p>{period?.detailedForecast}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h2>Radar</h2>
              <img
                alt={`Radar image loop of ${nwsLocation}`}
                className="radar"
                height="550"
                loading="lazy"
                src={`https://radar.weather.gov/ridge/lite/${weather?.location?.radarStation}_loop.gif`}
                width="600"
              />
              <footer className="my-16 text-center">
                <Link href="/">
                  <a className="button">Back to Top</a>
                </Link>
              </footer>
            </>
          )}
        </>
      </main>
    </>
  );
}
