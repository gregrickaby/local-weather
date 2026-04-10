import config from '@/lib/constants/config'
import type {MetadataRoute} from 'next'

/**
 * Generate robots.txt via Next.js Metadata API.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${config.siteUrl}sitemap.xml`
  }
}
