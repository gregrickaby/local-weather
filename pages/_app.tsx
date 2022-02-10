import {MantineProvider} from '@mantine/core'
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
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </MantineProvider>
  )
}
