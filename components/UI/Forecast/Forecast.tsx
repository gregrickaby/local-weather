import Icon from '@/components/UI/Icon/Icon'
import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {
  formatDay,
  formatTemperature,
  formatTime,
  getWeatherInfo
} from '@/lib/utils/helpers'
import {Card, SimpleGrid, Space, Text, Title} from '@mantine/core'
import classes from './Forecast.module.css'

/**
 * Forecast component.
 */
export default function Forecast() {
  const location = useAppSelector((state) => state.preferences.location)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const mounted = useAppSelector((state) => state.preferences.mounted)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  if (!weather?.hourly || !weather?.daily) {
    return null
  }

  // Use the location's current time from the API (not browser time)
  // This ensures correct time display for any timezone
  const currentTime = new Date(weather.current.time)
  const currentHourIndex = currentTime.getHours()

  const nextFourHours = Array.from({length: 4}, (_, i) => {
    const index = currentHourIndex + i + 1
    // Validate array bounds before accessing
    if (index >= weather.hourly.time.length) {
      return null
    }
    return {
      time: weather.hourly.time[index],
      temp: weather.hourly.temperature_2m[index],
      feels_like: weather.hourly.apparent_temperature[index],
      weather_code: weather.hourly.weather_code[index],
      precipitation_probability: weather.hourly.precipitation_probability[index]
    }
  }).filter((item): item is Exclude<typeof item, null> => item !== null)

  // Skip "Today" in daily forecast if it's after 8 PM (late evening)
  // At this point, users are more interested in tomorrow's forecast
  const skipToday = currentHourIndex >= 20
  const dailyForecastsRaw = weather.daily.time.map((date, index) => ({
    date,
    weather_code: weather.daily.weather_code[index],
    temp_max: weather.daily.temperature_2m_max[index],
    temp_min: weather.daily.temperature_2m_min[index],
    temp_current:
      index === 0 && !skipToday
        ? weather.hourly.temperature_2m[currentHourIndex]
        : undefined,
    feels_like: weather.daily.apparent_temperature_max[index],
    precipitation_probability:
      weather.daily.precipitation_probability_max[index]
  }))

  // Filter out today if it's late evening
  const dailyForecasts = skipToday
    ? dailyForecastsRaw.slice(1)
    : dailyForecastsRaw

  return (
    <section>
      <Space h="lg" />
      <Title className={classes.title} order={2} my="lg">
        The Next 4 Hours
      </Title>
      <SimpleGrid cols={{base: 1, sm: 2, lg: 4}}>
        {nextFourHours.map((forecast) => {
          const sunrise = weather.daily.sunrise[0]
          const sunset = weather.daily.sunset[0]
          const {description, icon} = getWeatherInfo(
            forecast.weather_code,
            forecast.time,
            sunrise,
            sunset
          )
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
        {(() => {
          // Calculate dynamic temperature scale based on actual data
          const allTemps = dailyForecasts.flatMap((f) => [
            f.temp_min,
            f.temp_max,
            f.temp_current
          ])
          const validTemps = allTemps.filter(
            (t): t is number => typeof t === 'number' && !Number.isNaN(t)
          )
          const minTempScale = Math.floor(Math.min(...validTemps) - 5)
          const maxTempScale = Math.ceil(Math.max(...validTemps) + 5)
          const range = maxTempScale - minTempScale

          return dailyForecasts.map((forecast, index) => {
            // For daily forecast, use noon as reference time (daytime icon)
            const noonTime = `${forecast.date}T12:00:00`
            const sunrise = weather.daily.sunrise[index]
            const sunset = weather.daily.sunset[index]
            const {icon} = getWeatherInfo(
              forecast.weather_code,
              noonTime,
              sunrise,
              sunset
            )

            // Calculate percentage positions for temp range
            const minPercent =
              ((forecast.temp_min - minTempScale) / range) * 100
            const maxPercent =
              ((forecast.temp_max - minTempScale) / range) * 100
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
                    <Text
                      size="sm"
                      c="dimmed"
                      className={classes.tempLabelLeft}
                    >
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
          })
        })()}
      </div>
    </section>
  )
}
