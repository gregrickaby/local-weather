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
import {POPULAR_CITIES, DEFAULT_LOCATION} from '@/lib/constants'
import {useWeatherData} from '@/lib/hooks/useWeatherData'
import {useAppDispatch} from '@/lib/store/hooks'
import {useGetPlacesQuery} from '@/lib/store/services/placesApi'
import {setLocation} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {createLocationSlug, parseLocationSlug} from '@/lib/utils/slug'
import {Alert, Skeleton, Stack} from '@mantine/core'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

interface CityPageProps {
  slug: string
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
export default function CityPage({slug}: CityPageProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [locationResolved, setLocationResolved] = useState(false)
  const [locationError, setLocationError] = useState(false)

  // Try to find location in popular cities first
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  const knownLocation = allLocations.find(
    (city) => createLocationSlug(city) === slug
  )

  // If not in popular cities, try to resolve via geocoding
  const {searchTerm} = parseLocationSlug(slug)
  const {data: locations, isLoading: isSearching} = useGetPlacesQuery(
    searchTerm,
    {
      skip: !!knownLocation // Skip query if we already have the location
    }
  )

  const {data: weather, isLoading: isWeatherLoading} = useWeatherData()

  // Reset location resolution when slug changes
  useEffect(() => {
    setLocationResolved(false)
    setLocationError(false)
  }, [slug])

  // Update Redux state with the resolved location
  useEffect(() => {
    let locationToSet: Location | null = null

    if (knownLocation) {
      locationToSet = knownLocation
    } else if (locations && locations.length > 0) {
      // Use the first result from geocoding
      locationToSet = locations[0]
    }

    if (locationToSet && !locationResolved) {
      dispatch(setLocation(locationToSet))
      setLocationResolved(true)
      setLocationError(false)

      // If the resolved location has a different slug, redirect to correct URL
      const correctSlug = createLocationSlug(locationToSet)
      if (correctSlug !== slug) {
        router.replace(`/${correctSlug}`)
      }
    } else if (
      !knownLocation &&
      !isSearching &&
      (!locations || locations.length === 0) &&
      !locationResolved
    ) {
      // Location could not be resolved
      setLocationError(true)
    }
  }, [
    knownLocation,
    locations,
    isSearching,
    locationResolved,
    dispatch,
    slug,
    router
  ])

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
            We couldn&apos;t find weather data for &quot;{searchTerm}&quot;.
            Please try searching for a different location.
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
