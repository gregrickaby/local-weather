import Icon from '@/components/UI/Icon/Icon'
import {
  formatDay,
  formatTemperature,
  formatTime,
  getWeatherInfo
} from '@/lib/helpers'
import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Card, SimpleGrid, Space, Text, Title} from '@mantine/core'
import classes from './Forecast.module.css'

/**
 * Forecast component.
 */
export default function Forecast() {
  const location = useAppSelector((state) => state.preferences.location)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const mounted = useAppSelector((state) => state.preferences.mounted)

  const {data: weather} = useGetWeatherQuery(location, {
    skip: !mounted || !location
  })

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
    temp_current:
      index === 0 ? weather.hourly.temperature_2m[currentHourIndex] : undefined,
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
        {nextFourHours.map((forecast) => {
          const {description, icon} = getWeatherInfo(forecast.weather_code)
          return (
            <Card
              className={classes.card}
              shadow="sm"
              p="xl"
              key={forecast.time}
            >
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

      <div className={classes.forecastList}>
        {dailyForecasts.map((forecast) => {
          const {icon} = getWeatherInfo(forecast.weather_code)

          // Calculate percentage positions for temp range (0-100°F scale)
          const minTempScale = 0
          const maxTempScale = 100
          const range = maxTempScale - minTempScale
          const minPercent = ((forecast.temp_min - minTempScale) / range) * 100
          const maxPercent = ((forecast.temp_max - minTempScale) / range) * 100
          const barWidth = maxPercent - minPercent

          // Calculate current temp indicator position (only for today)
          let currentTempPercent: number | undefined
          if (forecast.temp_current !== undefined) {
            currentTempPercent =
              ((forecast.temp_current - minTempScale) / range) * 100
          }

          return (
            <div key={forecast.date} className={classes.forecastItem}>
              <div className={classes.dayLabel}>
                <Text size="lg" fw={500}>
                  {formatDay(forecast.date)}
                </Text>
              </div>

              <div className={classes.weatherIcon}>
                <Icon icon={icon} />
              </div>

              <div className={classes.tempRange}>
                <div className={classes.tempBarContainer}>
                  <Text size="sm" c="dimmed" className={classes.tempLabelLeft}>
                    {formatTemperature(tempUnit, forecast.temp_min)}
                  </Text>
                  <div className={classes.tempBar}>
                    <div
                      className={classes.tempBarFill}
                      style={{
                        marginLeft: `${minPercent}%`,
                        width: `${barWidth}%`
                      }}
                    />
                    {currentTempPercent !== undefined && (
                      <div
                        className={classes.tempIndicator}
                        style={{
                          left: `${currentTempPercent}%`
                        }}
                      />
                    )}
                  </div>
                  <Text size="sm" fw={500} className={classes.tempLabelRight}>
                    {formatTemperature(tempUnit, forecast.temp_max)}
                  </Text>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
