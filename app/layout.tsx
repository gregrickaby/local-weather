import {ErrorBoundary} from '@/components/Layout/ErrorBoundary'
import {Analytics} from '@/components/UI/Analytics/Analytics'
import config from '@/lib/constants/config'
import StoreProvider from '@/lib/store/StoreProvider'
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps
} from '@mantine/core'
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
 * Customize Mantine Theme.
 *
 * @see https://mantine.dev/theming/mantine-provider/#theme
 */
const theme = createTheme({
  primaryColor: 'gray'
})

/**
 * Root layout component.
 */
export default function RootLayout({
  children
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
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
