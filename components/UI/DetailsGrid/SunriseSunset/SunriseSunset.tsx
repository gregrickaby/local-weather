'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Box, Group, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Sunrise/Sunset detail card component.
 *
 * Displays sunrise and sunset times with arc visualization.
 */
export default function SunriseSunset() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {location, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const sunrise = formatTime(weather?.daily?.sunrise?.[0])
  const sunset = formatTime(weather?.daily?.sunset?.[0])
  const sunPosition = calculateSunPosition(
    weather?.daily?.sunrise?.[0],
    weather?.daily?.sunset?.[0]
  )

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

/**
 * Format ISO time string to local time.
 */
function formatTime(isoString?: string): string {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

/**
 * Calculate sun position as percentage of day (0-100).
 */
function calculateSunPosition(sunriseISO?: string, sunsetISO?: string): number {
  if (!sunriseISO || !sunsetISO) return 50

  const now = new Date()
  const sunrise = new Date(sunriseISO)
  const sunset = new Date(sunsetISO)

  // If before sunrise, return 0
  if (now < sunrise) return 0

  // If after sunset, return 100
  if (now > sunset) return 100

  // Calculate percentage of day completed
  const totalDaylight = sunset.getTime() - sunrise.getTime()
  const elapsedDaylight = now.getTime() - sunrise.getTime()

  return (elapsedDaylight / totalDaylight) * 100
}
