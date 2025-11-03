'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useCurrentConditions} from '@/lib/hooks/useCurrentConditions'
import {formatTemperature} from '@/lib/utils/formatting'
import {Stack, Text, Title} from '@mantine/core'
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
          <Title order={2} className={classes.description}>
            {description}
          </Title>
        </div>
        <Title order={1} className={classes.bigtemp}>
          {formatTemperature(tempUnit, temperature)}
        </Title>
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
