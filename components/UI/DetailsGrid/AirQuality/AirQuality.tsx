'use client'

import {useAirQuality} from '@/lib/hooks/useAirQuality'
import {Badge, Center, RingProgress, Stack, Text, Title} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Air Quality detail card component.
 *
 * Displays current air quality index with colored badge and ring progress.
 */
export default function AirQuality() {
  const {aqi, level, color, description} = useAirQuality()

  return (
    <DetailCard delay={200}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Air Quality
        </Text>

        <Center>
          <RingProgress
            size={120}
            thickness={12}
            sections={[{value: (aqi / 300) * 100, color}]}
            label={
              <Center>
                <Stack gap={0} align="center">
                  <Title order={2} size="xl">
                    {Math.round(aqi)}
                  </Title>
                  <Text size="xs" c="dimmed">
                    AQI
                  </Text>
                </Stack>
              </Center>
            }
          />
        </Center>

        <Badge color={color} size="lg" fullWidth>
          {level}
        </Badge>

        <Text size="xs" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}
