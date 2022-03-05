export default function formatTemperature(tempUnit: boolean, temp: number) {
  const temperature = tempUnit ? temp * 1.8 + 32 : temp

  return new Intl.NumberFormat('en', {
    style: 'unit',
    unit: tempUnit ? 'fahrenheit' : 'celsius'
  }).format(Math.round(temperature))
}
