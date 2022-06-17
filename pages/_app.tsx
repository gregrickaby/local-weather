import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core'
import {useHotkeys, useLocalStorage} from '@mantine/hooks'
import {NotificationsProvider} from '@mantine/notifications'
import type {AppProps} from 'next/app'
import WeatherProvider from '~/components/WeatherProvider'

export default function App({Component, pageProps}: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+j', () => toggleColorScheme()]])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="bottom-right" zIndex={2077}>
          <WeatherProvider>
            <Component {...pageProps} />
          </WeatherProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
