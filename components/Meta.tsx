import Head from 'next/head'

export default function Meta() {
  return (
    <Head>
      <title>Local Weather</title>
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
