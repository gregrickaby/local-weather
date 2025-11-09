import type {Location} from '@/lib/types'

/**
 * Cache duration constants (in seconds).
 */
export const CACHE_DURATION = {
  WEATHER: 300, // 5 minutes
  AIR_QUALITY: 600, // 10 minutes
  PLACES: 60 // 1 minute
} as const

/**
 * Default location (Enterprise, Alabama).
 */
export const DEFAULT_LOCATION: Location = {
  id: 4060791,
  name: 'Enterprise',
  latitude: 31.31517,
  longitude: -85.85522,
  admin1: 'Alabama',
  country: 'United States',
  display: 'Enterprise, Alabama, United States'
}

/**
 * Popular cities for search suggestions.
 */
export const POPULAR_CITIES: Location[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.71427,
    longitude: -74.00597,
    admin1: 'New York',
    country: 'United States',
    display: 'New York, New York, United States'
  },
  {
    id: 5368361,
    name: 'Los Angeles',
    latitude: 34.05223,
    longitude: -118.24368,
    admin1: 'California',
    country: 'United States',
    display: 'Los Angeles, California, United States'
  },
  {
    id: 4887398,
    name: 'Chicago',
    latitude: 41.85003,
    longitude: -87.65005,
    admin1: 'Illinois',
    country: 'United States',
    display: 'Chicago, Illinois, United States'
  }
]

/**
 * Coordinate validation ranges.
 */
export const COORDINATE_LIMITS = {
  LAT_MIN: -90,
  LAT_MAX: 90,
  LON_MIN: -180,
  LON_MAX: 180
} as const

// Re-export config for convenience
export * from './config'
export * from './radar'
export * from './satellite'
