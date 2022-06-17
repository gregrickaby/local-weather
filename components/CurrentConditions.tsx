import {Group, Stack, Text} from '@mantine/core'
import {useWeatherContext} from '~/components/WeatherProvider'
import {formatTemperature} from '~/lib/formatters'
import Icon from './Icon'

export default function CurrentConditions() {
  const {
    weather: {
      current: {
        weather: [{icon}],
        temp,
        feels_like
      }
    },
    tempUnit
  } = useWeatherContext()

  return (
    <Group position="center">
      <Stack>
        <Text
          align="center"
          component="p"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          style={{
            fontSize: '8rem',
            lineHeight: 1,
            margin: 0
          }}
          variant="gradient"
          weight={700}
        >
          {formatTemperature(tempUnit, temp)}
        </Text>
        {feels_like > temp && (
          <Text
            align="center"
            component="p"
            gradient={{from: 'yellow', to: 'orange', deg: 45}}
            style={{
              fontSize: '2rem',
              lineHeight: 1,
              margin: 0
            }}
            variant="gradient"
            weight={700}
          >
            Feels Like: {formatTemperature(tempUnit, feels_like)}
          </Text>
        )}
      </Stack>
      <Icon icon={icon} />
    </Group>
  )
}
