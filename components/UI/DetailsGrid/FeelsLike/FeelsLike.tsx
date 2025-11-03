'use client'

import {useFeelsLike} from '@/lib/hooks/useFeelsLike'
import {formatTemperature} from '@/lib/utils/formatting'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Feels Like detail card component.
 *
 * Displays apparent temperature (how the temperature feels).
 */
export default function FeelsLike() {
  const {feelsLike, unit, description} = useFeelsLike()

  return (
    <DetailCard delay={350}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Feels Like
        </Text>

        <Text size="48px" fw={600}>
          {formatTemperature(unit, feelsLike)}
        </Text>

        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}
