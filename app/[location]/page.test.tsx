import {describe, expect, it} from 'vitest'
import {generateMetadata, generateStaticParams} from './page'

describe('LocationPage', () => {
  describe('generateStaticParams', () => {
    it('should generate params for all popular cities and default location', async () => {
      const params = await generateStaticParams()

      expect(params).toBeInstanceOf(Array)
      expect(params.length).toBeGreaterThan(0)

      // Should include default location
      expect(params).toContainEqual({
        location: 'enterprise-alabama-united-states'
      })

      // Should have slug format
      for (const param of params) {
        expect(param.location).toMatch(/^[a-z0-9-]+$/)
      }
    })
  })

  describe('generateMetadata', () => {
    it('should generate metadata for known location', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({location: 'enterprise-alabama-united-states'})
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
        params: Promise.resolve({location: 'london-england-united-kingdom'})
      })

      expect(metadata.title).toBe('London England United Kingdom Weather')
      expect(metadata.description).toContain('London England United Kingdom')
      expect(metadata.openGraph).toBeDefined()
    })

    it('should format location slug into readable title', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({
          location: 'new-york-new-york-united-states'
        })
      })

      expect(metadata.title).toBe('New York, New York, United States Weather')
      expect(metadata.description).toContain(
        'Current weather conditions and forecast'
      )
    })
  })
})
