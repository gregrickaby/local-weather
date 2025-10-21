'use client'

import classes from '@/components/CurrentConditions.module.css'
import {useWeatherContext} from '@/components/WeatherProvider'
import {formatTemperature, getWeatherInfo} from '@/lib/helpers'
import {Stack, Text} from '@mantine/core'

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const {weather, tempUnit} = useWeatherContext()

  // Return null if weather data isn't loaded yet
  if (!weather || !weather.current) {
    return null
  }

  const {
    current: {weather_code, temperature_2m, apparent_temperature}
  } = weather

  const {description} = getWeatherInfo(weather_code)

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
