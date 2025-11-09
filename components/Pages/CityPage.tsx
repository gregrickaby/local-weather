'use client'

import classes from '@/app/Page.module.css'
import Footer from '@/components/Layout/Footer/Footer'
import Header from '@/components/Layout/Header/Header'
import BackToTop from '@/components/UI/BackToTop/BackToTop'
import CurrentConditions from '@/components/UI/CurrentConditions/CurrentConditions'
import DetailsGrid from '@/components/UI/DetailsGrid/DetailsGrid'
import Forecast from '@/components/UI/Forecast/Forecast'
import Radar from '@/components/UI/Radar/Radar'
import Satellite from '@/components/UI/Satellite/Satellite'
import Search from '@/components/UI/Search/Search'
import Settings from '@/components/UI/Settings/Settings'
import {useCityPageLocation} from '@/lib/hooks/useCityPageLocation'
import {useWeatherData} from '@/lib/hooks/useWeatherData'
import {Alert, Grid, Skeleton, Stack} from '@mantine/core'

interface CityPageProps {
  slug: string | string[]
}

/**
 * Loading skeleton component.
 */
function WeatherSkeleton() {
  return (
    <Stack align="center" gap="lg">
      <Skeleton height={40} width={200} />
      <Skeleton height={120} width={150} />
      <Skeleton height={300} width="100%" mt="xl" />
      <Skeleton height={400} width="100%" />
    </Stack>
  )
}

/**
 * City weather page component.
 *
 * Displays weather information for a specific city/location.
 */
export default function CityPage({slug}: Readonly<CityPageProps>) {
  const {locationResolved, locationError} = useCityPageLocation({
    slug
  })
  const {data: weather, isLoading: isWeatherLoading} = useWeatherData()

  // Show error state if location couldn't be resolved
  if (locationError) {
    return (
      <div className={classes.container}>
        <Header />
        <main className={classes.main}>
          <div className={classes.search}>
            <Search />
            <Settings />
          </div>
          <Alert color="red" title="Location Not Found">
            This location could not be found. Please search for a location using
            the search bar above.
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Header />
      <main className={classes.main}>
        <div className={classes.search}>
          <Search />
          <Settings />
        </div>
        {!locationResolved || isWeatherLoading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <Stack gap="xl" className={classes.content}>
            <CurrentConditions />
            <DetailsGrid />
            <Grid gutter="xl">
              <Grid.Col span={{base: 12, md: 6}}>
                <Radar />
              </Grid.Col>
              <Grid.Col span={{base: 12, md: 6}}>
                <Satellite />
              </Grid.Col>
            </Grid>
            <Forecast />
          </Stack>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
