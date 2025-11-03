'use client'

import Icon from '@/components/UI/Icon/Icon'
import {useCloudCover} from '@/lib/hooks/useCloudCover'
import {Progress, Stack, Text, Title} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Cloud cover detail card component.
 *
 * Displays current cloud cover percentage with visual indicator.
 */
export default function CloudCover() {
  const {cloudCover, description} = useCloudCover()

  return (
    <DetailCard delay={0}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Cloud Cover
        </Text>

        <Icon icon="cloudy" alt="cloud coverage" />

        <Stack gap="xs">
          <Title order={2} size="xl">
            {cloudCover}%
          </Title>
          <Progress
            value={cloudCover}
            size="sm"
            radius="sm"
            aria-label={`Cloud cover: ${cloudCover}%`}
          />
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Stack>
    </DetailCard>
  )
}
