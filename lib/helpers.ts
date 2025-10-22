/**
 * Map WMO weather codes to descriptions and icon codes.
 *
 * @see https://open-meteo.com/en/docs
 * @see https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 */
export function getWeatherInfo(code: number): {
  description: string
  icon: string
} {
  const weatherCodes: Record<number, {description: string; icon: string}> = {
    0: {description: 'Clear sky', icon: '01d'},
    1: {description: 'Mainly clear', icon: '01d'},
    2: {description: 'Partly cloudy', icon: '02d'},
    3: {description: 'Overcast', icon: '03d'},
    45: {description: 'Foggy', icon: '50d'},
    48: {description: 'Depositing rime fog', icon: '50d'},
    51: {description: 'Light drizzle', icon: '09d'},
    53: {description: 'Moderate drizzle', icon: '09d'},
    55: {description: 'Dense drizzle', icon: '09d'},
    56: {description: 'Light freezing drizzle', icon: '09d'},
    57: {description: 'Dense freezing drizzle', icon: '09d'},
    61: {description: 'Slight rain', icon: '10d'},
    63: {description: 'Moderate rain', icon: '10d'},
    65: {description: 'Heavy rain', icon: '10d'},
    66: {description: 'Light freezing rain', icon: '13d'},
    67: {description: 'Heavy freezing rain', icon: '13d'},
    71: {description: 'Slight snow fall', icon: '13d'},
    73: {description: 'Moderate snow fall', icon: '13d'},
    75: {description: 'Heavy snow fall', icon: '13d'},
    77: {description: 'Snow grains', icon: '13d'},
    80: {description: 'Slight rain showers', icon: '09d'},
    81: {description: 'Moderate rain showers', icon: '09d'},
    82: {description: 'Violent rain showers', icon: '09d'},
    85: {description: 'Slight snow showers', icon: '13d'},
    86: {description: 'Heavy snow showers', icon: '13d'},
    95: {description: 'Thunderstorm', icon: '11d'},
    96: {description: 'Thunderstorm with slight hail', icon: '11d'},
    99: {description: 'Thunderstorm with heavy hail', icon: '11d'}
  }

  return weatherCodes[code] || {description: 'Unknown', icon: '01d'}
}

/**
 * Format the temperature in either Fahrenheit or Celsius.
 * Note: Open-Meteo returns temperature in the requested unit, so no conversion needed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export function formatTemperature(tempUnit: string, temp: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: tempUnit === 'c' ? 'celsius' : 'fahrenheit'
  }).format(Math.round(temp))
}

/**
 * Format ISO date string to day of week.
 */
export function formatDay(isoDate: string): string {
  // Parse the ISO date as local date (YYYY-MM-DD format)
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Compare dates directly
  const dateTime = date.getTime()
  const todayTime = today.getTime()
  const tomorrowTime = tomorrow.getTime()

  if (dateTime === todayTime) {
    return 'Today'
  }

  if (dateTime === tomorrowTime) {
    return 'Tomorrow'
  }

  // Format the day of the week from the ISO date
  return new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date)
}

/**
 * Convert ISO time string into human readable format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatTime(isoTime: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric'
  }).format(new Date(isoTime))
}
