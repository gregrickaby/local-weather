import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useWeather } from "../lib/swr-hooks";

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
  async function getLocation() {
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
  }

  /**
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event) {
    event.preventDefault();
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
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.weather.gov/" />
      </Head>

      <main className={styles.main}>
        <h1>Weather</h1>
        <form onSubmit={handleSearch} className={styles.search}>
          <label className="sr-only" htmlFor="search">
            Enter your city
          </label>
          <input
            id="search"
            className={styles.input}
            minLength="4"
            onChange={(e) => setSearch(e.target.value)}
            pattern="^[^~`^<>]+$"
            placeholder="Bay Lake, FL"
            type="text"
            value={searchValue}
          />
          <button className={styles.button}>Search</button>
          <button className={styles.local} onClick={getLocation}>
            Fetch Local Forecast
          </button>
        </form>
        <div className={styles.weather}>
          <h2>{!!address && address}</h2>
          {loading || isLoading ? (
            <p>Loading current conditions...</p>
          ) : (
            <>
              {weather?.properties?.periods.map((period, index) => (
                <div key={index} className={styles.forecast}>
                  <h3>{period.name}</h3>
                  <img
                    alt={period.name}
                    height="86"
                    loading="lazy"
                    src={period.icon}
                    width="86"
                  />
                  <p>{period.shortForecast}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}
