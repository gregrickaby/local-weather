import type {Location} from '@/lib/types'

/**
 * Convert a string to a URL-friendly slug.
 *
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug
 *
 * @example
 * createSlug('New York, New York, United States') // 'new-york-ny-united-states'
 * createSlug('Los Angeles, California, United States') // 'los-angeles-ca-united-states'
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim() // Trim whitespace first
    .replaceAll(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replaceAll(/\s+/g, '-') // Replace spaces with hyphens
    .replaceAll(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-/, '') // Remove leading hyphen
    .replace(/-$/, '') // Remove trailing hyphen
}

/**
 * Generate a slug from location data with coordinates.
 *
 * Format: {city}/{state}/{country}/{lat}/{lon}
 *
 * Coordinates are rounded to 2 decimal places (~1km precision) for cleaner URLs
 * while maintaining sufficient accuracy for weather queries.
 *
 * @param location - Location object
 * @returns URL-friendly slug path with coordinates
 *
 * @example
 * createLocationSlug({ name: 'Enterprise', admin1: 'Alabama', country: 'United States', latitude: 31.31517, longitude: -85.85522 })
 * // Returns: 'enterprise/alabama/united-states/31.32/-85.86'
 *
 * createLocationSlug({ name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.71427, longitude: -74.00597 })
 * // Returns: 'new-york/new-york/united-states/40.71/-74.01'
 */
export function createLocationSlug(location: Location): string {
  const citySlug = createSlug(location.name)
  const stateSlug = location.admin1 ? createSlug(location.admin1) : ''
  const countrySlug = createSlug(location.country)

  // Round coordinates to 2 decimal places for cleaner URLs
  const lat = location.latitude.toFixed(2)
  const lon = location.longitude.toFixed(2)

  // Build path segments
  return `${citySlug}/${stateSlug}/${countrySlug}/${lat}/${lon}`
}

/**
 * Parse a location slug to extract coordinates.
 *
 * URL Slug Format: {city}/{state}/{country}/{lat}/{lon}
 *
 * @param slug - URL slug path to parse (or path segments array)
 * @returns Object with slug and extracted coordinates
 *
 * @example
 * parseLocationSlug('enterprise/alabama/united-states/31.32/-85.86')
 * // Returns: { slug: '...', latitude: 31.32, longitude: -85.86 }
 *
 * parseLocationSlug(['enterprise', 'alabama', 'united-states', '31.32', '-85.86'])
 * // Returns: { slug: '...', latitude: 31.32, longitude: -85.86 }
 *
 * parseLocationSlug('invalid-slug')
 * // Returns: { slug: 'invalid-slug', latitude: null, longitude: null }
 */
export function parseLocationSlug(slug: string | string[]): {
  slug: string
  latitude: number | null
  longitude: number | null
} {
  // Convert to array if string
  const segments = Array.isArray(slug) ? slug : slug.split('/')
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug

  // Expected format: [city, state, country, lat, lon]
  if (segments.length < 5) {
    return {slug: slugStr, latitude: null, longitude: null}
  }

  // Extract coordinates from last two segments
  const latStr = segments.at(-2)!
  const lonStr = segments.at(-1)!

  const lat = Number(latStr)
  const lon = Number(lonStr)

  // Validate coordinates are valid numbers and in valid ranges
  const isValidLat = !Number.isNaN(lat) && lat >= -90 && lat <= 90
  const isValidLon = !Number.isNaN(lon) && lon >= -180 && lon <= 180

  if (isValidLat && isValidLon) {
    return {
      slug: slugStr,
      latitude: lat,
      longitude: lon
    }
  }

  // Invalid format - no valid coordinates found
  return {
    slug: slugStr,
    latitude: null,
    longitude: null
  }
}
