'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Box, Group, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Wind detail card component.
 *
 * Displays current wind speed, gusts, and direction with compass visualization.
 */
export default function Wind() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const windSpeed = Math.round(weather?.current?.wind_speed_10m || 0)
  const windGusts = Math.round(weather?.current?.wind_gusts_10m || 0)
  const windDirection = weather?.current?.wind_direction_10m || 0
  const directionLabel = getWindDirection(windDirection)
  const speedUnit = tempUnit === 'c' ? 'km/h' : 'mph'

  return (
    <DetailCard delay={0}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Wind
        </Text>

        <Group justify="space-between" align="center">
          {/* Compass visualization */}
          <Box style={{width: 60, height: 60}}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Compass circle */}
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
              />

              {/* Cardinal direction markers */}
              <text
                x="30"
                y="10"
                textAnchor="middle"
                fontSize="8"
                opacity="0.4"
              >
                N
              </text>
              <text
                x="50"
                y="33"
                textAnchor="middle"
                fontSize="8"
                opacity="0.4"
              >
                E
              </text>
              <text
                x="30"
                y="55"
                textAnchor="middle"
                fontSize="8"
                opacity="0.4"
              >
                S
              </text>
              <text
                x="10"
                y="33"
                textAnchor="middle"
                fontSize="8"
                opacity="0.4"
              >
                W
              </text>

              {/* Wind direction arrow */}
              <g transform={`rotate(${windDirection} 30 30)`}>
                <path
                  d="M30 10 L26 22 L30 20 L34 22 Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <line
                  x1="30"
                  y1="20"
                  x2="30"
                  y2="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </g>
            </svg>
          </Box>

          {/* Wind stats */}
          <Stack gap={0} align="flex-end">
            <Text size="xl" fw={600}>
              {windSpeed} {speedUnit}
            </Text>
            <Text size="sm" c="dimmed">
              Gusts {windGusts} {speedUnit}
            </Text>
          </Stack>
        </Group>

        <Text size="sm" c="dimmed">
          {directionLabel}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Convert wind direction degrees to cardinal direction.
 */
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
