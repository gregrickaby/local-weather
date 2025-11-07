'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useCurrentConditions} from '@/lib/hooks/useCurrentConditions'
import {formatTemperature} from '@/lib/utils/formatting'
import {Group, Stack, Text, Title} from '@mantine/core'
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

  const {tempUnit, temperature, description, icon, forecastStatement} =
    conditions

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

        <Text
          ta="center"
          maw={600}
          mt="xs"
          className={classes.forecastStatement}
        >
          {forecastStatement}
        </Text>
      </Stack>
    </div>
  )
}
