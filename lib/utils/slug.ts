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

// Common country names that might appear in slugs
const KNOWN_COUNTRIES = [
  'united states',
  'united kingdom',
  'new zealand',
  'south korea',
  'costa rica',
  'el salvador',
  'saudi arabia',
  'united arab emirates',
  'south africa',
  'sri lanka',
  'hong kong',
  'czech republic',
  'dominican republic',
  // Single word countries
  'usa',
  'uk',
  'canada',
  'mexico',
  'brazil',
  'australia',
  'france',
  'germany',
  'italy',
  'spain',
  'japan',
  'china',
  'india',
  'ireland',
  'netherlands',
  'belgium',
  'switzerland',
  'austria',
  'denmark',
  'sweden',
  'norway',
  'finland',
  'poland',
  'argentina',
  'chile',
  'colombia',
  'peru',
  'venezuela',
  'ecuador',
  'paraguay',
  'uruguay',
  'panama',
  'guatemala',
  'honduras',
  'nicaragua',
  'belize',
  'jamaica',
  'bahamas',
  'cuba',
  'haiti',
  'dominica',
  'grenada',
  'barbados',
  'trinidad',
  'tobago',
  'iceland',
  'portugal',
  'greece',
  'turkey',
  'russia',
  'ukraine',
  'romania',
  'bulgaria',
  'serbia',
  'croatia',
  'bosnia',
  'slovenia',
  'hungary',
  'czech',
  'slovakia',
  'latvia',
  'estonia',
  'lithuania',
  'malta',
  'cyprus',
  'egypt',
  'libya',
  'algeria',
  'morocco',
  'tunisia',
  'sudan',
  'ethiopia',
  'kenya',
  'tanzania',
  'uganda',
  'rwanda',
  'cameroon',
  'nigeria',
  'ghana',
  'ivory',
  'senegal',
  'namibia',
  'botswana',
  'zimbabwe',
  'zambia',
  'malawi',
  'mozambique',
  'madagascar',
  'mauritius',
  'seychelles',
  'djibouti',
  'somalia',
  'oman',
  'yemen',
  'bahrain',
  'qatar',
  'kuwait',
  'iraq',
  'iran',
  'afghanistan',
  'pakistan',
  'nepal',
  'bhutan',
  'bangladesh',
  'myanmar',
  'thailand',
  'cambodia',
  'laos',
  'vietnam',
  'malaysia',
  'singapore',
  'indonesia',
  'philippines',
  'timor',
  'papua',
  'fiji',
  'samoa',
  'tonga',
  'vanuatu',
  'kiribati',
  'nauru',
  'palau',
  'marshall',
  'micronesia',
  'guam',
  'brunei',
  'mongolia',
  'kazakhstan',
  'uzbekistan',
  'turkmenistan',
  'tajikistan',
  'kyrgyzstan',
  'azerbaijan',
  'armenia',
  'georgia',
  'israel',
  'palestine',
  'lebanon',
  'syria',
  'jordan',
  'palestine',
  'albania',
  'macedonia',
  'kosovo',
  'montenegro'
].sort((a, b) => b.length - a.length) // Sort by length descending for accurate matching

/**
 * Parse a location slug to extract potential location components.
 *
 * This is a best-effort parsing - actual location resolution should
 * use the geocoding API. Open-Meteo works best when we exclude the
 * country from the search term.
 *
 * URL Slug Format: {city}-{admin}-{country}
 * Search Strategy: Remove known country patterns and search with remainder
 *
 * @param slug - URL slug to parse
 * @returns Object with parsed components
 *
 * @example
 * parseLocationSlug('london-england-united-kingdom')
 * // Returns: { slug: 'london-england-united-kingdom', searchTerm: 'london england' }
 *
 * parseLocationSlug('new-york-new-york-united-states')
 * // Returns: { slug: 'new-york-new-york-united-states', searchTerm: 'new york new york' }
 *
 * parseLocationSlug('paris-france')
 * // Returns: { slug: 'paris-france', searchTerm: 'paris' }
 */
export function parseLocationSlug(slug: string): {
  slug: string
  searchTerm: string
} {
  const normalized = slug.replaceAll('-', ' ').trim()

  // Try to remove a known country from the end of the search term
  for (const country of KNOWN_COUNTRIES) {
    if (normalized.toLowerCase().endsWith(country)) {
      const searchTerm = normalized.slice(0, -country.length).trim()
      if (searchTerm.length > 0) {
        return {slug, searchTerm}
      }
    }
  }

  // If no country found, remove the last word (fallback)
  const parts = normalized.split(' ')
  if (parts.length > 1) {
    const searchTerm = parts.slice(0, -1).join(' ')
    return {slug, searchTerm}
  }

  // Single word slug - use as-is
  return {
    slug,
    searchTerm: normalized
  }
}
