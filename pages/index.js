import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [address, setAddress] = useState();
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    long: -81.5612,
  });
  const [loading, setLoading] = useState();
  const [weather, setWeather] = useState();

  /**
   * Fetch the forecast.
   */
  async function getWeather() {
    setLoading(true);
    const response = await fetch(
      `/api/weather?lat=${coordinates?.lat}&long=${coordinates?.long}`
    );
    const weather = await response.json();
    setWeather(weather);
    setLoading(false);
  }

  /**
   * Fetch the address.
   */
  async function getAddress() {
    setLoading(true);
    const response = await fetch(
      `/api/reversegeocoding?lat=${coordinates?.lat}&long=${coordinates?.long}`
    );
    const address = await response.json();
    setAddress(address);
    setLoading(false);
  }

  /**
   * Using the Geolocation API, attempt to get the
   * user's coordinates.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  async function getLocation() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoordinates({
          lat: pos?.coords?.latitude,
          long: pos?.coords?.longitude,
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
   * When the page loads intially, or if the
   * user clicks the "Local Forcast" button.
   */
  useEffect(() => {
    getWeather();
    getAddress();
  }, [coordinates]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Weather</h1>
        <h2>{address}</h2>
        <div className={styles.weather}>
          {loading ? (
            <p>Loading current conditions...</p>
          ) : (
            <>
              <p>
                {weather?.currently?.summary} and{" "}
                {Math.round(weather?.currently?.temperature)}F
              </p>
              <p>{weather?.daily?.summary}</p>
            </>
          )}
        </div>
        <button className={styles.button} onClick={getLocation}>
          Click for Local Forecast
        </button>
      </main>
    </div>
  );
}
