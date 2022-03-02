import {MantineProvider} from '@mantine/core'
import {NotificationsProvider} from '@mantine/notifications'
import type {AppProps} from 'next/app'
import WeatherProvider from '~/components/WeatherProvider'

export default function App({Component, pageProps}: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark'
      }}
    >
      <NotificationsProvider position="bottom-right" zIndex={2077}>
        <WeatherProvider>
          <Component {...pageProps} />
        </WeatherProvider>
      </NotificationsProvider>
    </MantineProvider>
  )
}
