'use client'

import classes from '@/app/Page.module.css'
import skeletonClasses from '@/app/WeatherSkeleton.module.css'
import Footer from '@/components/Layout/Footer/Footer'
import Header from '@/components/Layout/Header/Header'
import BackToTop from '@/components/UI/BackToTop/BackToTop'
import CurrentConditions from '@/components/UI/CurrentConditions/CurrentConditions'
import DetailsGrid from '@/components/UI/DetailsGrid/DetailsGrid'
import Forecast from '@/components/UI/Forecast/Forecast'
import Radar from '@/components/UI/Radar/Radar'
import Search from '@/components/UI/Search/Search'
import Settings from '@/components/UI/Settings/Settings'
import {useWeatherData} from '@/lib/hooks/useWeatherData'
import {Card, Group, SimpleGrid, Skeleton, Stack} from '@mantine/core'

/**
 * Loading skeleton component.
 */
function WeatherSkeleton() {
  const detailCards = Array.from({length: 9}, (_, i) => (
    <Card
      key={i}
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      style={{minHeight: '180px'}}
    >
      <Stack gap="xs">
        <Skeleton height={12} width="60%" />
        <Skeleton height={48} width="80%" mt="xs" />
        <Skeleton height={16} width="90%" mt="xs" />
      </Stack>
    </Card>
  ))

  return (
    <Stack gap="xl">
      {/* CurrentConditions skeleton - hero section */}
      <div className={skeletonClasses.hero}>
        <Stack align="center" gap="xs">
          <Group gap="xs" align="center">
            <Skeleton height={48} width={48} circle />
            <Skeleton height={32} width={150} />
          </Group>
          <Skeleton height={120} width={200} mt="xs" />
          <Skeleton height={20} width={300} mt="xs" />
          <Skeleton height={24} width={180} mt="xs" />
        </Stack>
      </div>

      {/* DetailsGrid skeleton - 9 cards in responsive grid */}
      <SimpleGrid
        cols={{base: 2, sm: 2, md: 3, lg: 4}}
        spacing="md"
        verticalSpacing="md"
      >
        {detailCards}
      </SimpleGrid>

      {/* Radar skeleton */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <div>
            <Skeleton height={20} width={60} />
            <Skeleton height={12} width={150} mt={4} />
          </div>
          <Group gap="xs">
            <Skeleton height={34} width={34} circle />
            <Skeleton height={34} width={34} circle />
          </Group>
        </Group>
        <Skeleton height={300} width="100%" radius="md" />
      </Card>

      {/* Forecast skeleton */}
      <Stack gap="md">
        <Skeleton height={28} width={180} />
        <Group gap="md" wrap="nowrap" style={{overflowX: 'auto'}}>
          {Array.from({length: 8}, (_, i) => (
            <Card
              key={i}
              shadow="none"
              padding="md"
              radius="md"
              className={skeletonClasses.forecastCard}
            >
              <Stack gap="xs" align="center">
                <Skeleton height={16} width={60} />
                <Skeleton height={48} width={48} circle />
                <Skeleton height={24} width={50} />
                <Skeleton height={12} width={70} />
              </Stack>
            </Card>
          ))}
        </Group>
        <Skeleton height={28} width={180} mt="xl" />
        <Card
          shadow="none"
          padding="md"
          radius="md"
          className={skeletonClasses.forecastContainer}
        >
          <Stack gap="xs">
            {Array.from({length: 10}, (_, i) => (
              <Skeleton key={i} height={52} width="100%" />
            ))}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}

/**
 * Home page component.
 */
export default function HomePage() {
  const {data: weather, isLoading} = useWeatherData()

  return (
    <div className={classes.container}>
      <Header />
      <main className={classes.main}>
        <div className={classes.search}>
          <Search />
          <Settings />
        </div>
        {isLoading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <Stack gap="xl" className={classes.content}>
            <CurrentConditions />
            <DetailsGrid />
            <Radar />
            <Forecast />
          </Stack>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
