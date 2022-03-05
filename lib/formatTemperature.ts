export default function formatTemperature(tempUnit: boolean, temp: number) {
  const temperature = tempUnit ? ((temp - 32) * 5) / 9 : temp

  return new Intl.NumberFormat('en', {
    style: 'unit',
    unit: tempUnit ? 'celsius' : 'fahrenheit'
  }).format(Math.round(temperature))
}
