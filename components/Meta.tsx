import Head from 'next/head'

/**
 * Render the Meta component
 *
 * @author Greg Rickaby
 * @return {Element} The Meta component.
 */
export default function Meta() {
  return (
    <Head>
      <title>Local Weather</title>
      <meta
        name="description"
        content="View the local weather forecast from the National Weather Service."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
