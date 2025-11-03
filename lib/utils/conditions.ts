/**
 * Generic range-based lookup helper.
 * Returns the first matching result based on value ranges.
 */
function getRangeBasedValue<T>(
  value: number,
  ranges: Array<{max: number; result: T}>
): T {
  for (const range of ranges) {
    if (value <= range.max) {
      return range.result
    }
  }
  // Return last range's result as fallback
  return ranges.at(-1)!.result
}

/**
 * Static weather code descriptions (shared for day and night).
 * Stored outside function to avoid recreation on each call.
 */
const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
}

/**
 * Static weather code icon prefixes (without day/night suffix).
 * Stored outside function to avoid recreation on each call.
 */
const WEATHER_CODE_ICON_PREFIXES: Record<number, string> = {
  0: '01',
  1: '01',
  2: '02',
  3: '03',
  45: '50',
  48: '50',
  51: '09',
  53: '09',
  55: '09',
  56: '09',
  57: '09',
  61: '10',
  63: '10',
  65: '10',
  66: '13',
  67: '13',
  71: '13',
  73: '13',
  75: '13',
  77: '13',
  80: '09',
  81: '09',
  82: '09',
  85: '13',
  86: '13',
  95: '11',
  96: '11',
  99: '11'
}

/**
 * Map WMO weather codes to descriptions and icon codes.
 * Automatically determines day (d) vs night (n) icon variant based on time.
 *
 * @param code - WMO weather code
 * @param time - Optional ISO timestamp to determine day/night. If not provided, uses current time.
 * @param sunrise - Optional sunrise time (ISO string)
 * @param sunset - Optional sunset time (ISO string)
 * @returns Object with description and icon code
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

  const description = WEATHER_CODE_DESCRIPTIONS[code] || 'Unknown'
  const iconPrefix = WEATHER_CODE_ICON_PREFIXES[code] || '01'

  return {
    description,
    icon: `${iconPrefix}${dayNight}`
  }
}

/**
 * Convert wind direction degrees to cardinal direction.
 *
 * @param degrees - Wind direction in degrees (0-360)
 * @returns Cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

/**
 * Get UV level and description based on UV index.
 *
 * @param uv - UV index value
 * @returns Object with level and description
 */
export function getUVInfo(uv: number): {level: string; description: string} {
  return getRangeBasedValue(uv, [
    {
      max: 2,
      result: {level: 'Low', description: 'Low for the rest of the day'}
    },
    {
      max: 5,
      result: {level: 'Moderate', description: 'Some protection required'}
    },
    {max: 7, result: {level: 'High', description: 'Protection essential'}},
    {
      max: 10,
      result: {level: 'Very High', description: 'Extra protection needed'}
    },
    {
      max: Infinity,
      result: {level: 'Extreme', description: 'Stay inside if possible'}
    }
  ])
}

/**
 * Get AQI level and color based on US AQI scale.
 *
 * @param aqi - Air Quality Index value
 * @returns Object with level and color
 */
export function getAQILevel(aqi: number): {level: string; color: string} {
  return getRangeBasedValue(aqi, [
    {max: 50, result: {level: 'Good', color: 'green'}},
    {max: 100, result: {level: 'Moderate', color: 'yellow'}},
    {max: 150, result: {level: 'Unhealthy for Sensitive', color: 'orange'}},
    {max: 200, result: {level: 'Unhealthy', color: 'red'}},
    {max: 300, result: {level: 'Very Unhealthy', color: 'grape'}},
    {max: Infinity, result: {level: 'Hazardous', color: 'red.9'}}
  ])
}

/**
 * Get AQI health description.
 *
 * @param aqi - Air Quality Index value
 * @returns Health description string
 */
export function getAQIDescription(aqi: number): string {
  return getRangeBasedValue(aqi, [
    {max: 50, result: 'Air quality is satisfactory'},
    {max: 100, result: 'Acceptable for most people'},
    {max: 150, result: 'Unhealthy for sensitive groups'},
    {max: 200, result: 'Everyone may experience effects'},
    {max: 300, result: 'Health alert: everyone affected'},
    {max: Infinity, result: 'Health warning of emergency conditions'}
  ])
}

/**
 * Get humidity comfort description.
 *
 * @param humidity - Relative humidity percentage (0-100)
 * @returns Comfort description string
 */
