'use client'

import {Container, LoadingOverlay} from '@mantine/core'
import Alerts from '~/components/Alerts'
import CurrentConditions from '~/components/CurrentConditions'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import {useWeatherContext} from '~/components/WeatherProvider'

/**
 * Home page component.
 */
export default function HomePage() {
  const {isLoading} = useWeatherContext()

  return (
    <>
      <Container>
        <Header />
        <LoadingOverlay visible={isLoading} />
        {!isLoading && (
          <main>
            <CurrentConditions />
            <Forecast />
            <Alerts />
          </main>
        )}
        <Footer />
      </Container>
    </>
  )
}
