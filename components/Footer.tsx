import {Text} from '@mantine/core'

/**
 * Render the footer component.
 *
 * @author Greg Rickaby
 * @return {Element} The footer component.
 */
export default function Footer() {
  return (
    <footer>
      <Text align="center" size="sm" mt="lg">
        Weather data from{' '}
        <Text variant="link" component="a" href="https://openweathermap.org/">
          OpenWeather
        </Text>
      </Text>
    </footer>
  )
}
