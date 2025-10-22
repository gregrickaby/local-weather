'use client'

import classes from '@/app/Page.module.css'
import Footer from '@/components/Layout/Footer/Footer'
import Header from '@/components/Layout/Header/Header'
import Alerts from '@/components/UI/Alerts/Alerts'
import BackToTop from '@/components/UI/BackToTop/BackToTop'
import CurrentConditions from '@/components/UI/CurrentConditions/CurrentConditions'
import Forecast from '@/components/UI/Forecast/Forecast'
import Search from '@/components/UI/Search/Search'
import {useAppSelector} from '@/lib/store/hooks'
import {useGetWeatherQuery} from '@/lib/store/services/weatherApi'
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
  const location = useAppSelector((state) => state.preferences.location)
  const mounted = useAppSelector((state) => state.preferences.mounted)

  const {data: weather, isLoading} = useGetWeatherQuery(location, {
    skip: !mounted || !location
  })

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
