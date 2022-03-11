import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core'
import {useColorScheme, useLocalStorageValue} from '@mantine/hooks'
import {NotificationsProvider} from '@mantine/notifications'
import type {AppProps} from 'next/app'
import WeatherProvider from '~/components/WeatherProvider'

export default function App({Component, pageProps}: AppProps) {
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: 'colorScheme',
    defaultValue: preferredColorScheme
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme}}>
        <NotificationsProvider position="bottom-right" zIndex={2077}>
          <WeatherProvider>
            <Component {...pageProps} />
          </WeatherProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
