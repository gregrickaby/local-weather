'use client'

import {useHumidity} from '@/lib/hooks/useHumidity'
import {Center, RingProgress, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Humidity detail card component.
 *
 * Displays current humidity percentage with ring progress and dew point.
 */
export default function Humidity() {
  const {humidity, dewPoint, description} = useHumidity()

  return (
    <DetailCard delay={150}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Humidity
        </Text>

        <Center>
          <RingProgress
            size={120}
            thickness={12}
            sections={[{value: humidity, color: 'blue'}]}
            label={
              <Center>
                <Text size="xl" fw={600}>
                  {humidity}%
                </Text>
              </Center>
            }
          />
        </Center>

        <Text size="sm" c="dimmed" ta="center">
          Dew point: {dewPoint}°
        </Text>

        <Text size="xs" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}
