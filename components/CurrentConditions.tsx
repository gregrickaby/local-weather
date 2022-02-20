import {Center, Text} from '@mantine/core'
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
        temp
      },
      timezone
    }
  } = useWeatherContext()

  return (
    <Center>
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
        {Math.round(temp)}°
      </Text>

      <Icon icon={icon} />
    </Center>
  )
}
