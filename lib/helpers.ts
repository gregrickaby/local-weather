/**
 * Map WMO weather codes to descriptions and icon codes.
 * Automatically determines day (d) vs night (n) icon variant based on time.
 *
 * @param code - WMO weather code
 * @param time - Optional ISO timestamp to determine day/night. If not provided, uses current time.
 * @param sunrise - Optional sunrise time (ISO string)
 * @param sunset - Optional sunset time (ISO string)
 *
 * @see https://open-meteo.com/en/docs
 * @see https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 */
export function getWeatherInfo(
  code: number,
  time?: string,
  sunrise?: string,
  sunset?: string
): {
  description: string
  icon: string
} {
  // Determine if it's day or night
  let isDaytime = true // default to day
  if (time && sunrise && sunset) {
    const timestamp = new Date(time).getTime()
    const sunriseTime = new Date(sunrise).getTime()
    const sunsetTime = new Date(sunset).getTime()
    isDaytime = timestamp >= sunriseTime && timestamp < sunsetTime
  }

  const dayNight = isDaytime ? 'd' : 'n'

  const weatherCodes: Record<number, {description: string; icon: string}> = {
    0: {description: 'Clear sky', icon: `01${dayNight}`},
    1: {description: 'Mainly clear', icon: `01${dayNight}`},
    2: {description: 'Partly cloudy', icon: `02${dayNight}`},
    3: {description: 'Overcast', icon: `03${dayNight}`},
    45: {description: 'Foggy', icon: `50${dayNight}`},
    48: {description: 'Depositing rime fog', icon: `50${dayNight}`},
    51: {description: 'Light drizzle', icon: `09${dayNight}`},
    53: {description: 'Moderate drizzle', icon: `09${dayNight}`},
    55: {description: 'Dense drizzle', icon: `09${dayNight}`},
    56: {description: 'Light freezing drizzle', icon: `09${dayNight}`},
    57: {description: 'Dense freezing drizzle', icon: `09${dayNight}`},
    61: {description: 'Slight rain', icon: `10${dayNight}`},
    63: {description: 'Moderate rain', icon: `10${dayNight}`},
    65: {description: 'Heavy rain', icon: `10${dayNight}`},
    66: {description: 'Light freezing rain', icon: `13${dayNight}`},
    67: {description: 'Heavy freezing rain', icon: `13${dayNight}`},
    71: {description: 'Slight snow fall', icon: `13${dayNight}`},
    73: {description: 'Moderate snow fall', icon: `13${dayNight}`},
    75: {description: 'Heavy snow fall', icon: `13${dayNight}`},
    77: {description: 'Snow grains', icon: `13${dayNight}`},
    80: {description: 'Slight rain showers', icon: `09${dayNight}`},
    81: {description: 'Moderate rain showers', icon: `09${dayNight}`},
    82: {description: 'Violent rain showers', icon: `09${dayNight}`},
    85: {description: 'Slight snow showers', icon: `13${dayNight}`},
    86: {description: 'Heavy snow showers', icon: `13${dayNight}`},
    95: {description: 'Thunderstorm', icon: `11${dayNight}`},
    96: {description: 'Thunderstorm with slight hail', icon: `11${dayNight}`},
    99: {description: 'Thunderstorm with heavy hail', icon: `11${dayNight}`}
  }

  return weatherCodes[code] || {description: 'Unknown', icon: `01${dayNight}`}
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

/**
 * Format pressure based on unit preference.
 * Celsius users get hPa (hectopascals/millibars).
 * Fahrenheit users get inHg (inches of mercury).
 *
 * Conversion: 1 hPa = 0.02953 inHg
 */
export function formatPressure(
  tempUnit: string,
  pressureHpa: number
): {value: string; unit: string} {
  if (tempUnit === 'f') {
    // Convert to inches of mercury for US/Imperial
    const inHg = pressureHpa * 0.02953
    return {
      value: inHg.toFixed(2),
      unit: 'inHg'
    }
  }

  // Return hPa for metric
  return {
    value: Math.round(pressureHpa).toString(),
    unit: 'hPa'
  }
}
