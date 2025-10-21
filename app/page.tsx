'use client'

import classes from '@/app/Page.module.css'
import Alerts from '@/components/Alerts'
import BackToTop from '@/components/BackTopTop'
import CurrentConditions from '@/components/CurrentConditions'
import Footer from '@/components/Footer'
import Forecast from '@/components/Forecast'
import Header from '@/components/Header'
import Search from '@/components/Search'
import {useWeatherContext} from '@/components/WeatherProvider'
import {Skeleton, Stack} from '@mantine/core'

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
 * Home page component.
 */
export default function HomePage() {
  const {isLoading, weather} = useWeatherContext()

  return (
    <div className={classes.container}>
      <Header />
      <main className={classes.main}>
        <div className={classes.search}>
          <Search />
        </div>
        {isLoading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <>
            <CurrentConditions />
            <Forecast />
            <Alerts />
          </>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
