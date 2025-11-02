'use client'

import classes from '@/app/Page.module.css'
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
import {useAppDispatch} from '@/lib/store/hooks'
import {setLocation} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {Skeleton, Stack} from '@mantine/core'
import {useEffect} from 'react'

interface CityPageProps {
  location: Location
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
export default function CityPage({location}: CityPageProps) {
  const dispatch = useAppDispatch()
  const {data: weather, isLoading} = useWeatherData()

  // Update Redux state with the location from route params
  useEffect(() => {
    dispatch(setLocation(location))
  }, [dispatch, location])

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
