'use client'

import {useMoonPhase} from '@/lib/hooks/useMoonPhase'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Moon phase detail card component.
 *
 * Displays current moon phase name, emoji icon, and illumination percentage.
 */
export default function MoonPhase() {
  const {phaseName, phaseEmoji, illumination} = useMoonPhase()

  return (
    <DetailCard delay={0.6}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Moon Phase
        </Text>

        <Text size="4rem" style={{lineHeight: 1}}>
          {phaseEmoji}
        </Text>

        <Text size="lg" fw={600}>
          {phaseName}
        </Text>

        <Text size="sm" c="dimmed">
          {illumination} illuminated
        </Text>
      </Stack>
    </DetailCard>
  )
}
