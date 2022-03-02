import {Text} from '@mantine/core'

export default function Footer() {
  return (
    <footer>
      <Text align="center" size="sm" m="xl">
        Weather data from{' '}
        <Text variant="link" component="a" href="https://openweathermap.org/">
          OpenWeather
        </Text>
      </Text>
    </footer>
  )
}
