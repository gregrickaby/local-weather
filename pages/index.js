import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
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
  const [loading, setLoading] = useState();
  const [searchValue, setSearch] = useState("Bay Lake, FL");
  const { weather, isLoading } = useWeather(coordinates);
  const location = `${weather?.location?.relativeLocation?.properties?.city}, ${weather?.location?.relativeLocation?.properties?.state}`;

  /**
   * Fetch user's coordinates.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  function getLocation() {
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
   * Fetch the coordinates.
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
   * When the page loads intially, or if the
   * user clicks the "Local Forecast" button.
   */
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!isLoading) setSearch(location);
  }, [weather]);

  return (
    <>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.weather.gov/" />
      </Head>

      <header className={styles.header}>
        <h1>Weather</h1>
      </header>

      <form onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="search">
          Enter your location
        </label>
        <div className={styles.searchForm}>
          <input
            className={styles.searchInput}
            id="search"
            minLength="4"
            onChange={(e) => setSearch(e.target.value)}
            pattern="^[^~`^<>]+$"
            placeholder="Bay Lake, FL"
            type="text"
            value={searchValue}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
      </form>

      <main>
        <>
          {loading || isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>
                As of{" "}
                <time className={styles.time}>
                  {dayjs(weather?.properties?.updated).format(
                    "MMMM D, YYYY @ h:mm A"
                  )}
                </time>{" "}
                from{" "}
                <a href="https://www.weather.gov/">National Weather Service</a>{" "}
                office in {weather?.station?.name}.
              </p>
              <h2>Alerts</h2>
              {weather?.alerts?.features.length >= 1 ? (
                weather?.alerts?.features?.map((alert, index) => (
                  <div className="bg-gray-200 p-4" key={index}>
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
              <h2>Forecast for {location}</h2>
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
              <div className={styles.forecastContainer}>
                {weather.forecast?.properties?.periods.map((period, index) => (
                  <div key={index} className={styles.forecast}>
                    <div className={styles.forecastHeader}>
                      <h2>{period.name}</h2>
                      <img
                        alt={period.name}
                        height="86"
                        loading="lazy"
                        src={period.icon}
                        width="86"
                      />
                    </div>
                    <div className={styles.forecastBody}>
                      <p>
                        {period?.isDaytime ? <>High</> : <>Low</>}{" "}
                        {period?.temperature}° {period?.temperatureUnit} |
                        Winds: {period?.windDirection} at {period?.windSpeed}
                      </p>
                      <p>{period?.detailedForecast}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h2>Radar</h2>
              <img
                alt="Radar image"
                className={styles.radar}
                height="550"
                loading="lazy"
                src={`https://radar.weather.gov/ridge/lite/${weather?.location?.radarStation}_loop.gif`}
                width="600"
              />
              <footer className={styles.footer}>
                <Link href="/">
                  <a>Back to top</a>
                </Link>
              </footer>
            </>
          )}
        </>
      </main>
    </>
  );
}
