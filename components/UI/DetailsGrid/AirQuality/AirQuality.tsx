'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetAirQualityQuery} from '@/lib/store/services/airQualityApi'
import {Badge, Center, RingProgress, Stack, Text} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Air Quality detail card component.
 *
 * Displays current air quality index with colored badge and ring progress.
 */
export default function AirQuality() {
  const location = useAppSelector((state) => state.preferences.location)
  const {data} = useGetAirQualityQuery(location, {
    skip: !location
  })

  const aqi = data?.current?.us_aqi || 0
  const {level, color} = getAQILevel(aqi)

  return (
    <DetailCard delay={200}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Air Quality
        </Text>

        <Center>
          <RingProgress
            size={120}
            thickness={12}
            sections={[{value: (aqi / 300) * 100, color}]}
            label={
              <Center>
                <Stack gap={0} align="center">
                  <Text size="xl" fw={600}>
                    {Math.round(aqi)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    AQI
                  </Text>
                </Stack>
              </Center>
            }
          />
        </Center>

        <Badge color={color} size="lg" fullWidth>
          {level}
        </Badge>

        <Text size="xs" c="dimmed" ta="center">
          {getAQIDescription(aqi)}
        </Text>
      </Stack>
    </DetailCard>
  )
}

/**
 * Get AQI level and color based on US AQI scale.
 */
function getAQILevel(aqi: number): {level: string; color: string} {
  if (aqi <= 50) return {level: 'Good', color: 'green'}
  if (aqi <= 100) return {level: 'Moderate', color: 'yellow'}
  if (aqi <= 150) return {level: 'Unhealthy for Sensitive', color: 'orange'}
  if (aqi <= 200) return {level: 'Unhealthy', color: 'red'}
  if (aqi <= 300) return {level: 'Very Unhealthy', color: 'grape'}
  return {level: 'Hazardous', color: 'red.9'}
}

/**
 * Get AQI health description.
 */
function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Air quality is satisfactory'
  if (aqi <= 100) return 'Acceptable for most people'
  if (aqi <= 150) return 'Unhealthy for sensitive groups'
  if (aqi <= 200) return 'Everyone may experience effects'
  if (aqi <= 300) return 'Health alert: everyone affected'
  return 'Health warning of emergency conditions'
}
