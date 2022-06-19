import {Container, LoadingOverlay} from '@mantine/core'
import Alerts from '~/components/Alerts'
import CurrentConditions from '~/components/CurrentConditions'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import {useWeatherContext} from '~/components/WeatherProvider'

export default function Home() {
  const {isLoading} = useWeatherContext()

  return (
    <Container>
      <Header />
      <LoadingOverlay
        visible={isLoading}
        transitionDuration={250}
        exitTransitionDuration={250}
      />
      {!isLoading && (
        <main>
          <CurrentConditions />
          <Forecast />
          <Alerts />
        </main>
      )}
      <Footer />
    </Container>
  )
}
