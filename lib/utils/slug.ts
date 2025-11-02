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
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a slug from location data.
 *
 * Format: {name}-{admin1}-{country}
 *
 * @param location - Location object
 * @returns URL-friendly slug
 *
 * @example
 * createLocationSlug({ name: 'New York', admin1: 'New York', country: 'United States' })
 * // Returns: 'new-york-new-york-united-states'
 */
export function createLocationSlug(location: Location): string {
  const parts = [location.name, location.admin1, location.country].filter(
    Boolean
  )
  return createSlug(parts.join(' '))
}

/**
 * Parse a location slug to extract potential location components.
 *
 * This is a best-effort parsing - actual location resolution should
 * use the geocoding API.
 *
 * @param slug - URL slug to parse
 * @returns Object with parsed components
 *
 * @example
 * parseLocationSlug('new-york-ny-united-states')
 * // Returns: { slug: 'new-york-ny-united-states', searchTerm: 'new york ny' }
 */
export function parseLocationSlug(slug: string): {
  slug: string
  searchTerm: string
} {
  const normalized = slug.replace(/-/g, ' ').trim()
  // Remove common country names from search to improve geocoding accuracy
  const searchTerm = normalized
    .replace(
      /\b(united states|usa|united kingdom|uk|canada|australia|new zealand|ireland|france|germany|italy|spain|netherlands|belgium|switzerland|austria|denmark|sweden|norway|finland|poland|brazil|mexico|argentina|japan|china|india|south korea|korea)\b/gi,
      ''
    )
    .trim()

  return {
    slug,
    searchTerm: searchTerm || normalized
  }
}
