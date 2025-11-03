'use client'

import {useWeatherData} from '@/lib/hooks/useWeatherData'
import {Card, SimpleGrid, Skeleton, Stack} from '@mantine/core'
import AirQuality from './AirQuality/AirQuality'
import FeelsLike from './FeelsLike/FeelsLike'
import Humidity from './Humidity/Humidity'
import MoonPhase from './MoonPhase/MoonPhase'
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
  const {data: weather, isLoading} = useWeatherData()

  const skeletonCards = [
    'wind',
    'uv',
    'sunrise',
    'humidity',
    'air',
    'visibility',
    'pressure',
    'feels',
    'moon'
  ]

  return (
    <SimpleGrid
      cols={{base: 2, sm: 2, md: 3, lg: 4}}
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
          <FeelsLike />
          <Wind />
          <UVIndex />
          <Humidity />
          <Pressure />
          <AirQuality />
          <Visibility />
          <SunriseSunset />
          <MoonPhase />
        </>
      )}
    </SimpleGrid>
  )
}
