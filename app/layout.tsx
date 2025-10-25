import {ErrorBoundary} from '@/components/ErrorBoundary'
import StoreProvider from '@/components/Providers/StoreProvider'
import {Analytics} from '@/components/UI/Analytics/Analytics'
import config from '@/lib/constants/config'
import theme from '@/lib/theme'
import {ColorSchemeScript, MantineProvider} from '@mantine/core'
import '@mantine/core/styles.css'
import type {Metadata} from 'next'
import {Suspense} from 'react'

export const metadata: Metadata = {
  title: {
    default: config.siteName,
    template: `%s | ${config.siteName}`
  },
  description: config.metaDescription,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    title: config.siteName,
    description: config.metaDescription,
    siteName: config.siteName
  },
  metadataBase: new URL(config.siteUrl),
  icons: {
    icon: '/favicon.ico'
  }
}

/**
 * Root layout component.
 */
export default function RootLayout({
  children
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <Analytics />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ErrorBoundary>
            <Suspense fallback={null}>
              <StoreProvider>{children}</StoreProvider>
            </Suspense>
          </ErrorBoundary>
        </MantineProvider>
      </body>
    </html>
  )
}
