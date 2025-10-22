'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {formatTemperature} from '@/lib/utils/helpers'
import {Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Feels Like detail card component.
 *
 * Displays apparent temperature (how the temperature feels).
 */
export default function FeelsLike() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const unit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {
      latitude: location.latitude,
      longitude: location.longitude,
      tempUnit: unit
    },
    {
      skip: !mounted || !location
    }
  )

  const feelsLike = weather?.current?.apparent_temperature || 0
  const actual = weather?.current?.temperature_2m || 0

  return (
    <DetailCard delay={350}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Feels Like
        </Text>

        <Text size="xl" fw={600}>
          {formatTemperature(unit, feelsLike)}
        </Text>

        <Text size="sm" c="dimmed">
          {getFeelsLikeDescription(feelsLike, actual)}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get feels like comparison description.
 */
function getFeelsLikeDescription(feels: number, actual: number): string {
  const diff = feels - actual

  if (Math.abs(diff) < 2) return 'Similar to actual temperature'
  if (diff > 5) return `Feels much warmer (${Math.round(diff)}° warmer)`
  if (diff > 0) return `Feels ${Math.round(diff)}° warmer`
  if (diff < -5)
    return `Feels much cooler (${Math.round(Math.abs(diff))}° cooler)`
  return `Feels ${Math.round(Math.abs(diff))}° cooler`
}
