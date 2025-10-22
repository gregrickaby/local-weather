'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {
  formatTemperature,
  generateForecastStatement,
  getWeatherInfo
} from '@/lib/utils/helpers'
import {Stack, Text} from '@mantine/core'
import classes from './CurrentConditions.module.css'

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const location = useAppSelector((state) => state.preferences.location)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const mounted = useAppSelector((state) => state.preferences.mounted)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  // Return null if weather data isn't loaded yet
  if (!weather?.current) {
    return null
  }

  const {
    current: {weather_code, temperature_2m, apparent_temperature, time},
    daily: {sunrise, sunset}
  } = weather

  // Get current conditions with day/night icon
  const {description} = getWeatherInfo(
    weather_code,
    time,
    sunrise[0],
    sunset[0]
  )

  // Generate forecast statement
  const forecastStatement = generateForecastStatement(weather)

  return (
    <Stack align="center">
      <Text
        className={classes.description}
        component="p"
        gradient={{from: 'indigo', to: 'cyan', deg: 45}}
        variant="gradient"
      >
        {description}
      </Text>
      <Text
        className={classes.bigtemp}
        component="p"
        gradient={{from: 'indigo', to: 'cyan', deg: 45}}
        variant="gradient"
      >
        {formatTemperature(tempUnit, temperature_2m)}
      </Text>
      <Text size="sm" c="dimmed" ta="center" mt="xs">
        {forecastStatement}
      </Text>
      {apparent_temperature > temperature_2m && (
        <Text
          className={classes.feelslike}
          component="p"
          gradient={{from: 'yellow', to: 'orange', deg: 45}}
          variant="gradient"
        >
          Feels Like: {formatTemperature(tempUnit, apparent_temperature)}
        </Text>
      )}
    </Stack>
  )
}
