import {Switch} from '@mantine/core'
import {useState} from 'react'
import {useWeatherContext} from '~/components/WeatherProvider'

export default function TempUnitToggle() {
  const {tempUnit, setTempUnit} = useWeatherContext()
  const [checked, setChecked] = useState(tempUnit === 'f' ? true : false)

  function handleTempUnitChange() {
    setChecked(!checked)
    setTempUnit(checked ? 'c' : 'f')
  }

  return (
    <Switch
      aria-label="Toggle between Fahrenheit and Celsius"
      label="Fahrenheit"
      checked={checked}
      offLabel="OFF"
      onChange={() => handleTempUnitChange()}
      onLabel="ON"
      size="lg"
    />
  )
}
