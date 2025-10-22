'use client'

import {formatPressure} from '@/lib/helpers'
import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Center, RingProgress, Stack, Text} from '@mantine/core'
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
    {location, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const pressureHpa = weather?.current?.surface_pressure || 1013
  const {value: pressureValue, unit: pressureUnit} = formatPressure(
    tempUnit,
    pressureHpa
  )

  // Normalize pressure to 0-100 scale
  // For hPa: typical range 980-1040
  // For inHg: typical range 28.94-30.71 (converted from same hPa range)
  const normalizedValue =
    tempUnit === 'f'
      ? ((Number.parseFloat(pressureValue) - 28.94) / 1.77) * 100
      : ((pressureHpa - 980) / 60) * 100

  return (
    <DetailCard delay={300}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Pressure
        </Text>

        <Center>
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[{value: normalizedValue, color: 'indigo'}]}
            label={
              <Center>
                <Stack gap={0} align="center">
                  <Text size="xl" fw={600}>
                    {pressureValue}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {pressureUnit}
                  </Text>
                </Stack>
              </Center>
            }
          />
        </Center>

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
