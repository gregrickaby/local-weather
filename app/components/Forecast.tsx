import {Card, SimpleGrid, Space, Text, Title} from '@mantine/core'
import classes from '~/components/Forecast.module.css'
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
      <Title className={classes.title} order={2} my="lg">
        The Next 4 Hours
      </Title>
      <SimpleGrid cols={{base: 1, sm: 2, lg: 4}}>
        {weather?.hourly
          ?.map((forecast, index: number) => {
            const {
              dt,
              weather: [{icon, main}],
              temp,
              feels_like
            } = forecast
            return (
              <Card className={classes.card} shadow="sm" p="xl" key={index}>
                <Text size="xl">{formatTime(dt)}</Text>
                <Text size="xl">{formatTemperature(tempUnit, temp)}</Text>
                <Icon icon={icon} />
                <Text size="lg">{main}</Text>
                {feels_like > temp && (
                  <Text
                    gradient={{from: 'yellow', to: 'orange', deg: 45}}
                    size="lg"
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

      <Title className={classes.title} order={2} my="lg">
        Extended Forecast
      </Title>

      <SimpleGrid cols={{base: 1, sm: 2, lg: 4}}>
        {weather?.daily?.map((forecast, index: number) => {
          const {
            dt,
            pop,
            weather: [{icon, main}],
            temp: {min, max},
            feels_like: {day}
          } = forecast
          return (
            <Card className={classes.card} shadow="sm" p="xl" key={index}>
              <Text size="xl">{formatDay(dt, index)}</Text>
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
                  gradient={{from: 'yellow', to: 'orange', deg: 45}}
                  size="lg"
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
