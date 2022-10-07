import {Card, SimpleGrid, Space, Text, Title} from '@mantine/core'
import Icon from '~/components/Icon'
import {useWeatherContext} from '~/components/WeatherProvider'
import {formatDay, formatTemperature, formatTime} from '~/lib/helpers'

/**
 * Forecast component.
 */
export default function Forecast() {
  const {weather, tempUnit} = useWeatherContext()

  return (
    <section>
      <Space h="lg" />
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
              temp,
              feels_like
            } = forecast
            return (
              <Card
                shadow="sm"
                p="xl"
                key={index}
                style={{textAlign: 'center'}}
              >
                <Text size="xl" weight={700}>
                  {formatTime(dt)}
                </Text>
                <Text size="xl">{formatTemperature(tempUnit, temp)}</Text>
                <Icon icon={icon} />
                <Text size="lg">{main}</Text>
                {feels_like > temp && (
                  <Text
                    size="lg"
                    gradient={{from: 'yellow', to: 'orange', deg: 45}}
                    variant="gradient"
                  >
                    Feels Like: {formatTemperature(tempUnit, feels_like)}
                  </Text>
                )}
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
            pop,
            weather: [{icon, main}],
            temp: {min, max},
            feels_like: {day}
          } = forecast
          return (
            <Card shadow="sm" p="xl" key={index} style={{textAlign: 'center'}}>
              <Text size="xl" weight={700}>
                {formatDay(dt, index)}
              </Text>
              <Text size="lg">
                {main} {pop ? `${Math.round(pop * 100)}%` : ''}
              </Text>
              <Text size="lg">
                H {formatTemperature(tempUnit, max)} / L{' '}
                {formatTemperature(tempUnit, min)}
              </Text>
              <Icon icon={icon} />
              {day > max && (
                <Text
                  size="lg"
                  gradient={{from: 'yellow', to: 'orange', deg: 45}}
                  variant="gradient"
                >
                  Feels Like: {formatTemperature(tempUnit, day)}
                </Text>
              )}
            </Card>
          )
        })}
      </SimpleGrid>
    </section>
  )
}
