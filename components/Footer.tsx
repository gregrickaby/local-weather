import {Center, Text} from '@mantine/core'

export default function Footer() {
  return (
    <footer>
      <Center>
        <Text m="xl" size="sm">
          Weather data from{' '}
          <Text
            component="a"
            href="https://openweathermap.org/api"
            size="sm"
            variant="link"
          >
            OpenWeatherAPI
          </Text>{' '}
          | Website by{' '}
          <Text
            component="a"
            href="https://gregrickaby.com"
            size="sm"
            variant="link"
            rel="author"
          >
            Greg Rickaby
          </Text>
        </Text>
      </Center>
    </footer>
  )
}
