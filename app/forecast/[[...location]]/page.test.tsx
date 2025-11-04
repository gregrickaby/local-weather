import {describe, expect, it} from 'vitest'
import {generateMetadata, generateStaticParams} from './page'

describe('LocationPage', () => {
  describe('generateStaticParams', () => {
    it('should generate params for all popular cities and default location', async () => {
      const params = await generateStaticParams()

      expect(params).toBeInstanceOf(Array)
      expect(params.length).toBeGreaterThan(0)

      // Should include default location with path segments
      expect(params).toContainEqual({
        location: ['enterprise', 'alabama', 'united-states', '31.32', '-85.86']
      })

      // Each param should have 5 segments: [city, state, country, lat, lon]
      for (const param of params) {
        expect(param.location).toHaveLength(5)
        // Validate last two segments are coordinates
        const lat = Number(param.location[3])
        const lon = Number(param.location[4])
        expect(lat).toBeGreaterThanOrEqual(-90)
        expect(lat).toBeLessThanOrEqual(90)
        expect(lon).toBeGreaterThanOrEqual(-180)
        expect(lon).toBeLessThanOrEqual(180)
      }
    })
  })

  describe('generateMetadata', () => {
    it('should generate metadata for known location', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({
          location: [
            'enterprise',
            'alabama',
            'united-states',
            '31.32',
            '-85.86'
          ]
        })
      })

      expect(metadata.title).toBe('Enterprise, Alabama, United States Weather')
      expect(metadata.description).toContain(
        'Enterprise, Alabama, United States'
      )
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe(
        'Enterprise, Alabama, United States Weather'
      )
    })

    it('should generate metadata for dynamic location', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({
          location: ['london', '', 'united-kingdom', '51.51', '-0.13']
        })
      })

      expect(metadata.title).toContain('Weather')
      expect(metadata.description).toContain(
        'Current weather conditions and forecast'
      )
      expect(metadata.openGraph).toBeDefined()
    })

    it('should format location slug into readable title', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({
          location: ['new-york', 'new-york', 'united-states', '40.71', '-74.01']
        })
      })

      expect(metadata.title).toBe('New York, New York, United States Weather')
      expect(metadata.description).toContain(
        'Current weather conditions and forecast'
      )
    })
  })
})
