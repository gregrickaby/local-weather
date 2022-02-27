import {Switch} from '@mantine/core'
import {useWeatherContext} from './WeatherProvider'

/**
 * Toggle between Fahrenheit and Celsius units.
 *
 * @author Greg Rickaby
 * @return {Element} The TempUnitToggle component.
 */
export default function TempUnitToggle() {
  const {tempUnit, setTempUnit} = useWeatherContext()

  return (
    <Switch
      aria-label="Toggle between Fahrenheit and Celsius"
      label="C"
      checked={tempUnit}
      offLabel="OFF"
      onChange={() => setTempUnit(!tempUnit)}
      onLabel="ON"
      size="lg"
      sx={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 100
      }}
    />
  )
}
