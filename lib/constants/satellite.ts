/**
 * Satellite imagery configuration constants.
 */

/**
 * Satellite image refresh interval in milliseconds (5 minutes).
 * Most geostationary satellites update every 5-15 minutes.
 */
export const SATELLITE_REFRESH_INTERVAL = 300000

/**
 * GOES-East (GOES-16) sectors for Eastern US, Atlantic, Caribbean.
 * Coverage: ~140°W to 20°W longitude
 */
export const GOES_EAST_SECTORS = {
  FULL_DISK: {
    name: 'Full Disk',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR'
  },
  CONUS: {
    name: 'Continental US',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/CONUS/GEOCOLOR'
  },
  SECTOR_NE: {
    name: 'Northeast',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/ne/GEOCOLOR'
  },
  SECTOR_SE: {
    name: 'Southeast',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/se/GEOCOLOR'
  },
  SECTOR_GLS: {
    name: 'Great Lakes',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/gls/GEOCOLOR'
  },
  SECTOR_GM: {
    name: 'Gulf of Mexico',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/gm/GEOCOLOR'
  },
  SECTOR_CAR: {
    name: 'Caribbean',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/car/GEOCOLOR'
  }
} as const

/**
 * GOES-West (GOES-18) sectors for Western US, Pacific.
 * Coverage: ~180°W to 100°W longitude
 */
export const GOES_WEST_SECTORS = {
  FULL_DISK: {
    name: 'Full Disk',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/FD/GEOCOLOR'
  },
  CONUS: {
    name: 'Continental US',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/CONUS/GEOCOLOR'
  },
  SECTOR_PSW: {
    name: 'Pacific Southwest',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/psw/GEOCOLOR'
  },
  SECTOR_PNW: {
    name: 'Pacific Northwest',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/pnw/GEOCOLOR'
  },
  SECTOR_NR: {
    name: 'Northern Rockies',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/nr/GEOCOLOR'
  },
  SECTOR_SR: {
    name: 'Southern Rockies',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/sr/GEOCOLOR'
  },
  SECTOR_SP: {
    name: 'South Pacific',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/sp/GEOCOLOR'
  },
  SECTOR_NP: {
    name: 'North Pacific',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/np/GEOCOLOR'
  }
} as const

/**
 * Himawari-8/9 (Japanese satellite) for Asia-Pacific region.
 * Coverage: 80°E to 160°W longitude
 */
export const HIMAWARI_SECTORS = {
  FULL_DISK: {
    name: 'Asia-Pacific',
    url: 'https://www.data.jma.go.jp/mscweb/data/himawari/img/fd/fd_trc_'
  }
} as const

/**
 * GOES-East Full Disk sector.
 * Provides complete view of Western Hemisphere including Atlantic Ocean, Europe, Africa, and Americas.
 * Used for Europe and other regions between GOES-East and GOES-West coverage.
 */
export const GOES_FULL_DISK = {
  name: 'Full Disk',
  satellite: 'GOES-East',
  url: 'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/'
} as const

/**
 * Latest image filename pattern for GOES GeoColor.
 */
export const LATEST_IMAGE_FILENAME = 'latest.jpg'

/**
 * Satellite coverage regions based on longitude.
 */
export const SATELLITE_REGIONS = {
  GOES_WEST: {min: -180, max: -100},
  GOES_EAST: {min: -140, max: -20},
  METEOSAT: {min: -80, max: 80},
  HIMAWARI: {min: 80, max: 200}
} as const
