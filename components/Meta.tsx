import Head from 'next/head'

/**
 * Meta component.
 */
export default function Meta() {
  return (
    <Head>
      <title>Local Weather</title>
      <meta
        name="description"
        content="View the current weather conditions, long-range forecast, and get weather alerts for your local area."
      />
      <link
        as="fetch"
        rel="preload"
        href="/api/places?location=Enterprise,%20AL"
        crossOrigin="same-origin"
      />
      <link
        as="fetch"
        rel="preload"
        href="/api/weather?location=Enterprise,%20AL"
        crossOrigin="same-origin"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
