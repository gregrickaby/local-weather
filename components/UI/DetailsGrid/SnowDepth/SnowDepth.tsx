'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useSnowDepth} from '@/lib/hooks/useSnowDepth'
import {Stack, Text, Title} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Snow depth detail card component.
 *
 * Displays current snow depth on the ground.
 * Only shown when snow is present (conditionally rendered in DetailsGrid).
 */
export default function SnowDepth() {
  const {formatted, description, hasSnow} = useSnowDepth()

  // Don't render if no snow
  if (!hasSnow) {
    return null
  }

  return (
    <DetailCard delay={0}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Snow Depth
        </Text>

        <Icon icon="snowflake" alt="snow depth" />

        <Stack gap="xs">
          <Title order={2} size="xl">
            {formatted}
          </Title>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Stack>
    </DetailCard>
  )
}
