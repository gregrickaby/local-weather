/**
 * Satellite utility functions.
 *
 * Pure functions for determining appropriate satellite sectors based on location.
 */

import {
  GOES_EAST_SECTORS,
  GOES_WEST_SECTORS,
  HIMAWARI_SECTORS,
  LATEST_IMAGE_FILENAME
} from '@/lib/constants/satellite'

export interface SatelliteInfo {
  name: string
  url: string
  satellite: 'GOES-East' | 'GOES-West' | 'Himawari'
}

/**
 * Determine the best satellite sector based on latitude and longitude.
 *
 * Priority:
 * 1. Regional sectors for better detail (GOES sectors for specific US regions)
 * 2. CONUS for general US coverage
 * 3. Full disk for broader coverage
 * 4. International satellites for non-US locations
 *
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Satellite info with name, URL, and satellite identifier
 */
export function getSatelliteSector(
  latitude: number,
  longitude: number
): SatelliteInfo {
  // Western US and Pacific - GOES-West (GOES-18)
  if (longitude < -100) {
    return getGoesWestSector(latitude, longitude)
  }

  // Eastern US and Atlantic - GOES-East (GOES-16)
  if (longitude >= -100 && longitude < -20) {
    return getGoesEastSector(latitude, longitude)
  }

  // Europe (approx -10°W to 40°E, 35°N to 70°N) - Use GOES-East Full Disk which covers Atlantic and Europe
  if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
    return {
      name: 'Full Disk',
      url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR',
      satellite: 'GOES-East' as const
    }
  }

  // Asia-Pacific - Himawari
  if (longitude >= 80) {
    return {
      name: HIMAWARI_SECTORS.FULL_DISK.name,
      url: HIMAWARI_SECTORS.FULL_DISK.url,
      satellite: 'Himawari'
    }
  }

  // Fallback to GOES-East Full Disk for edge cases
  return {
    name: GOES_EAST_SECTORS.FULL_DISK.name,
    url: GOES_EAST_SECTORS.FULL_DISK.url,
    satellite: 'GOES-East'
  }
}

/**
 * Get appropriate GOES-West sector based on location.
 */
function getGoesWestSector(latitude: number, longitude: number): SatelliteInfo {
  // Pacific Northwest: Washington, Oregon, northern California, Idaho, Montana
  if (latitude > 42 && longitude < -110) {
    return {
      name: GOES_WEST_SECTORS.SECTOR_PNW.name,
      url: GOES_WEST_SECTORS.SECTOR_PNW.url,
      satellite: 'GOES-West'
    }
  }

  // Pacific Southwest: Southern California, Arizona, southern Nevada
  if (latitude < 42 && latitude > 32 && longitude < -110) {
    return {
      name: GOES_WEST_SECTORS.SECTOR_PSW.name,
      url: GOES_WEST_SECTORS.SECTOR_PSW.url,
      satellite: 'GOES-West'
    }
  }

  // Northern Rockies: Montana, Wyoming, northern Idaho, North Dakota
  if (latitude > 42 && longitude >= -110 && longitude < -100) {
    return {
      name: GOES_WEST_SECTORS.SECTOR_NR.name,
      url: GOES_WEST_SECTORS.SECTOR_NR.url,
      satellite: 'GOES-West'
    }
  }

  // Southern Rockies: Colorado, New Mexico, Utah, southern Wyoming
  if (
    latitude <= 42 &&
    latitude > 31 &&
    longitude >= -110 &&
    longitude < -100
  ) {
    return {
      name: GOES_WEST_SECTORS.SECTOR_SR.name,
      url: GOES_WEST_SECTORS.SECTOR_SR.url,
      satellite: 'GOES-West'
    }
  }

  // Default to GOES-West CONUS for general western US
  return {
    name: GOES_WEST_SECTORS.CONUS.name,
    url: GOES_WEST_SECTORS.CONUS.url,
    satellite: 'GOES-West'
  }
}

/**
 * Get appropriate GOES-East sector based on location.
 */
function getGoesEastSector(latitude: number, longitude: number): SatelliteInfo {
  // Northeast: New England, New York, Pennsylvania, New Jersey
  if (latitude > 40 && longitude > -80) {
    return {
      name: GOES_EAST_SECTORS.SECTOR_NE.name,
      url: GOES_EAST_SECTORS.SECTOR_NE.url,
      satellite: 'GOES-East'
    }
  }

  // Southeast: Florida, Georgia, South Carolina, North Carolina, Alabama
  if (latitude < 37 && latitude > 24 && longitude > -88) {
    return {
      name: GOES_EAST_SECTORS.SECTOR_SE.name,
      url: GOES_EAST_SECTORS.SECTOR_SE.url,
      satellite: 'GOES-East'
    }
  }

  // Great Lakes: Michigan, Wisconsin, Minnesota, Illinois, Indiana, Ohio
  if (latitude > 40 && longitude <= -80 && longitude > -95) {
    return {
      name: GOES_EAST_SECTORS.SECTOR_GLS.name,
      url: GOES_EAST_SECTORS.SECTOR_GLS.url,
      satellite: 'GOES-East'
    }
  }

  // Gulf of Mexico: Texas, Louisiana, Mississippi, Alabama coast
  if (latitude < 33 && latitude > 24 && longitude <= -88 && longitude > -100) {
    return {
      name: GOES_EAST_SECTORS.SECTOR_GM.name,
      url: GOES_EAST_SECTORS.SECTOR_GM.url,
      satellite: 'GOES-East'
    }
  }

  // Caribbean: Puerto Rico, US Virgin Islands, Caribbean islands
  if (latitude < 24 && latitude > 10 && longitude > -85) {
    return {
      name: GOES_EAST_SECTORS.SECTOR_CAR.name,
      url: GOES_EAST_SECTORS.SECTOR_CAR.url,
      satellite: 'GOES-East'
    }
  }

  // Default to GOES-East CONUS for general eastern US
  return {
    name: GOES_EAST_SECTORS.CONUS.name,
    url: GOES_EAST_SECTORS.CONUS.url,
    satellite: 'GOES-East'
  }
}

/**
 * Generate the full satellite image URL with timestamp for cache busting.
 *
 * @param baseUrl - Base URL for the satellite sector
 * @param satellite - Satellite identifier
 * @returns Complete image URL with timestamp
 */
export function generateSatelliteUrl(
  baseUrl: string,
  satellite: string
): string {
  const timestamp = Date.now()

  // Himawari uses a different filename pattern
  if (satellite === 'Himawari') {
    // Himawari updates every 10 minutes, use current hour/minute
    const now = new Date()
    const hour = String(now.getUTCHours()).padStart(2, '0')
    const minute = String(Math.floor(now.getUTCMinutes() / 10) * 10).padStart(
      2,
      '0'
    )
    return `${baseUrl}${hour}${minute}.png?t=${timestamp}`
  }

  // GOES satellites use standard pattern
  return `${baseUrl}/${LATEST_IMAGE_FILENAME}?t=${timestamp}`
}
