import {Container, LoadingOverlay} from '@mantine/core'
import {useEffect, useState} from 'react'
import Alerts from '~/components/Alerts'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import Radar from '~/components/Radar'
import {useSearchContext} from '~/components/SearchProvider'
import useWeather from '~/lib/useWeather'

/**
 * The Homepage component.
 *
 * @author Greg Rickaby
 * @return {Element} The Homepage component.
 */
export default function Home() {
  const {search} = useSearchContext()
  const [coordinates, setCoordinates] = useState({
    lat: 28.3802,
    lng: -81.5612
  })
  const [loading, setLoading] = useState(true)
  const {weather, isLoading} = useWeather(loading, coordinates)

  /**
   * Convert city and state into lat/lng coordinates.
   *
   * @param {string} search The city and state to convert.
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
   * Load the user's weather
   * based on the search term.
   */
  useEffect(() => {
    getCoordinates(search)
  }, [search])

  if (loading || isLoading) {
    return (
      <Container>
        <Header />
        <LoadingOverlay visible transitionDuration={500} />
      </Container>
    )
  }

  return (
    <Container>
      <Header />
      <main>
        <Forecast forecast={weather?.forecast} location={weather?.location} />
        <Radar image={weather?.radar} />
        <Alerts alerts={weather?.alerts} />
      </main>
      <Footer
        updatedTime={weather?.updated}
        weatherStation={weather?.station}
      />
    </Container>
  )
}
