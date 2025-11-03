/**
 * Calculation utility functions
 *
 * Pure functions for weather calculations and data processing.
 * All functions are pure (no side effects) and easily testable.
 *
 * IMPORTANT TIMEZONE HANDLING:
 * The Open-Meteo API returns times in the LOCATION'S timezone (via timezone: 'auto').
 * All time/date parsing uses ISO strings directly WITHOUT timezone conversion.
 * This ensures location-accurate times, not browser timezone conversions.
 */

import * as SunCalc from 'suncalc'

/**
 * Helper function to create time ranges for SDK responses.
 * Generates an array of numbers from start to stop with a given step.
 *
 * @param start - Start value
 * @param stop - Stop value
 * @param step - Step increment
 * @returns Array of numbers
 */
export function range(start: number, stop: number, step: number): number[] {
  return Array.from({length: (stop - start) / step}, (_, i) => start + i * step)
}

/**
 * Extract hour from ISO string without timezone conversion.
 * The API provides times in the location's timezone, so we parse directly.
 *
 * @param isoString - ISO time string (e.g., "2025-01-15T14:30:00")
 * @returns Hour (0-23)
 */
export function getHourFromISO(isoString: string): number {
  // ISO format: "2025-01-15T14:30:00..." - extract the hour part
  const timePart = isoString.split('T')[1]
  return Number.parseInt(timePart.split(':')[0], 10)
}

/**
 * Extract minute from ISO string without timezone conversion.
 * The API provides times in the location's timezone, so we parse directly.
 *
 * @param isoString - ISO time string (e.g., "2025-01-15T14:30:00")
 * @returns Minute (0-59)
 */
export function getMinuteFromISO(isoString: string): number {
  // ISO format: "2025-01-15T14:30:00..." - extract the minute part
  const timePart = isoString.split('T')[1]
  return Number.parseInt(timePart.split(':')[1], 10)
}

/**
 * Extract date components from ISO string without timezone conversion.
 * Returns {year, month, day, dateString} in the location's timezone.
 *
 * @param isoString - ISO string (e.g., "2025-01-15T14:30:00" or "2025-01-15")
 * @returns Object with year, month, day, and dateString
 */
function getDateFromISO(isoString: string): {
  year: number
  month: number
  day: number
  dateString: string
} {
  // ISO format: "2025-01-15T14:30:00..." or "2025-01-15"
  const datePart = isoString.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  return {year, month, day, dateString: datePart}
}

/**
 * Compare two date strings (YYYY-MM-DD) without timezone issues.
 *
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns True if dates are the same
 */
function isSameDate(date1: string, date2: string): boolean {
  return date1 === date2
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
 * Get moon illumination data using SunCalc.
 *
 * @param date - Date to calculate moon illumination for (defaults to now)
 * @returns Moon illumination data (fraction, phase, angle)
 */
export function getMoonIllumination(date: Date = new Date()) {
  return SunCalc.getMoonIllumination(date)
}

/**
 * Get simple weather description from WMO code (internal helper).
 *
 * @param code - WMO weather code
 * @returns Simple weather description
 */
function getSimpleWeather(code: number): string {
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code <= 1) return 'clear'
  if (code === 2) return 'partly cloudy'
  if (code === 3) return 'overcast'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 80 && code <= 99) return 'storms'
  return 'cloudy'
}

/**
 * Get tonight's weather condition as a simple phrase (internal helper).
 *
 * @param code - WMO weather code
 * @returns Tonight's condition phrase
 */
function getTonightCondition(code: number): string {
  if (code <= 1) return 'Clear tonight'
  if (code === 2) return 'Partly cloudy tonight'
  if (code === 3) return 'Cloudy tonight'
  if (code >= 51 && code <= 67) return 'Rain tonight'
  if (code >= 71 && code <= 77) return 'Snow tonight'

  const simplified = getSimpleWeather(code)
  return `${simplified} tonight`
}

/**
 * Analyze weather throughout the day (internal helper).
 *
 * @param currentHour - Current hour (0-23)
 * @param hourlyData - Array of hourly weather data
 * @returns Object with morning, afternoon, evening weather
 */
function analyzeDayWeather(
  currentHour: number,
  hourlyData: Array<{hour: number; code: number; precip: number}>
): {
  morning: string | null
  afternoon: string | null
  evening: string | null
} {
  const morningHours = hourlyData.filter((h) => h.hour >= 6 && h.hour < 12)
  const afternoonHours = hourlyData.filter((h) => h.hour >= 12 && h.hour < 17)
  const eveningHours = hourlyData.filter((h) => h.hour >= 17 && h.hour < 22)

  // Get dominant weather for each period using a more efficient approach
  const getMostCommon = (hours: Array<{code: number}>) => {
    if (hours.length === 0) return null

    const codeCount = new Map<number, number>()
    for (const h of hours) {
      codeCount.set(h.code, (codeCount.get(h.code) || 0) + 1)
    }

    let maxCount = 0
    let mostCommon: number | null = null
    for (const [code, count] of codeCount) {
      if (count > maxCount) {
        maxCount = count
        mostCommon = code
      }
    }

    return mostCommon === null ? null : getSimpleWeather(mostCommon)
  }

  return {
    morning: currentHour < 12 ? getMostCommon(morningHours) : null,
    afternoon: currentHour < 17 ? getMostCommon(afternoonHours) : null,
    evening: currentHour < 22 ? getMostCommon(eveningHours) : null
  }
}

