import Head from 'next/head'
import {useState, useEffect} from 'react'
import {useWeather} from '../lib/swr-hooks'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import logo from '../public/logo.webp'

/**
 * The Homepage component.
 *
 * @author Greg Rickaby
 * @returns {Element} The Homepage component.
 */
export default function Home() {
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    lng: -81.5612
  })
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearch] = useState('Bay Lake, FL')
  const {weather, isLoading} = useWeather(loading, coordinates)

  // The location returned from NWS API all prettied up.
  const nwsLocation = `${weather?.location?.relativeLocation?.properties?.city}, ${weather?.location?.relativeLocation?.properties?.state}`

  /**
   * Fetch user's coordinates.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  function getUsersPostion() {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoordinates({
          lat: pos?.coords?.latitude,
          lng: pos?.coords?.longitude
        }),
      (err) => {
        console.warn(`There was a problem getting your location ${err}`)
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    )
    setLoading(false)
  }

  /**
   * Convert city and state into lat/lng coordinates.
   */
  async function getCoordinates(search: string) {
    setLoading(true)
    const response = await fetch(
      `/api/geocoding?address=${JSON.stringify(search)}`
    )
    const coordinates = await response.json()
    setCoordinates(coordinates)
    setLoading(false)
  }

  /**
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event: any) {
    event.preventDefault()
    setLoading(true)
    setSearch(searchValue)
    getCoordinates(searchValue)
  }

  /**
   * Attempt to get the user's location
   * on initial page load.
   */
  useEffect(() => {
    getUsersPostion()
  }, [])

  // When the user searches, update the
  // location with data from NWS.
  useEffect(() => {
    if (!isLoading) setSearch(nwsLocation)
  }, [isLoading, nwsLocation])

  return (
    <div className="p-4">
      <Head>
        <title>Local Weather</title>
        <meta
          name="description"
          content="View the local weather forecast from the National Weather Service."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-8 grid items-center gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center justify-center space-x-4 md:justify-start">
            <Image src={logo} alt="" priority />
            <h1>Local Weather</h1>
          </div>
        </div>
        <form onSubmit={handleSearch} className="md:col-span-6 md:col-start-7">
          <label className="sr-only" htmlFor="search">
            Enter your location
          </label>
          <div className="grid grid-cols-12 gap-2">
            <input
              className=" col-span-8 rounded-md border border-zinc-500 px-3 py-2 text-xl md:col-span-10"
              id="search"
              minLength={4}
              onChange={(e) => setSearch(e.target.value)}
              pattern="^[^~`^<>]+$"
              placeholder="Bay Lake, FL"
              type="text"
              value={searchValue}
            />
            <button className="button col-span-4 md:col-span-2">Search</button>
          </div>
        </form>
      </header>

      <main className="space-y-8">
        <>
          {loading || isLoading ? (
            <p>Loading forecast...</p>
          ) : (
            <>
              {weather?.alerts?.features.length >= 1 && (
                <>
                  <h2>Alerts</h2>
                  {weather?.alerts?.features?.map((alert, index) => (
                    <div key={index}>
                      <p className="text-red-500">
                        {alert?.properties?.headline}
                      </p>
                      <p>{alert?.properties?.description}</p>
                      <p>{alert?.properties?.instruction}</p>
                    </div>
                  ))}
                </>
              )}

              <section>
                <h2 className="sr-only">Forecast</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {weather.forecast?.properties?.periods.map(
                    (period, index) => (
                      <div
                        key={index}
                        className="space-y-2 bg-zinc-300 p-4 dark:bg-zinc-800"
                      >
                        <p className="mb-4 font-bold">{period.name}</p>
                        <Image
                          alt={period.name}
                          height="86"
                          loading="lazy"
                          src={period.icon}
                          width="86"
                        />
                        <p>{period?.detailedForecast}</p>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section>
                <h2>Radar</h2>
                <Image
                  alt={`Radar image loop of ${nwsLocation}`}
                  className="radar"
                  height={550}
                  loading="lazy"
                  src={`https://radar.weather.gov/ridge/lite/${weather?.location?.radarStation}_loop.gif`}
                  width={600}
                />
              </section>
            </>
          )}
        </>
      </main>

      {!isLoading && (
        <footer className="my-16 text-center">
          <p className="my-4 font-mono text-sm">
            <time className="font-bold">
              As of{' '}
              {dayjs(weather?.properties?.updated).format(
                'MMMM D, YYYY @ H:mm'
              )}
            </time>{' '}
            from{' '}
            <a href="https://www.weather.gov/" className="dark:text-zinc-300">
              the National Weather Service
            </a>{' '}
            in {weather?.station?.name}.
          </p>
          <Link href="/">
            <a className="button">Back to Top</a>
          </Link>
        </footer>
      )}
    </div>
  )
}
