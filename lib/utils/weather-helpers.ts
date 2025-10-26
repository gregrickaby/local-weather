/**
 * Weather-specific helper functions
 *
 * Pure functions for weather data interpretation, formatting, and calculations.
 * These functions should have no side effects and be easily testable.
 */

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
 * Calculate sun position as percentage of day (0-100).
 * Uses location's current time from API, not browser time.
 *
 * @param currentTimeISO - Current time in ISO format
 * @param sunriseISO - Sunrise time in ISO format
 * @param sunsetISO - Sunset time in ISO format
 * @returns Percentage of day completed (0-100)
 */
export function calculateSunPosition(
  currentTimeISO?: string,
  sunriseISO?: string,
  sunsetISO?: string
): number {
  if (!currentTimeISO || !sunriseISO || !sunsetISO) return 50

  const now = new Date(currentTimeISO)
  const sunrise = new Date(sunriseISO)
  const sunset = new Date(sunsetISO)

  // If before sunrise, return 0
  if (now < sunrise) return 0

  // If after sunset, return 100
  if (now > sunset) return 100

  // Calculate percentage of day completed
  const totalDaylight = sunset.getTime() - sunrise.getTime()
  const elapsedDaylight = now.getTime() - sunrise.getTime()

  return (elapsedDaylight / totalDaylight) * 100
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
    if (distance >= 16) return 'Perfectly clear view'
    if (distance >= 10) return 'Good visibility'
    if (distance >= 5) return 'Moderate visibility'
    return 'Poor visibility'
  }

  // Distances in miles
  if (distance >= 10) return 'Perfectly clear view'
  if (distance >= 6) return 'Good visibility'
  if (distance >= 3) return 'Moderate visibility'
  if (distance >= 1) return 'Poor visibility'
  return 'Very limited visibility'
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
