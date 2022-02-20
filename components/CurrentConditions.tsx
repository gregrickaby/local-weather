import {Center, SimpleGrid, Text} from '@mantine/core'
import Icon from './Icon'
import {useWeatherContext} from './WeatherProvider'

/**
 * Render the CurrentConditions component.
 *
 * @author Greg Rickaby
 * @return {Element} The CurrentConditions component.
 */
export default function CurrentConditions() {
  const {
    weather: {
      current: {
        weather: [{main, icon}],
        temp,
        dt
      },
      timezone
    }
  } = useWeatherContext()

  return (
    <SimpleGrid cols={2}>
      <div>
        <Text>
          As of{' '}
          {new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric'
          }).format(dt * 1000)}
        </Text>

        <Text
          component="span"
          align="center"
          variant="gradient"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          weight={700}
          style={{
            fontFamily: 'Greycliff CF, sans-serif',
            fontSize: '8rem',
            margin: 0,
            lineHeight: 1
          }}
        >
          {new Intl.NumberFormat(navigator.language, {
            style: 'unit',
            unit: 'fahrenheit'
          }).format(Math.round(temp))}
        </Text>
        <strong>{main}</strong>
      </div>
      <Center>
        <Icon icon={icon} />
      </Center>
    </SimpleGrid>
  )
}
