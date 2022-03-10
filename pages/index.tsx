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
      {isLoading ? (
        <LoadingOverlay visible transitionDuration={500} />
      ) : (
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
