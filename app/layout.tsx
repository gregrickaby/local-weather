import StoreProvider from '@/components/Providers/StoreProvider'
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
  keywords: ['weather', 'forecast', 'local weather', 'weather app'],
  authors: [
    {
      name: config.siteAuthor,
      url: config.authorUrl
    }
  ],
  creator: config.siteAuthor,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    title: config.siteName,
    description: config.metaDescription,
    siteName: config.siteName
  },
  twitter: {
    card: 'summary_large_image',
    title: config.siteName,
    description: config.metaDescription,
    creator: '@gregrickaby'
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
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Suspense fallback={null}>
            <StoreProvider>{children}</StoreProvider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  )
}
