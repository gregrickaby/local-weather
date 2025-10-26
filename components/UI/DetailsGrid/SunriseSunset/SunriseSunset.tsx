'use client'

import {useSunriseSunset} from '@/lib/hooks/useSunriseSunset'
import {Box, Group, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Sunrise/Sunset detail card component.
 *
 * Displays sunrise and sunset times with arc visualization.
 */
export default function SunriseSunset() {
  const {sunrise, sunset, sunPosition} = useSunriseSunset()

  return (
    <DetailCard delay={100}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Sunrise / Sunset
        </Text>

        {/* Sun arc visualization */}
        <Box style={{height: 80, position: 'relative'}}>
          <svg
            width="100%"
            height="80"
            viewBox="0 0 200 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background arc (horizon line) */}
            <path
              d="M 20 60 Q 100 10, 180 60"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />

            {/* Day progress arc */}
            <path
              d="M 20 60 Q 100 10, 180 60"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              strokeDasharray={`${sunPosition * 2.2} 220`}
            />

            {/* Sun indicator */}
            <circle
              cx={20 + sunPosition * 1.6}
              cy={60 - Math.sin((sunPosition / 100) * Math.PI) * 50}
              r="6"
              fill="currentColor"
              opacity="0.8"
            />

            {/* Sunrise marker */}
            <circle cx="20" cy="60" r="3" fill="currentColor" opacity="0.4" />

            {/* Sunset marker */}
            <circle cx="180" cy="60" r="3" fill="currentColor" opacity="0.4" />
          </svg>
        </Box>

        <Group justify="space-between">
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Sunrise
            </Text>
            <Text size="sm" fw={600}>
              {sunrise}
            </Text>
          </Stack>

          <Stack gap={0} align="flex-end">
            <Text size="xs" c="dimmed">
              Sunset
            </Text>
            <Text size="sm" fw={600}>
              {sunset}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </DetailCard>
  )
}
