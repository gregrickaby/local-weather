import Head from 'next/head'
import {useWeatherContext} from '~/components/WeatherProvider'

export default function Meta() {
  const {location} = useWeatherContext()
  return (
    <Head>
      <title>{location} - Local Weather</title>
      <meta
        name="description"
        content="View the current weather conditions, long-range forecast, and get weather alerts for your local area."
      />
      <link rel="preconnect" href="//api.openweathermap.org" />
      <link rel="preconnect" href="//maps.googleapis.com" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
