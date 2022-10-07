import {Switch} from '@mantine/core'
import {useHotkeys} from '@mantine/hooks'
import {useState} from 'react'
import {useWeatherContext} from '~/components/WeatherProvider'

/**
 * Temperature unit toggle component.
 */
export default function TempUnitToggle() {
  const {tempUnit, setTempUnit} = useWeatherContext()
  const [checked, setChecked] = useState(tempUnit === 'f' ? true : false)

  function toggleTempUnit() {
    setChecked(!checked)
    setTempUnit(checked ? 'c' : 'f')
  }

  useHotkeys([['mod+u', () => toggleTempUnit()]])

  return (
    <Switch
      aria-label="Toggle between Fahrenheit and Celsius"
      label="Toggle Fahrenheit (⌘+U)"
      checked={checked}
      offLabel="OFF"
      onChange={() => toggleTempUnit()}
      onLabel="ON"
      size="lg"
    />
  )
}
