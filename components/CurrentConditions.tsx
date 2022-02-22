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
        weather: [{icon}],
        temp
      }
    }
  } = useWeatherContext()

  return (
    <Center>
      <Text
        align="center"
        component="span"
        gradient={{from: 'indigo', to: 'cyan', deg: 45}}
        style={{
          fontSize: '8rem',
          lineHeight: 1,
          margin: 0
        }}
        variant="gradient"
        weight={700}
      >
        {Math.round(temp)}°
      </Text>
      <Icon icon={icon} />
    </Center>
  )
}
