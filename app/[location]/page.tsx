import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {createLocationSlug} from '@/lib/utils/slug'
import {POPULAR_CITIES, DEFAULT_LOCATION} from '@/lib/constants'
import CityPage from '@/components/Pages/CityPage'

interface Props {
  params: Promise<{location: string}>
}

/**
 * Generate static params for popular cities at build time.
 */
export async function generateStaticParams() {
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  return allLocations.map((city) => ({
    location: createLocationSlug(city)
  }))
}

/**
 * Generate metadata for city page.
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {location} = await params
  
  // Try to find matching city from popular cities + default
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]
  const matchingCity = allLocations.find(
    (city) => createLocationSlug(city) === location
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

  // For dynamic locations, use a generic title
  const formattedLocation = location
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const title = `${formattedLocation} Weather`
  const description = `Current weather conditions and forecast for ${formattedLocation}. View temperature, precipitation, wind, humidity, and more.`

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
export default async function LocationPage({params}: Props) {
  const {location: slug} = await params

  // Validate slug format (basic check)
  if (!slug || slug.length < 2 || !/^[a-z0-9-]+$/.test(slug)) {
    notFound()
  }

  return <CityPage slug={slug} />
}
