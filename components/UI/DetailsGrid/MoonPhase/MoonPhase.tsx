'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useMoonPhase} from '@/lib/hooks/useMoonPhase'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

export default function MoonPhase() {
  const {phaseName, phaseIcon, illumination} = useMoonPhase()

  return (
    <DetailCard delay={0.6}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Moon Phase
        </Text>

        <Icon icon={phaseIcon} />

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
