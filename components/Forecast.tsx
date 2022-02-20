import {Card, SimpleGrid, Text, Title} from '@mantine/core'
import Icon from './Icon'
import {useWeatherContext} from './WeatherProvider'

/**
 * Render the Forecast component
 *
 * @author Greg Rickaby
 * @return {Element} The Forecast component.
 */
export default function Forecast() {
  const {weather, location} = useWeatherContext()

  return (
    <section>
      <Title order={2} align="center" my="lg">
        The Next 4 Hours
      </Title>
      <SimpleGrid
        cols={4}
        breakpoints={[
          {maxWidth: 980, cols: 3, spacing: 'md'},
          {maxWidth: 755, cols: 2, spacing: 'sm'},
          {maxWidth: 600, cols: 1, spacing: 'sm'}
        ]}
      >
        {weather?.hourly
          ?.map((forecast, index: number) => {
            const {
              dt,
              weather: [{icon, main}],
              temp
            } = forecast
            return (
              <Card
                shadow="sm"
                padding="xl"
                key={index}
                style={{textAlign: 'center'}}
              >
                <Text size="xl" weight={700}>
                  {new Intl.DateTimeFormat('en', {
                    hour: 'numeric'
                  }).format(dt * 1000)}
                </Text>
                <Icon icon={icon} />
                <Text size="lg">{main}</Text>
                <Text size="lg">{Math.round(temp)}°</Text>
              </Card>
            )
          })
          .slice(1, 5)}
      </SimpleGrid>

      <Title order={2} align="center" my="lg">
        Extended Forecast
      </Title>
      <SimpleGrid
        cols={4}
        breakpoints={[
          {maxWidth: 980, cols: 3, spacing: 'md'},
          {maxWidth: 755, cols: 2, spacing: 'sm'},
          {maxWidth: 600, cols: 1, spacing: 'sm'}
        ]}
      >
        {weather?.daily?.map((forecast, index: number) => {
          const {
            dt,
            rain,
            weather: [{icon, main}],
            temp: {min, max}
          } = forecast
          return (
            <Card
              shadow="sm"
              padding="xl"
              key={index}
              style={{textAlign: 'center'}}
            >
              <Text size="xl" weight={700}>
                {new Intl.DateTimeFormat('en', {
                  weekday: 'long'
                }).format(dt * 1000)}
              </Text>
              <Text size="lg">
                {main} {rain ? `${Math.round(rain * 10)}%` : ''}
              </Text>
              <Text size="lg">
                H {Math.round(max)}° / L {Math.round(min)}°
              </Text>
              <Icon icon={icon} />
            </Card>
          )
        })}
      </SimpleGrid>
    </section>
  )
}
