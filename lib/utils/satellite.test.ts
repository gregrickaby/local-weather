import {describe, expect, it} from 'vitest'
import {generateSatelliteUrl, getSatelliteSector} from './satellite'

describe('getSatelliteSector', () => {
  describe('GOES-West coverage', () => {
    it('should return Pacific Southwest sector for Los Angeles', () => {
      const result = getSatelliteSector(34.05, -118.24) // Los Angeles
      expect(result.satellite).toBe('GOES-West')
      expect(result.name).toBe('Pacific Southwest')
    })

    it('should return Pacific Northwest sector for Seattle', () => {
      const result = getSatelliteSector(47.61, -122.33) // Seattle
      expect(result.satellite).toBe('GOES-West')
      expect(result.name).toBe('Pacific Northwest')
    })

    it('should return Southern Rockies sector for Denver', () => {
      const result = getSatelliteSector(39.74, -104.99) // Denver
      expect(result.satellite).toBe('GOES-West')
      expect(result.name).toBe('Southern Rockies')
    })

    it('should return GOES-West sector for coordinates without specific region match', () => {
      const result = getSatelliteSector(35, -120)
      expect(result.satellite).toBe('GOES-West')
      // Falls into Pacific Southwest region
      expect(result.name).toBe('Pacific Southwest')
    })
  })

  describe('GOES-East coverage', () => {
    it('should return Southeast sector for Enterprise, AL', () => {
      const result = getSatelliteSector(31.32, -85.86) // Enterprise, AL
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Southeast')
    })

    it('should return Northeast sector for New York City', () => {
      const result = getSatelliteSector(40.71, -74.01) // NYC
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Northeast')
    })

    it('should return Great Lakes sector for Chicago', () => {
      const result = getSatelliteSector(41.88, -87.63) // Chicago
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Great Lakes')
    })

    it('should return Gulf of Mexico sector for Houston', () => {
      const result = getSatelliteSector(29.76, -95.37) // Houston
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Gulf of Mexico')
    })

    it('should return Caribbean sector for San Juan, PR', () => {
      const result = getSatelliteSector(18.47, -66.11) // San Juan
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Caribbean')
    })

    it('should return GOES-East sector for coordinates without specific region match', () => {
      const result = getSatelliteSector(35, -85)
      expect(result.satellite).toBe('GOES-East')
      // Falls into Southeast region
      expect(result.name).toBe('Southeast')
    })
  })

  describe('International satellite coverage', () => {
    it('should return GOES-East Full Disk for London', () => {
      const result = getSatelliteSector(51.51, -0.13) // London
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Full Disk')
    })

    it('should return GOES-East Full Disk for Paris', () => {
      const result = getSatelliteSector(48.86, 2.35) // Paris
      expect(result.satellite).toBe('GOES-East')
      expect(result.name).toBe('Full Disk')
    })

    it('should return Himawari for Tokyo', () => {
      const result = getSatelliteSector(35.68, 139.65) // Tokyo
      expect(result.satellite).toBe('Himawari')
      expect(result.name).toBe('Asia-Pacific')
    })

    it('should return Himawari for Sydney', () => {
      const result = getSatelliteSector(-33.87, 151.21) // Sydney
      expect(result.satellite).toBe('Himawari')
      expect(result.name).toBe('Asia-Pacific')
    })
  })

  describe('Edge cases', () => {
    it('should return GOES-West for far northern latitudes in western region', () => {
      const result = getSatelliteSector(70, -120)
      expect(result.satellite).toBe('GOES-West')
    })

    it('should handle boundary conditions between GOES-East and GOES-West', () => {
      const result = getSatelliteSector(40, -100)
      expect(result.satellite).toBe('GOES-East')
    })
  })
})

describe('generateSatelliteUrl', () => {
  it('should generate GOES URL with timestamp', () => {
    const url = generateSatelliteUrl(
      'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/CONUS/GEOCOLOR',
      'GOES-East'
    )
    expect(url).toMatch(
      /https:\/\/cdn\.star\.nesdis\.noaa\.gov\/GOES16\/ABI\/CONUS\/GEOCOLOR\/latest\.jpg\?t=\d+/
    )
  })

  it('should generate GOES-East Full Disk URL for Europe', () => {
    const url = generateSatelliteUrl(
      'https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/',
      'GOES-East'
    )
    expect(url).toContain('cdn.star.nesdis.noaa.gov')
    expect(url).toContain('latest.jpg')
  })

  it('should generate Himawari URL with time-based filename', () => {
    const url = generateSatelliteUrl(
      'https://www.data.jma.go.jp/mscweb/data/himawari/img/fd/fd_trc_',
      'Himawari'
    )
    expect(url).toMatch(
      /https:\/\/www\.data\.jma\.go\.jp\/mscweb\/data\/himawari\/img\/fd\/fd_trc_\d{4}\.png\?t=\d+/
    )
  })

  it('should include cache-busting timestamp', () => {
    const timestamp1 = Date.now()
    const url1 = generateSatelliteUrl('https://example.com', 'GOES-East')

    // Wait a moment for timestamp to change
    const timestamp2 = Date.now()
    const url2 = generateSatelliteUrl('https://example.com', 'GOES-East')

    // If timestamps are different, URLs should be different
    if (timestamp1 !== timestamp2) {
      expect(url1).not.toBe(url2)
    }
    // Both URLs should contain timestamp parameter
    expect(url1).toMatch(/\?t=\d+/)
    expect(url2).toMatch(/\?t=\d+/)
  })
})
