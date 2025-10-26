'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useCurrentConditions} from '@/lib/hooks/useCurrentConditions'
import {formatTemperature} from '@/lib/utils/helpers'
import {Stack, Text} from '@mantine/core'
import classes from './CurrentConditions.module.css'

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const conditions = useCurrentConditions()

  // Return null if weather data isn't loaded yet
  if (!conditions) {
    return null
  }

  const {
    tempUnit,
    temperature,
    apparentTemperature,
    description,
    icon,
    forecastStatement,
    showFeelsLike
  } = conditions

  return (
    <div className={classes.hero}>
      <Stack align="center" gap="xs">
        <div className={classes.descriptionContainer}>
          <Icon icon={icon} alt="" />
          <Text className={classes.description} component="p">
            {description}
          </Text>
        </div>
        <Text className={classes.bigtemp} component="p">
          {formatTemperature(tempUnit, temperature)}
        </Text>
        <Text className={classes.forecastStatement} ta="center">
          {forecastStatement}
        </Text>
        {showFeelsLike && (
          <Text className={classes.feelslike} component="p">
            Feels Like: {formatTemperature(tempUnit, apparentTemperature)}
          </Text>
        )}
      </Stack>
    </div>
  )
}
