import {Container, LoadingOverlay} from '@mantine/core'
import CurrentConditions from '~/components/CurrentConditions'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import {useWeatherContext} from '~/components/WeatherProvider'

/**
 * The Homepage component.
 *
 * @author Greg Rickaby
 * @return {Element} The Homepage component.
 */
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
        </main>
      )}
      <Footer />
    </Container>
  )
}
