/**
 * Formatting utility functions
 *
 * Pure functions for formatting weather data for display.
 * All functions are pure (no side effects) and easily testable.
 */

/**
 * Format the temperature in either Fahrenheit or Celsius.
 * Note: Open-Meteo returns temperature in the requested unit, so no conversion needed.
 *
 * @param tempUnit - Temperature unit ('c' for Celsius, 'f' for Fahrenheit)
 * @param temp - Temperature value
 * @returns Formatted temperature string (e.g., "72°F" or "22°C")
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
 * Convert ISO time string into human readable format.
 * Parses the hour directly from the ISO string to avoid timezone conversion.
 *
 * @param isoTime - ISO time string (e.g., "2025-01-15T14:30:00")
 * @returns Formatted time string (e.g., "2 PM")
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatTime(isoTime: string): string {
  const timePart = isoTime.split('T')[1]
  const hour = Number.parseInt(timePart.split(':')[0], 10)

  // Convert 24-hour format to 12-hour format
  if (hour === 0) {
    return '12 AM'
  }

  if (hour < 12) {
    return `${hour} AM`
  }

  if (hour === 12) {
    return '12 PM'
  }

  return `${hour - 12} PM`
}

/**
 * Convert ISO time string into human readable format with minutes.
 * Parses the hour and minute directly from the ISO string to avoid timezone conversion.
 * Used for sunrise/sunset times where minutes matter.
 *
 * @param isoTime - ISO time string (e.g., "2025-01-15T06:54:32")
 * @returns Formatted time string (e.g., "6:54 AM")
 */
export function formatTimeWithMinutes(isoTime: string): string {
  // Extract hour and minute from ISO string
  const timePart = isoTime.split('T')[1]
  const hour = Number.parseInt(timePart.split(':')[0], 10)
  const minute = Number.parseInt(timePart.split(':')[1], 10)
  const minuteStr = minute.toString().padStart(2, '0')

  if (hour === 0) {
    return `12:${minuteStr} AM`
  }

  if (hour < 12) {
    return `${hour}:${minuteStr} AM`
  }

  if (hour === 12) {
    return `12:${minuteStr} PM`
  }

  return `${hour - 12}:${minuteStr} PM`
}

/**
 * Format ISO date string to day of week.
 * Uses the current date from API response (location's timezone) for "Today"/"Tomorrow".
 *
 * @param isoDate - Date string in YYYY-MM-DD format from the API (location's timezone)
 * @param currentDate - Current date string from weather.current.time (location's timezone) - REQUIRED
 * @returns Day label (e.g., "Tod", "Tom", "Mon", "Tue")
 */
export function formatDay(isoDate: string, currentDate: string): string {
  const datePart = isoDate.split('T')[0]
  const todayString = currentDate.split('T')[0]

  if (datePart === todayString) {
    return 'Tod'
  }

  const [todayYear, todayMonth, todayDay] = todayString.split('-').map(Number)
  const todayDate = new Date(todayYear, todayMonth - 1, todayDay)
  todayDate.setDate(todayDate.getDate() + 1)
  const tomorrowString = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`

  if (datePart === tomorrowString) {
    return 'Tom'
  }

  const [year, month, day] = datePart.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(date)
}

/**
 * Format pressure based on unit preference.
 * Celsius users get hPa (hectopascals/millibars).
 * Fahrenheit users get inHg (inches of mercury).
 *
 * @param tempUnit - Temperature unit ('c' or 'f')
 * @param pressureHpa - Pressure in hectopascals
 * @returns Object with formatted value and unit
 *
 * @example
 * formatPressure('f', 1013) // { value: '29.92', unit: 'inHg' }
 * formatPressure('c', 1013) // { value: '1013', unit: 'hPa' }
 */
export function formatPressure(
  tempUnit: string,
  pressureHpa: number
): {value: string; unit: string} {
  if (tempUnit === 'f') {
    const inHg = pressureHpa * 0.02953
    return {
      value: inHg.toFixed(2),
      unit: 'inHg'
    }
  }

  return {
    value: Math.round(pressureHpa).toString(),
    unit: 'hPa'
  }
}

/**
 * Get formatted moon illumination percentage.
 *
 * @param fraction - Illumination fraction from SunCalc (0.0 to 1.0)
 * @returns Formatted percentage string (e.g., "23%")
 */
export function getMoonIlluminationPercentage(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}
