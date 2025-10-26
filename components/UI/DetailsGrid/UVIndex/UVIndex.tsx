'use client'

import {useUVIndex} from '@/lib/hooks/useUVIndex'
import {Box, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * UV Index detail card component.
 *
 * Displays UV index with Apple Weather-style gradient bar and indicator.
 */
export default function UVIndex() {
  const {currentUV, indicatorPercent, level, description} = useUVIndex()

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
