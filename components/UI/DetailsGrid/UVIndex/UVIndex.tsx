'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Box, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * UV Index detail card component.
 *
 * Displays UV index with Apple Weather-style gradient bar and indicator.
 */
export default function UVIndex() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {location, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  // Current UV index (what's happening now)
  const currentUV = Math.round(weather?.current?.uv_index || 0)

  // Calculate position on 0-11 scale
  const uvScale = 11
  const indicatorPercent = (currentUV / uvScale) * 100

  const {level, description} = getUVInfo(currentUV)

  return (
    <DetailCard delay={50}>
      <Stack gap="md">
        <Text size="xs" c="dimmed" tt="uppercase">
          UV Index
        </Text>

        {/* Large UV number and level */}
        <Box>
          <Text size="48px" fw={700} lh={1}>
            {currentUV}
          </Text>
          <Text size="lg" fw={500}>
            {level}
          </Text>
        </Box>

        {/* Gradient UV bar with indicator */}
        <Box style={{position: 'relative', paddingTop: 8, paddingBottom: 8}}>
          {/* Gradient bar (green → yellow → orange → red → pink) */}
          <Box
            style={{
              height: 6,
              borderRadius: 3,
              background:
                'linear-gradient(to right, #22c55e 0%, #eab308 30%, #f97316 60%, #ef4444 80%, #ec4899 100%)',
              position: 'relative'
            }}
          />

          {/* Circle indicator */}
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: `${indicatorPercent}%`,
              width: 14,
              height: 14,
              backgroundColor: 'white',
              border: '3px solid var(--mantine-color-gray-7)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 2
            }}
          />
        </Box>

        {/* Description */}
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get UV level and description based on UV index.
 */
function getUVInfo(uv: number): {level: string; description: string} {
  if (uv <= 2) return {level: 'Low', description: 'Low for the rest of the day'}
  if (uv <= 5)
    return {level: 'Moderate', description: 'Some protection required'}
  if (uv <= 7) return {level: 'High', description: 'Protection essential'}
  if (uv <= 10)
    return {level: 'Very High', description: 'Extra protection needed'}
  return {level: 'Extreme', description: 'Stay inside if possible'}
}
