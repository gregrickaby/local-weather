'use client'

import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
import {Card, SimpleGrid, Skeleton, Stack} from '@mantine/core'
import AirQuality from './AirQuality/AirQuality'
import FeelsLike from './FeelsLike/FeelsLike'
import Humidity from './Humidity/Humidity'
import Pressure from './Pressure/Pressure'
import SunriseSunset from './SunriseSunset/SunriseSunset'
import UVIndex from './UVIndex/UVIndex'
import Visibility from './Visibility/Visibility'
import Wind from './Wind/Wind'

/**
 * Loading skeleton for detail cards.
 */
function DetailCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Skeleton height={12} width="60%" />
        <Skeleton height={48} width="80%" />
        <Skeleton height={16} width="90%" />
      </Stack>
    </Card>
  )
}

/**
 * Details grid container component.
 *
 * Displays weather detail cards in a responsive grid layout.
 */
export default function DetailsGrid() {
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)

  const {data: weather, isLoading} = useGetWeatherQuery(
    {latitude: location.latitude, longitude: location.longitude, tempUnit},
    {
      skip: !mounted || !location
    }
  )

  const skeletonCards = [
    'wind',
    'uv',
    'sunrise',
    'humidity',
    'air',
    'visibility',
    'pressure',
    'feels'
  ]

  return (
    <SimpleGrid
      cols={{base: 2, sm: 2, md: 1}}
      spacing="md"
      verticalSpacing="md"
    >
      {isLoading || !weather ? (
        <>
          {skeletonCards.map((card) => (
            <DetailCardSkeleton key={card} />
          ))}
        </>
      ) : (
        <>
          <Wind />
          <UVIndex />
          <SunriseSunset />
          <Humidity />
          <AirQuality />
          <Visibility />
          <Pressure />
          <FeelsLike />
        </>
      )}
    </SimpleGrid>
  )
}
