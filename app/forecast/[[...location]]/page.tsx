import CityPage from '@/components/Pages/CityPage'
import {DEFAULT_LOCATION, POPULAR_CITIES} from '@/lib/constants'
import {createLocationSlug} from '@/lib/utils/slug'
import {Metadata} from 'next'
import {notFound} from 'next/navigation'

interface Props {
  params: Promise<{location?: string[]}>
}

/**
 * Generate static params for popular cities at build time.
 */
export async function generateStaticParams() {
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  return allLocations.map((city) => ({
    location: createLocationSlug(city).split('/')
  }))
}

/**
 * Generate metadata for city page.
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {location} = await params

  if (!location || location.length === 0) {
    return {
      title: 'Local Weather',
      description: 'Current weather conditions and forecasts for your location.'
    }
  }

  const slug = location.join('/')

  // Try to find matching city from popular cities + default
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  const matchingCity = allLocations.find(
    (city) => createLocationSlug(city) === slug
  )

  if (matchingCity) {
    const title = `${matchingCity.display} Weather`
    const description = `Current weather conditions and forecast for ${matchingCity.display}. View temperature, precipitation, wind, humidity, and more.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website'
      }
    }
  }

  // For dynamic locations, extract city name from first segment
  const cityName = location[0]
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const title = `${cityName || 'Location'} Weather`
  const description = `Current weather conditions and forecast for ${cityName || 'this location'}. View temperature, precipitation, wind, humidity, and more.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    }
  }
}

/**
 * City weather page component.
 */
export default async function LocationPage({params}: Readonly<Props>) {
  const {location} = await params

  // Validate location format
  if (!location || location.length === 0) {
    notFound()
  }

  // Expected format: [city, state, country, lat, lon] - minimum 5 segments
  if (location.length < 5) {
    notFound()
  }

  // Validate that last two segments are valid coordinates
  const latStr = location.at(-2)
  const lonStr = location.at(-1)

  if (!latStr || !lonStr) {
    notFound()
  }

  const lat = Number(latStr)
  const lon = Number(lonStr)

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    notFound()
  }

  return <CityPage slug={location} />
}
