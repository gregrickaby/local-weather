import {DEFAULT_LOCATION, POPULAR_CITIES} from '@/lib/constants'
import config from '@/lib/constants/config'
import {createLocationSlug} from '@/lib/utils/slug'
import type {MetadataRoute} from 'next'

/**
 * Generate sitemap.xml via Next.js Metadata API.
 * Includes the home page and all pre-rendered city pages.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const allLocations = [...POPULAR_CITIES, DEFAULT_LOCATION]

  const cityEntries: MetadataRoute.Sitemap = allLocations.map((city) => ({
    url: `${config.siteUrl}forecast/${createLocationSlug(city)}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8
  }))

  return [
    {
      url: config.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1
    },
    ...cityEntries
  ]
}