/**
 * Get tomorrow's weather trend (internal helper).
 *
 * @param todayMax - Today's max temperature
 * @param tomorrowMax - Tomorrow's max temperature
 * @param tomorrowCode - Tomorrow's weather code
 * @param currentHour - Current hour
 * @returns Tomorrow's trend or null
 */
function getTomorrowTrend(
  todayMax: number,
  tomorrowMax: number,
  tomorrowCode: number,
  currentHour: number
): string | null {
  const tempDiff = tomorrowMax - todayMax
  const isEarlyMorning = currentHour < 6

  if (Math.abs(tempDiff) >= 5) {
    const warmer = tempDiff > 0
    if (isEarlyMorning) {
      return warmer ? 'warming up tomorrow' : 'cooling down tomorrow'
    }
    return warmer ? 'warmer tomorrow' : 'cooler tomorrow'
  }

  if (tomorrowCode >= 51 && tomorrowCode <= 67) return 'rain tomorrow'
  if (tomorrowCode >= 71 && tomorrowCode <= 77) return 'snow tomorrow'

  return null
}

/**
 * Get forecast parts for evening time (internal helper).
 */
function getEveningForecastParts(
  tomorrowCode: number,
  todayMax: number,
  tomorrowMax: number
): string[] {
  const parts: string[] = []
  parts.push(getTonightCondition(0))
  const tomorrowCondition = getSimpleWeather(tomorrowCode)
  parts.push(`${tomorrowCondition} tomorrow`)
  const tempDiff = tomorrowMax - todayMax
  let trend = 'similar temperatures'
  if (Math.abs(tempDiff) >= 3) {
    trend = tempDiff > 0 ? 'warming up' : 'cooling down'
  }
  parts.push(trend)
  return parts
}

/**
 * Get forecast parts for morning time (internal helper).
 */
function getMorningForecastParts(
  currentCondition: string,
  periods: {
    morning: string | null
    afternoon: string | null
    evening: string | null
  }
): string[] {
  const parts: string[] = []
  parts.push(`${currentCondition} this morning`)
  if (periods.afternoon) parts.push(`${periods.afternoon} this afternoon`)
  if (periods.evening) parts.push(`${periods.evening} this evening`)
  return parts
}

/**
 * Get forecast parts for afternoon time (internal helper).
 */
function getAfternoonForecastParts(
  currentCondition: string,
  periods: {
    morning: string | null
    afternoon: string | null
    evening: string | null
  },
  tomorrowCode: number
): string[] {
  const parts: string[] = []
  parts.push(`${currentCondition} this afternoon`)
  if (periods.evening) parts.push(`${periods.evening} this evening`)
  if (parts.length < 2) {
    const tomorrowCondition = getSimpleWeather(tomorrowCode)
    parts.push(`${tomorrowCondition} tomorrow`)
  }
  return parts
}

/**
 * Build forecast parts based on time of day (internal helper).
 */
function buildForecastParts(
  currentHour: number,
  currentCondition: string,
  periods: {
    morning: string | null
    afternoon: string | null
    evening: string | null
  },
  tomorrowCode: number,
  todayMax: number,
  tomorrowMax: number
): string[] {
  if (currentHour >= 17) {
    return getEveningForecastParts(tomorrowCode, todayMax, tomorrowMax)
  }
  if (currentHour < 12) {
    return getMorningForecastParts(currentCondition, periods)
  }
  return getAfternoonForecastParts(currentCondition, periods, tomorrowCode)
}

/**
 * Generate a short forecast statement based on weather data.
 * Examples: "Clear tonight, cooler tomorrow", "Rain expected this evening"
 *
 * IMPORTANT: All time/date logic uses the location's timezone from the API,
 * not the browser's local timezone.
 *
 * @param weather - Weather data object from Open-Meteo API
 * @returns Forecast statement string
 */
export function generateForecastStatement(weather: {
  current: {
    time: string
    temperature_2m: number
    weather_code: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    sunset: string[]
  }
}): string {
  const currentHour = getHourFromISO(weather.current.time)
  const currentDateString = getDateFromISO(weather.current.time).dateString

  const todayMax = weather.daily.temperature_2m_max[0]
  const tomorrowMax = weather.daily.temperature_2m_max[1]
  const tomorrowCode = weather.daily.weather_code[1]

  const hourlyDataToday = weather.hourly.time
    .map((time, index) => {
      const hourData = {
        time,
        hour: getHourFromISO(time),
        dateString: getDateFromISO(time).dateString,
        code: weather.hourly.weather_code[index],
        precip: weather.hourly.precipitation_probability[index]
      }
      return hourData
    })
    .filter((hour) => {
      const isToday = isSameDate(hour.dateString, currentDateString)
      const isFuture = hour.time > weather.current.time
      return isToday && isFuture
    })
    .slice(0, 18)

  const periods = analyzeDayWeather(currentHour, hourlyDataToday)
  const currentCondition = getSimpleWeather(weather.current.weather_code)
  const parts = buildForecastParts(
    currentHour,
    currentCondition,
    periods,
    tomorrowCode,
    todayMax,
    tomorrowMax
  )

  if (currentHour >= 17) {
    parts[0] = getTonightCondition(weather.current.weather_code)
  }

  if (parts.length < 3 && currentHour < 17) {
    const tomorrowTrend = getTomorrowTrend(
      todayMax,
      tomorrowMax,
      tomorrowCode,
      currentHour
    )
    if (tomorrowTrend) parts.push(tomorrowTrend)
  }

  if (parts.length === 0) {
    return 'Conditions expected to remain steady'
  }

  const statement = parts.join(', ')
  return statement.charAt(0).toUpperCase() + statement.slice(1)
}
