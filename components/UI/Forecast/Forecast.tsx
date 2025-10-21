import {useWeatherContext} from '@/components/Context/WeatherProvider/WeatherProvider'
import Icon from '@/components/UI/Icon/Icon'
import {
  formatDay,
  formatTemperature,
  formatTime,
  getWeatherInfo
} from '@/lib/helpers'
import {Card, SimpleGrid, Space, Text, Title} from '@mantine/core'
import classes from './Forecast.module.css'

/**
 * Forecast component.
 */
export default function Forecast() {
  const {weather, tempUnit} = useWeatherContext()

  if (!weather?.hourly || !weather?.daily) {
    return null
  }

  // Get the current hour index to start from next hour
  const currentHourIndex = new Date().getHours()
  const nextFourHours = Array.from({length: 4}, (_, i) => {
    const index = currentHourIndex + i + 1
    return {
      time: weather.hourly.time[index],
      temp: weather.hourly.temperature_2m[index],
      feels_like: weather.hourly.apparent_temperature[index],
      weather_code: weather.hourly.weather_code[index],
      precipitation_probability: weather.hourly.precipitation_probability[index]
    }
  })

  const dailyForecasts = weather.daily.time.map((date, index) => ({
    date,
    weather_code: weather.daily.weather_code[index],
    temp_max: weather.daily.temperature_2m_max[index],
    temp_min: weather.daily.temperature_2m_min[index],
    feels_like: weather.daily.apparent_temperature_max[index],
    precipitation_probability:
      weather.daily.precipitation_probability_max[index]
  }))

  return (
    <section>
      <Space h="lg" />
      <Title className={classes.title} order={2} my="lg">
        The Next 4 Hours
      </Title>
      <SimpleGrid cols={{base: 1, sm: 2, lg: 4}}>
        {nextFourHours.map((forecast, index) => {
          const {description, icon} = getWeatherInfo(forecast.weather_code)
          return (
            <Card className={classes.card} shadow="sm" p="xl" key={index}>
              <Text size="xl">{formatTime(forecast.time)}</Text>
              <Text size="xl">
                {formatTemperature(tempUnit, forecast.temp)}
              </Text>
              <Icon icon={icon} />
              <Text size="lg">{description}</Text>
              {forecast.feels_like > forecast.temp && (
                <Text
                  gradient={{from: 'yellow', to: 'orange', deg: 45}}
                  size="lg"
                  variant="gradient"
                >
                  Feels Like: {formatTemperature(tempUnit, forecast.feels_like)}
                </Text>
              )}
            </Card>
          )
        })}
      </SimpleGrid>

      <Title className={classes.title} order={2} my="lg">
        Extended Forecast
      </Title>

      <SimpleGrid cols={{base: 1, sm: 2, lg: 4}}>
        {dailyForecasts.map((forecast, index) => {
          const {description, icon} = getWeatherInfo(forecast.weather_code)
          return (
            <Card className={classes.card} shadow="sm" p="xl" key={index}>
              <Text size="xl">{formatDay(forecast.date, index)}</Text>
              <Text size="lg">
                {description}{' '}
                {forecast.precipitation_probability
                  ? `${Math.round(forecast.precipitation_probability)}%`
                  : ''}
              </Text>
              <Text size="lg">
                H {formatTemperature(tempUnit, forecast.temp_max)} / L{' '}
                {formatTemperature(tempUnit, forecast.temp_min)}
              </Text>
              <Icon icon={icon} />
              {forecast.feels_like > forecast.temp_max && (
                <Text
                  gradient={{from: 'yellow', to: 'orange', deg: 45}}
                  size="lg"
                  variant="gradient"
                >
                  Feels Like: {formatTemperature(tempUnit, forecast.feels_like)}
                </Text>
              )}
            </Card>
          )
        })}
      </SimpleGrid>
    </section>
  )
}
