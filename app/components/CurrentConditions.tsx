'use client'

import {Group, Stack, Text} from '@mantine/core'
import classes from '~/components/CurrentConditions.module.css'
import {useWeatherContext} from '~/components/WeatherProvider'
import {formatTemperature} from '~/lib/helpers'

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const {
    weather: {
      current: {
        weather: [{description}],
        temp,
        feels_like
      }
    },
    tempUnit
  } = useWeatherContext()

  return (
    <Group position="center">
      <Stack>
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
          {formatTemperature(tempUnit, temp)}
        </Text>
        {feels_like > temp && (
          <Text
            className={classes.feelslike}
            component="p"
            gradient={{from: 'yellow', to: 'orange', deg: 45}}
            variant="gradient"
          >
            Feels Like: {formatTemperature(tempUnit, feels_like)}
          </Text>
        )}
      </Stack>
    </Group>
  )
}
