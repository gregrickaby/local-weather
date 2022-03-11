import {Switch} from '@mantine/core'
import {useState} from 'react'
import {useWeatherContext} from './WeatherProvider'

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
      label="F"
      checked={checked}
      offLabel="OFF"
      onChange={() => handleTempUnitChange()}
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
