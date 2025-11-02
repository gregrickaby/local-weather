import Icon from '@/components/UI/Icon/Icon'
import {useForecast} from '@/lib/hooks/useForecast'
import {getWeatherInfo} from '@/lib/utils/conditions'
import {formatDay, formatTemperature, formatTime} from '@/lib/utils/formatting'
import {Card, Text, Title} from '@mantine/core'
import {useMemo} from 'react'
import classes from './Forecast.module.css'

/**
 * Forecast component.
 */
export default function Forecast() {
  const forecastData = useForecast()

  // Memoize hourly forecast processing to avoid recalculating on every render
  const hourlyCards = useMemo(() => {
    if (!forecastData) return null

    const {weather, hourlyForecasts, tempUnit} = forecastData
    const sunrise = weather.daily.sunrise[0]
    const sunset = weather.daily.sunset[0]

    return hourlyForecasts.map((forecast) => {
      const {description, icon} = getWeatherInfo(
        forecast.weather_code,
        forecast.time,
        sunrise,
        sunset
      )
      return (
        <Card
          className={classes.card}
          shadow="none"
          p="md"
          key={forecast.time}
        >
          <Text size="sm" fw={500}>
            {formatTime(forecast.time)}
          </Text>
          <Icon icon={icon} />
          <Text size="xl" fw={700}>
            {formatTemperature(tempUnit, forecast.temp)}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </Card>
      )
    })
  }, [forecastData])

  // Memoize daily forecast processing to avoid recalculating on every render
  const dailyCards = useMemo(() => {
    if (!forecastData) return null

    const {weather, dailyForecasts, tempUnit, tempScale} = forecastData

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
        ((forecast.temp_min - tempScale.min) / tempScale.range) * 100
      const maxPercent =
        ((forecast.temp_max - tempScale.min) / tempScale.range) * 100
      const barWidth = maxPercent - minPercent

      // Calculate current temp indicator position (only for today)
      let currentTempPercent: number | undefined
      if (forecast.temp_current !== undefined) {
        currentTempPercent =
          ((forecast.temp_current - tempScale.min) / tempScale.range) * 100
      }

      return (
        <div key={forecast.date} className={classes.forecastItem}>
          <div className={classes.dayLabel}>
            <Text size="lg" fw={500}>
              {formatDay(forecast.date, weather.current.time)}
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
    })
  }, [forecastData])

  if (!forecastData) {
    return null
  }

  return (
    <section>
      <Title className={classes.title} order={2}>
        Hourly Forecast
      </Title>
      <div className={classes.hourlyScroll}>{hourlyCards}</div>

      <Title className={classes.title} order={2} mt="xl" mb="md">
        10-Day Forecast
      </Title>

      <div className={classes.forecastList}>{dailyCards}</div>
    </section>
  )
}
