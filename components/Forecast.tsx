import {Card, SimpleGrid, Text, Title} from '@mantine/core'
import Image from 'next/image'
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
                <Image
                  alt={main}
                  height={100}
                  src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                  width={100}
                />
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
              <Image
                alt={main}
                height={100}
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                width={100}
              />
            </Card>
          )
        })}
      </SimpleGrid>
    </section>
  )
}
