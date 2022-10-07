import {createStyles, Group, Stack, Text} from '@mantine/core'
import {useWeatherContext} from '~/components/WeatherProvider'
import {formatTemperature} from '~/lib/helpers'

const useStyles = createStyles((theme) => ({
  description: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1,
    margin: 0,
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  bigTemp: {
    fontSize: '8rem',
    fontWeight: 700,
    lineHeight: 1,
    margin: 0,
    textAlign: 'center'
  },
  feelsLike: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1,
    margin: 0,
    textAlign: 'center'
  }
}))

/**
 * Current Conditions component.
 */
export default function CurrentConditions() {
  const {classes} = useStyles()

  const {
    weather: {
      current: {
        weather: [{description}],
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
          className={classes.description}
          component="p"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          variant="gradient"
        >
          {description}
        </Text>
        <Text
          className={classes.bigTemp}
          component="p"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          variant="gradient"
        >
          {formatTemperature(tempUnit, temp)}
        </Text>
        {feels_like > temp && (
          <Text
            className={classes.feelsLike}
            component="p"
            gradient={{from: 'yellow', to: 'orange', deg: 45}}
            variant="gradient"
          >
            Feels Like: {formatTemperature(tempUnit, feels_like)}
          </Text>
        )}
      </Stack>
    </Group>
  )
}
