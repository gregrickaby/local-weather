import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [loading, setLoading] = useState();
  const [weather, setWeather] = useState();
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    long: -81.5612,
  });

  /**
   * Get the weather forecast!
   */
  async function getWeather() {
    setLoading(true);
    const response = await fetch(`/api/weather`, {
      method: "POST",
      body: JSON.stringify(coordinates),
    });
    const data = await response.json();
    setWeather(data);
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
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
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
  }, [coordinates]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Weather</h1>
        <div className={styles.weather}>
          {loading ? (
            <p>Loading current conditions...</p>
          ) : typeof weather == "undefined" ? (
            <p>Unable to fetch results. Try reloading the page.</p>
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
        <button onClick={getLocation}>Click for Local Forcast</button>
      </main>
    </div>
  );
}
