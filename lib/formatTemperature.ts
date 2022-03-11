export default function formatTemperature(tempUnit: string, temp: number) {
  const temperature = tempUnit === 'c' ? temp : temp * 1.8 + 32

  return new Intl.NumberFormat('en', {
    style: 'unit',
    unit: tempUnit === 'c' ? 'celsius' : 'fahrenheit'
  }).format(Math.round(temperature))
}
