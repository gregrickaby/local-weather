import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {parseLocationSlug} from '@/lib/utils/slug'
import {POPULAR_CITIES} from '@/lib/constants'
import CityPage from '@/components/Pages/CityPage'
import type {Location} from '@/lib/types'

interface Props {
  params: Promise<{location: string}>
}

/**
 * Resolve location from slug using geocoding API.
 */
async function resolveLocation(slug: string): Promise<Location | null> {
  const {searchTerm} = parseLocationSlug(slug)

  try {
    const params = new URLSearchParams({
      name: searchTerm,
      count: '1',
      language: 'en',
      format: 'json'
    })

    const url = `https://geocoding-api.open-meteo.com/v1/search?${params}`
    const response = await fetch(url, {
      next: {revalidate: 3600} // Cache for 1 hour
    })

    if (!response.ok) {
      return null
    }

    const json = await response.json()

    if (!json.results || json.results.length === 0) {
      return null
    }

    const result = json.results[0]
    return {
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      admin1: result.admin1,
      country: result.country,
      display: [result.name, result.admin1, result.country]
        .filter(Boolean)
        .join(', ')
    }
  } catch (error) {
    console.error('[resolveLocation] Error:', error)
    return null
  }
}

/**
 * Generate static params for popular cities at build time.
 */
export async function generateStaticParams() {
  return POPULAR_CITIES.map((city) => ({
    location: city.display
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }))
}

/**
 * Generate metadata for city page.
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {location} = await params
  const locationData = await resolveLocation(location)

  if (!locationData) {
    return {
      title: 'Location Not Found'
    }
  }

  const title = `${locationData.display} Weather`
  const description = `Current weather conditions and forecast for ${locationData.display}. View temperature, precipitation, wind, humidity, and more.`

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
  const {location} = await params
  const locationData = await resolveLocation(location)

  if (!locationData) {
    notFound()
  }

  return <CityPage location={locationData} />
}
