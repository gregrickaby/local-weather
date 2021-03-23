import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [loading, setLoading] = useState();
  const [city, setCity] = useState();
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
    const weather = await response.json();
    setWeather(weather);
    setLoading(false);
  }

  /**
   * Find the city!
   */
  async function getCity() {
    setLoading(true);
    const response = await fetch(`/api/geocoding`, {
      method: "POST",
      body: JSON.stringify(coordinates),
    });
    const city = await response.json();
    setCity(city);
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
    getCity();
  }, [coordinates]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Weather</h1>
        <h2>{city?.results[0]?.formatted_address}</h2>
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
        <button className={styles.button} onClick={getLocation}>
          Click for Local Forecast
        </button>
      </main>
    </div>
  );
}
