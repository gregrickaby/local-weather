import {ColorSchemeScript, MantineProvider} from '@mantine/core'
import '@mantine/core/styles.css'
import Meta from '~/components/Meta'
import WeatherProvider from '~/components/WeatherProvider'
import config from '~/lib/config'
import {theme} from '../theme'

export const metadata = {
  title: `${config.siteName} - ${config.siteDescription}`,
  description: config.siteDescription
}

/**
 * Root layout component.
 */
export default function RootLayout({children}: {children: any}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
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
