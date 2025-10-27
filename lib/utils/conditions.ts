/**
 * Condition interpretation utility functions
 *
 * Pure functions for interpreting weather data and providing descriptions.
 * All functions are pure (no side effects) and easily testable.
 */

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
  if (uv <= 2) return {level: 'Low', description: 'Low for the rest of the day'}
  if (uv <= 5)
    return {level: 'Moderate', description: 'Some protection required'}
  if (uv <= 7) return {level: 'High', description: 'Protection essential'}
  if (uv <= 10)
    return {level: 'Very High', description: 'Extra protection needed'}
  return {level: 'Extreme', description: 'Stay inside if possible'}
}

/**
 * Get AQI level and color based on US AQI scale.
 *
 * @param aqi - Air Quality Index value
 * @returns Object with level and color
 */
export function getAQILevel(aqi: number): {level: string; color: string} {
  if (aqi <= 50) return {level: 'Good', color: 'green'}
  if (aqi <= 100) return {level: 'Moderate', color: 'yellow'}
  if (aqi <= 150) return {level: 'Unhealthy for Sensitive', color: 'orange'}
  if (aqi <= 200) return {level: 'Unhealthy', color: 'red'}
  if (aqi <= 300) return {level: 'Very Unhealthy', color: 'grape'}
  return {level: 'Hazardous', color: 'red.9'}
}

/**
 * Get AQI health description.
 *
 * @param aqi - Air Quality Index value
 * @returns Health description string
 */
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Air quality is satisfactory'
  if (aqi <= 100) return 'Acceptable for most people'
  if (aqi <= 150) return 'Unhealthy for sensitive groups'
  if (aqi <= 200) return 'Everyone may experience effects'
  if (aqi <= 300) return 'Health alert: everyone affected'
  return 'Health warning of emergency conditions'
}

/**
 * Get humidity comfort description.
 *
 * @param humidity - Relative humidity percentage (0-100)
 * @returns Comfort description string
 */
export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry conditions'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Slightly humid'
  return 'Very humid'
}

/**
 * Get pressure trend description (uses hPa values regardless of display unit).
 *
 * @param pressureHpa - Pressure in hectopascals
 * @returns Pressure description string
 */
export function getPressureDescription(pressureHpa: number): string {
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
  if (isMetric) {
    // Distances in km
    if (distance >= 16) return 'Excellent visibility'
    if (distance >= 10) return 'Very good visibility'
    if (distance >= 5) return 'Good visibility'
    if (distance >= 2) return 'Moderate visibility'
    return 'Poor visibility'
  }

  // Distances in miles
  if (distance >= 10) return 'Excellent visibility'
  if (distance >= 6) return 'Very good visibility'
  if (distance >= 3) return 'Good visibility'
  if (distance >= 1) return 'Moderate visibility'
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

  if (Math.abs(diff) < 2) return 'Similar to actual temperature'
  if (diff > 5) return `Feels much warmer (${Math.round(diff)}° warmer)`
  if (diff > 0) return `Feels ${Math.round(diff)}° warmer`
  if (diff < -5)
    return `Feels much cooler (${Math.round(Math.abs(diff))}° cooler)`
  return `Feels ${Math.round(Math.abs(diff))}° cooler`
}

/**
 * Get moon phase name from phase value.
 *
 * @param phase - Moon phase value from SunCalc (0.0 to 1.0)
 * @returns Moon phase name
 */
export function getMoonPhaseName(phase: number): string {
  if (phase < 0.0625) return 'New Moon'
  if (phase < 0.1875) return 'Waxing Crescent'
  if (phase < 0.3125) return 'First Quarter'
  if (phase < 0.4375) return 'Waxing Gibbous'
  if (phase < 0.5625) return 'Full Moon'
  if (phase < 0.6875) return 'Waning Gibbous'
  if (phase < 0.8125) return 'Last Quarter'
  if (phase < 0.9375) return 'Waning Crescent'
  return 'New Moon'
}

/**
 * Get moon phase emoji icon.
 *
 * @param phase - Moon phase value from SunCalc (0.0 to 1.0)
 * @returns Moon phase emoji
 */
export function getMoonPhaseEmoji(phase: number): string {
  if (phase < 0.0625) return '🌑' // New Moon
  if (phase < 0.1875) return '🌒' // Waxing Crescent
  if (phase < 0.3125) return '🌓' // First Quarter
  if (phase < 0.4375) return '🌔' // Waxing Gibbous
  if (phase < 0.5625) return '🌕' // Full Moon
  if (phase < 0.6875) return '🌖' // Waning Gibbous
  if (phase < 0.8125) return '🌗' // Last Quarter
  if (phase < 0.9375) return '🌘' // Waning Crescent
  return '🌑' // New Moon
}
