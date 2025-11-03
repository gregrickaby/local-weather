'use client'

import {useVisibility} from '@/lib/hooks/useVisibility'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Visibility detail card component.
 *
 * Displays current visibility distance.
 */
export default function Visibility() {
  const {visibilityValue, visibilityUnit, description} = useVisibility()

  return (
    <DetailCard delay={250}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Visibility
        </Text>

        <Text size="48px" fw={600}>
          {visibilityValue} {visibilityUnit}
        </Text>

        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}
