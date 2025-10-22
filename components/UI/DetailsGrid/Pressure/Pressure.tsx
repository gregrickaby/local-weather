'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {formatPressure} from '@/lib/utils/helpers'
import {Box, Flex, Progress, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Pressure detail card component.
 *
 * Displays current atmospheric pressure with gauge visualization.
 * Shows inHg for Fahrenheit users, hPa for Celsius users.
 */
export default function Pressure() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const pressureHpa = weather?.current?.pressure_msl || 1013
  const {value: pressureValue, unit: pressureUnit} = formatPressure(
    tempUnit,
    pressureHpa
  )

  // Normalize pressure to 0-100 scale matching description thresholds
  // For hPa: range 1000-1040 (Very low < 1000, Low 1000-1010, Normal 1010-1020, High >= 1020)
  // For inHg: range 29.53-30.71 (converted from hPa range)
  const normalizedValue =
    tempUnit === 'f'
      ? Math.max(
          0,
          Math.min(
            100,
            ((Number.parseFloat(pressureValue) - 29.53) / 1.18) * 100
          )
        )
      : Math.max(0, Math.min(100, ((pressureHpa - 1000) / 40) * 100))

  return (
    <DetailCard delay={300}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Pressure
        </Text>

        <Box px="md">
          <Stack gap="xs">
            <Text size="xl" fw={600} ta="center">
              {pressureValue}
              <Text component="span" size="sm" c="dimmed" ml={4}>
                {pressureUnit}
              </Text>
            </Text>

            <Progress
              value={normalizedValue}
              color="indigo"
              size="lg"
              radius="xl"
            />

            <Flex justify="space-between">
              <Text size="xs" c="dimmed">
                Low
              </Text>
              <Text size="xs" c="dimmed">
                High
              </Text>
            </Flex>
          </Stack>
        </Box>

        <Text size="sm" c="dimmed" ta="center">
          {getPressureDescription(pressureHpa)}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get pressure trend description (uses hPa values regardless of display unit).
 */
function getPressureDescription(pressureHpa: number): string {
  if (pressureHpa >= 1020) return 'High pressure'
  if (pressureHpa >= 1010) return 'Normal pressure'
  if (pressureHpa >= 1000) return 'Low pressure'
  return 'Very low pressure'
}