export function getHumidityDescription(humidity: number): string {
  return getRangeBasedValue(humidity, [
    {max: 29, result: 'Dry conditions'},
    {max: 59, result: 'Comfortable'},
    {max: 79, result: 'Slightly humid'},
    {max: Infinity, result: 'Very humid'}
  ])
}

/**
 * Get pressure trend description (uses hPa values regardless of display unit).
 *
 * @param pressureHpa - Pressure in hectopascals
 * @returns Pressure description string
 */
export function getPressureDescription(pressureHpa: number): string {
  // For >= logic, check from highest to lowest
  if (pressureHpa >= 1020) return 'High pressure'
  if (pressureHpa >= 1010) return 'Normal pressure'
  if (pressureHpa >= 1000) return 'Low pressure'
  return 'Very low pressure'
}

/**
 * Get visibility quality description.
 *
 * @param distance - Visibility distance value
 * @param isMetric - Whether using metric units (km vs miles)
 * @returns Visibility description string
 */
export function getVisibilityDescription(
  distance: number,
  isMetric: boolean
): string {
  const ranges = isMetric
    ? [
        {max: 2, result: 'Poor visibility'},
        {max: 5, result: 'Moderate visibility'},
        {max: 10, result: 'Good visibility'},
        {max: 16, result: 'Very good visibility'},
        {max: Infinity, result: 'Excellent visibility'}
      ]
    : [
        {max: 1, result: 'Poor visibility'},
        {max: 3, result: 'Moderate visibility'},
        {max: 6, result: 'Good visibility'},
        {max: 10, result: 'Very good visibility'},
        {max: Infinity, result: 'Excellent visibility'}
      ]
  // Reverse the ranges to check from highest to lowest (since we use >= logic)
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (distance >= ranges[i].max) {
      return ranges[i].result
    }
  }
  return 'Poor visibility'
}

/**
 * Get feels like comparison description.
 *
 * @param feels - Apparent/feels like temperature
 * @param actual - Actual temperature
 * @returns Comparison description string
 */
export function getFeelsLikeDescription(feels: number, actual: number): string {
  const diff = feels - actual
  const absDiff = Math.abs(diff)

  if (absDiff < 2) return 'Similar to actual temperature'
  if (diff > 5) return `Feels much warmer (${Math.round(diff)}° warmer)`
  if (diff < -5) return `Feels much cooler (${Math.round(absDiff)}° cooler)`
  return diff > 0
    ? `Feels ${Math.round(diff)}° warmer`
    : `Feels ${Math.round(absDiff)}° cooler`
}

/**
 * Get moon phase name from phase value.
 *
 * @param phase - Moon phase value from SunCalc (0.0 to 1.0)
 * @returns Moon phase name
 */
export function getMoonPhaseName(phase: number): string {
  return getRangeBasedValue(phase, [
    {max: 0.0625, result: 'New Moon'},
    {max: 0.1875, result: 'Waxing Crescent'},
    {max: 0.3125, result: 'First Quarter'},
    {max: 0.4375, result: 'Waxing Gibbous'},
    {max: 0.5625, result: 'Full Moon'},
    {max: 0.6875, result: 'Waning Gibbous'},
    {max: 0.8125, result: 'Last Quarter'},
    {max: 0.9375, result: 'Waning Crescent'},
    {max: Infinity, result: 'New Moon'}
  ])
}

/**
 * Get moon phase emoji icon.
 *
 * @param phase - Moon phase value from SunCalc (0.0 to 1.0)
 * @returns Moon phase emoji
 */
export function getMoonPhaseEmoji(phase: number): string {
  return getRangeBasedValue(phase, [
    {max: 0.0625, result: '🌑'}, // New Moon
    {max: 0.1875, result: '🌒'}, // Waxing Crescent
    {max: 0.3125, result: '🌓'}, // First Quarter
    {max: 0.4375, result: '🌔'}, // Waxing Gibbous
    {max: 0.5625, result: '🌕'}, // Full Moon
    {max: 0.6875, result: '🌖'}, // Waning Gibbous
    {max: 0.8125, result: '🌗'}, // Last Quarter
    {max: 0.9375, result: '🌘'}, // Waning Crescent
    {max: Infinity, result: '🌑'} // New Moon
  ])
}
