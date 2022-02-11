import {Container} from '@mantine/core'
import {useEffect, useState} from 'react'
import Alerts from '~/components/Alerts'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import Radar from '~/components/Radar'
import {useSearchContext} from '~/components/SearchProvider'
import useFetch from '~/lib/useFetch'

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
  const {weather} = useFetch(loading, coordinates)

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
   * Attempt to get the user's
   * location on initial load.
   */
  useEffect(() => {
    getUsersPostion()
  }, [])

  /**
   * Load the user's weather
   * based on the search term.
   */
  useEffect(() => {
    getCoordinates(search)
  }, [search])

  return (
    <Container>
      <Header />
      <main>
        <Forecast forecast={weather?.forecast} />
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
