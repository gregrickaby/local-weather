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
  const [address, setAddress] = useState();
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    lng: -81.5612,
  });
  const [loading, setLoading] = useState();
  const [searchValue, setSearch] = useState("Orlando, FL");
  const { weather, isLoading } = useWeather(coordinates);

  /**
   * Fetch the address.
   */
  async function getAddress() {
    setLoading(true);
    const response = await fetch(
      `/api/reversegeocoding?lat=${coordinates?.lat}&lng=${coordinates?.lng}`
    );
    const address = await response.json();
    setAddress(address);
    setSearch(address);
    setLoading(false);
  }

  /**
   * Fetch the coordinates.
   */
  async function getCoordinates() {
    setLoading(true);
    const response = await fetch(
      `/api/geocoding?address=${JSON.stringify(searchValue)}`
    );
    const coordinates = await response.json();
    setCoordinates(coordinates);
    setLoading(false);
  }

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
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setSearch(searchValue);
    getCoordinates();
  }

  /**
   * When the page loads intially, or if the
   * user clicks the "Local Forecast" button.
   */
  useEffect(() => {
    getAddress();
  }, [coordinates]);

  return (
    <>
      <Head>
        <title>Weather - {!!address && address}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.weather.gov/" />
      </Head>

      <header className={styles.header}>
        <h1>Weather</h1>
        <button className={styles.button} onClick={getLocation}>
          Fetch Local Forecast
        </button>
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
            placeholder="Bay Lake, FL, USA"
            type="text"
            value={searchValue}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
      </form>

      <main>
        <>
          {loading || isLoading ? (
            <p>Loading current conditions...</p>
          ) : (
            <>
              <div className={styles.updated}>
                Last update was{" "}
                <time className={styles.time}>
                  {dayjs(weather?.properties?.updated).format(
                    "MMMM D, YYYY @ h:mm A"
                  )}
                </time>{" "}
                from the{" "}
                <a href="https://www.weather.gov/">National Weather Service</a>.
              </div>

              {weather?.properties?.periods.map((period, index) => (
                <article key={index} className={styles.forecast}>
                  <header>
                    <h3>{period.name}</h3>
                    <img
                      alt={period.name}
                      height="86"
                      loading="lazy"
                      src={period.icon}
                      width="86"
                    />
                  </header>

                  <div className={styles.currently}>
                    <p>
                      {period?.isDaytime ? <>High</> : <>Low</>}{" "}
                      {period?.temperature}° {period?.temperatureUnit} | Winds:{" "}
                      {period?.windDirection} at {period?.windSpeed}
                    </p>
                    {period?.shortForecast}
                  </div>

                  <details>
                    <summary>Full Forecast</summary>
                    <p>{period?.detailedForecast}</p>
                  </details>
                </article>
              ))}

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
