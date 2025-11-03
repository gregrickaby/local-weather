'use client'

import {useWindData} from '@/lib/hooks/useWindData'
import {Box, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Wind detail card component.
 *
 * Displays current wind speed, gusts, and direction with compass visualization.
 */
export default function Wind() {
  const {windSpeed, windGusts, windDirection, directionLabel, speedUnit} =
    useWindData()

  return (
    <DetailCard delay={0}>
      <Stack gap="md">
        <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
          Wind
        </Text>

        {/* Main content area */}
        <Stack gap="sm" align="center">
          {/* Compass visualization */}
          <Box style={{position: 'relative', width: 150, height: 150}}>
            {/* Cardinal direction labels - positioned outside the SVG */}
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              style={{
                position: 'absolute',
                top: -5,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              N
            </Text>
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              style={{
                position: 'absolute',
                right: -10,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              E
            </Text>
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              style={{
                position: 'absolute',
                bottom: -5,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              S
            </Text>
            <Text
              size="xs"
              fw={600}
              c="dimmed"
              style={{
                position: 'absolute',
                left: -10,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              W
            </Text>

            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{overflow: 'visible'}}
            >
              {/* Compass circle background */}
              <circle
                cx="75"
                cy="75"
                r="65"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.15"
                fill="none"
              />

              {/* Tick marks around the compass */}
              {Array.from({length: 72}).map((_, i) => {
                const angle = i * 5
                const isCardinal = angle % 90 === 0
                const isMajor = angle % 30 === 0

                let length = 5
                let width = 1
                let opacity = 0.15

                if (isCardinal) {
                  length = 15
                  width = 2
                  opacity = 0.5
                } else if (isMajor) {
                  length = 10
                  width = 1.5
                  opacity = 0.3
                }

                const rad = (angle * Math.PI) / 180
                const r1 = 65
                const r2 = 65 - length

                return (
                  <line
                    key={`tick-${angle}`}
                    x1={75 + r1 * Math.sin(rad)}
                    y1={75 - r1 * Math.cos(rad)}
                    x2={75 + r2 * Math.sin(rad)}
                    y2={75 - r2 * Math.cos(rad)}
                    stroke="currentColor"
                    strokeWidth={width}
                    opacity={opacity}
                  />
                )
              })}

              {/* Wind direction indicator - shows where wind is COMING FROM */}
              <g transform={`rotate(${windDirection + 180} 75 75)`}>
                {/* Arrow pointing inward from outer edge toward center */}
                <path
                  d="M75 12 L71 25 L75 22 L79 25 Z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M75 22 L75 50"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </g>

              {/* Center display */}
              <text
                x="75"
                y="79"
                textAnchor="middle"
                fontSize="18"
                fontWeight="500"
                fill="currentColor"
              >
                {windSpeed}
              </text>
              <text
                x="75"
                y="92"
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                opacity="0.6"
              >
                mph
              </text>
            </svg>
          </Box>

          {/* Bottom info */}
          <Stack gap={4} align="flex-start" style={{width: '100%'}}>
            <Text size="sm" c="dimmed">
              Gusts
            </Text>
            <Text size="lg" fw={400}>
              {windGusts} {speedUnit}
            </Text>
          </Stack>

          <Stack gap={4} align="flex-start" style={{width: '100%'}}>
            <Text size="sm" c="dimmed">
              Direction
            </Text>
            <Text size="lg" fw={400}>
              {Math.round(windDirection)}° {directionLabel}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </DetailCard>
  )
}
