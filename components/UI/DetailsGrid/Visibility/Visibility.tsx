'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Visibility detail card component.
 *
 * Displays current visibility distance.
 */
export default function Visibility() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {location, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const visibilityMeters = weather?.current?.visibility || 0

  // Open-Meteo can return theoretical max visibility (24km+)
  // But weather services typically cap at 10 miles / 16 km (standard reporting limit)
  // This matches what NOAA and other services show
  const cappedVisibilityMeters = Math.min(visibilityMeters, 16000)

  // Convert to miles (imperial) or kilometers (metric)
  const visibilityValue =
    tempUnit === 'c'
      ? Math.round(cappedVisibilityMeters / 1000) // km (whole number)
      : Math.round((cappedVisibilityMeters / 1000) * 0.621371) // mi (whole number)
  const visibilityUnit = tempUnit === 'c' ? 'km' : 'mi'

  return (
    <DetailCard delay={250}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Visibility
        </Text>

        <Text size="xl" fw={600}>
          {visibilityValue} {visibilityUnit}
        </Text>

        <Text size="sm" c="dimmed">
          {getVisibilityDescription(Number(visibilityValue), tempUnit === 'c')}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get visibility quality description.
 */
function getVisibilityDescription(distance: number, isMetric: boolean): string {
  if (isMetric) {
    // Distances in km
    if (distance >= 16) return 'Perfectly clear view'
    if (distance >= 10) return 'Good visibility'
    if (distance >= 5) return 'Moderate visibility'
    return 'Poor visibility'
  }

  // Distances in miles
  if (distance >= 10) return 'Perfectly clear view'
  if (distance >= 6) return 'Good visibility'
  if (distance >= 3) return 'Moderate visibility'
  if (distance >= 1) return 'Poor visibility'
  return 'Very limited visibility'
}
