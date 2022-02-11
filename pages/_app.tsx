import {MantineProvider} from '@mantine/core'
import {NotificationsProvider} from '@mantine/notifications'
import type {AppProps} from 'next/app'
import SearchProvider from '~/components/SearchProvider'

/**
 * Render the App component.
 *
 * @param  {object}  props           The component attributes as props.
 * @param  {object}  props.Component Page component to display.
 * @param  {boolean} props.pageProps Page component props.
 * @return {Element}                 The App component.
 */
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
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </NotificationsProvider>
    </MantineProvider>
  )
}
