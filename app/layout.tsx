import Meta from '@/components/Meta'
import WeatherProvider from '@/components/WeatherProvider'
import config from '@/lib/config'
import theme from '@/lib/theme'
import {ColorSchemeScript, MantineProvider} from '@mantine/core'
import '@mantine/core/styles.css'

export const metadata = {
  title: `${config.siteName} - ${config.siteDescription}`,
  description: config.siteDescription
}

/**
 * Root layout component.
 */
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <Meta />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <WeatherProvider>{children}</WeatherProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
