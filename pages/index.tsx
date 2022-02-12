import {Container, LoadingOverlay} from '@mantine/core'
import Alerts from '~/components/Alerts'
import Footer from '~/components/Footer'
import Forecast from '~/components/Forecast'
import Header from '~/components/Header'
import Radar from '~/components/Radar'
import {useWeatherContext} from '~/components/WeatherProvider'

/**
 * The Homepage component.
 *
 * @author Greg Rickaby
 * @return {Element} The Homepage component.
 */
export default function Home() {
  const {isLoading, weather} = useWeatherContext()

  return (
    <Container>
      <Header />
      {isLoading ? (
        <LoadingOverlay visible transitionDuration={500} />
      ) : (
        <>
          <main>
            <Forecast
              forecast={weather?.forecast}
              location={weather?.location}
            />
            <Radar image={weather?.radar} />
            <Alerts alerts={weather?.alerts} />
          </main>
          <Footer
            updatedTime={weather?.updated}
            weatherStation={weather?.station}
          />
        </>
      )}
    </Container>
  )
}
