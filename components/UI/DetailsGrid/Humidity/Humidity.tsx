'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Center, RingProgress, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Humidity detail card component.
 *
 * Displays current humidity percentage with ring progress and dew point.
 */
export default function Humidity() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const humidity = Math.round(weather?.current?.relative_humidity_2m || 0)
  const dewPoint = Math.round(weather?.current?.dew_point_2m || 0)

  return (
    <DetailCard delay={150}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Humidity
        </Text>

        <Center>
          <RingProgress
            size={120}
            thickness={12}
            sections={[{value: humidity, color: 'blue'}]}
            label={
              <Center>
                <Text size="xl" fw={600}>
                  {humidity}%
                </Text>
              </Center>
            }
          />
        </Center>

        <Text size="sm" c="dimmed" ta="center">
          Dew point: {dewPoint}°
        </Text>

        <Text size="xs" c="dimmed" ta="center">
          {getHumidityDescription(humidity)}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get humidity comfort description.
 */
function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry conditions'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Slightly humid'
  return 'Very humid'
}
