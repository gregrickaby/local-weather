'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useCurrentConditions} from '@/lib/hooks/useCurrentConditions'
import {useLastUpdated} from '@/lib/hooks/useLastUpdated'
import {formatTemperature} from '@/lib/utils/formatting'
import {Group, Stack, Text, Title} from '@mantine/core'
import classes from './CurrentConditions.module.css'

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const conditions = useCurrentConditions()
  const {relative, absolute} = useLastUpdated()

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
        <Group gap="xs" justify="center" wrap="nowrap">
          <Icon icon={icon} alt="" />
          <Title order={2} ta="center" className={classes.description}>
            {description}
          </Title>
        </Group>

        <Title order={1} ta="center" className={classes.bigtemp}>
          {formatTemperature(tempUnit, temperature)}
        </Title>
        {showFeelsLike && (
          <Text ta="center" mt={0}>
            Feels Like: {formatTemperature(tempUnit, apparentTemperature)}
          </Text>
        )}

        <Text
          className={classes.forecastStatement}
          maw={600}
          mt="xs"
          ta="center"
        >
          {forecastStatement}
        </Text>
        {(relative || absolute) && (
          <Text ta="center" mt="xs" size="xs" className={classes.updatedAt}>
            Last updated {relative ?? absolute}
          </Text>
        )}
      </Stack>
    </div>
  )
}
