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
      <SimpleGrid cols={2} breakpoints={[{maxWidth: 'xs', cols: 2}]}>
        {weather?.hourly
          ?.map((forecast, index: number) => {
            const {
              dt,
              weather: [{icon, main}],
              temp
            } = forecast
            return (
              <Card shadow="sm" padding="xl" key={index}>
                <Text weight={700}>
                  {new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric'
                  }).format(dt * 1000)}
                </Text>
                <Text>{main}</Text>
                <Text size="xl">{Math.round(temp)}°</Text>
                <Icon icon={icon} />
              </Card>
            )
          })
          .slice(1, 5)}
      </SimpleGrid>

      <Title order={2} align="center" my="lg">
        Extended Forecast
      </Title>
      <SimpleGrid cols={2} breakpoints={[{maxWidth: 'xs', cols: 2}]}>
        {weather?.daily?.map((forecast, index: number) => {
          const {
            dt,
            rain,
            weather: [{icon, main}],
            temp: {min, max}
          } = forecast
          return (
            <Card shadow="sm" padding="xl" key={index}>
              <Text weight={700}>
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long'
                }).format(dt * 1000)}
              </Text>
              <Text>
                {main} {rain ? `${Math.round(rain * 100)}%` : ''}
              </Text>
              <Text size="xl">{Math.round(min)}°</Text>
              <Text size="sm">{Math.round(max)}°</Text>
              <Icon icon={icon} />
            </Card>
          )
        })}
      </SimpleGrid>
    </section>
  )
}
