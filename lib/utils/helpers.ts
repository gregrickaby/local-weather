/**
 * Weather Helper Functions
 *
 * IMPORTANT TIMEZONE HANDLING:
 * The Open-Meteo API returns times in the LOCATION'S timezone (via timezone: 'auto').
 * All time/date parsing in this file uses the ISO strings directly WITHOUT timezone conversion.
 * This ensures that when a user searches for weather in London, they see London's times,
 * not their browser's local time.
 *
 * DO NOT use `new Date().getHours()` or similar methods that convert to browser timezone.
 * Instead, parse the hour/date directly from the ISO string using helper functions below.
 */

/**
 * Helper function to create time ranges for SDK responses.
 * Generates an array of numbers from start to stop with a given step.
 */
export function range(start: number, stop: number, step: number): number[] {
  return Array.from({length: (stop - start) / step}, (_, i) => start + i * step)
}

/**
 * Extract hour from ISO string without timezone conversion.
 * The API provides times in the location's timezone, so we parse directly.
 */
export function getHourFromISO(isoString: string): number {
  // ISO format: "2025-01-15T14:30:00..." - extract the hour part
  const timePart = isoString.split('T')[1]
  return Number.parseInt(timePart.split(':')[0], 10)
}

/**
 * Extract minute from ISO string without timezone conversion.
 * The API provides times in the location's timezone, so we parse directly.
 */
export function getMinuteFromISO(isoString: string): number {
  // ISO format: "2025-01-15T14:30:00..." - extract the minute part
  const timePart = isoString.split('T')[1]
  return Number.parseInt(timePart.split(':')[1], 10)
}

/**
 * Extract date components from ISO string without timezone conversion.
 * Returns {year, month, day, dateString} in the location's timezone.
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
 */
function isSameDate(date1: string, date2: string): boolean {
  return date1 === date2
}

/**
 * Get tomorrow's date string from a given date string.
 */
function getTomorrowDateString(dateString: string): string {
  const {year, month, day} = getDateFromISO(dateString)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + 1)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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
 * Uses the current date from API response (location's timezone) for "Today"/"Tomorrow".
 *
 * @param isoDate - Date string in YYYY-MM-DD format from the API (location's timezone)
 * @param currentDate - Current date string from weather.current.time (location's timezone) - REQUIRED
 */
export function formatDay(isoDate: string, currentDate: string): string {
  // Parse the ISO date (YYYY-MM-DD format)
  const {year, month, day, dateString} = getDateFromISO(isoDate)
  const date = new Date(year, month - 1, day)

  // Use location's current date from API (never browser time)
  const todayString = getDateFromISO(currentDate).dateString
  const tomorrowString = getTomorrowDateString(todayString)

  if (isSameDate(dateString, todayString)) {
    return 'Today'
  }

  if (isSameDate(dateString, tomorrowString)) {
    return 'Tomorrow'
  }

  // Format the day of the week from the ISO date
  return new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date)
}

/**
 * Convert ISO time string into human readable format.
 * Parses the hour directly from the ISO string to avoid timezone conversion.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatTime(isoTime: string): string {
  const hour = getHourFromISO(isoTime)

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
 */
export function formatTimeWithMinutes(isoTime: string): string {
  const hour = getHourFromISO(isoTime)
  const minute = getMinuteFromISO(isoTime)
  const minuteStr = minute.toString().padStart(2, '0')

  // Convert 24-hour format to 12-hour format
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

/**
 * Get tonight's weather condition as a simple phrase
 */
function getTonightCondition(code: number): string {
  if (code <= 1) return 'Clear tonight'
  if (code === 2) return 'Partly cloudy tonight'
  if (code === 3) return 'Cloudy tonight'
  if (code >= 51 && code <= 67) return 'Rain tonight'
  if (code >= 71 && code <= 77) return 'Snow tonight'

  const {description} = getWeatherInfo(code)
  const simplified = description
    .toLowerCase()
    .replaceAll(/slight |moderate |heavy |light /gi, '')
    .replaceAll(/ sky$/g, '')
  return `${simplified} tonight`.replaceAll(/\s+/g, ' ')
}

/**
 * Get simple weather description from code
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
 * Analyze weather throughout the day
 */
function analyzeDayWeather(
  currentHour: number,
  hourlyData: Array<{hour: number; code: number; precip: number}>
): {
  morning: string | null
  afternoon: string | null
  evening: string | null
} {
  // Define time periods (using location's time, not browser time)
  const morningHours = hourlyData.filter((h) => {
    return h.hour >= 6 && h.hour < 12
  })
  const afternoonHours = hourlyData.filter((h) => {
    return h.hour >= 12 && h.hour < 17
  })
  const eveningHours = hourlyData.filter((h) => {
    return h.hour >= 17 && h.hour < 22
  })

  // Get dominant weather for each period
  const getMostCommon = (hours: Array<{code: number}>) => {
    if (hours.length === 0) return null
    const codes = hours.map((h) => h.code)
    const sorted = codes.toSorted(
      (a, b) =>
        codes.filter((v) => v === a).length -
        codes.filter((v) => v === b).length
    )
    const mode = sorted.pop()
    return mode ? getSimpleWeather(mode) : null
  }

  return {
    morning: currentHour < 12 ? getMostCommon(morningHours) : null,
    afternoon: currentHour < 17 ? getMostCommon(afternoonHours) : null,
    evening: currentHour < 22 ? getMostCommon(eveningHours) : null
  }
}

/**
 * Get tomorrow's weather trend
 */
function getTomorrowTrend(
  todayMax: number,
  tomorrowMax: number,
  tomorrowCode: number,
  currentHour: number
): string | null {
  const tempDiff = tomorrowMax - todayMax
  const isEarlyMorning = currentHour < 6

  // Check temperature change
  if (Math.abs(tempDiff) >= 5) {
    const warmer = tempDiff > 0
    if (isEarlyMorning) {
      return warmer ? 'warming up tomorrow' : 'cooling down tomorrow'
    }
    return warmer ? 'warmer tomorrow' : 'cooler tomorrow'
  }

  // Check precipitation tomorrow
  if (tomorrowCode >= 51 && tomorrowCode <= 67) return 'rain tomorrow'
  if (tomorrowCode >= 71 && tomorrowCode <= 77) return 'snow tomorrow'

  return null
}

/**
 * Get forecast parts for evening time
 */
function getEveningForecastParts(
  tomorrowCode: number,
  todayMax: number,
  tomorrowMax: number
): string[] {
  const parts: string[] = []
  parts.push(getTonightCondition(0)) // Will be replaced with actual code
  const tomorrowCondition = getSimpleWeather(tomorrowCode)
  parts.push(`${tomorrowCondition} tomorrow`)
  const tempDiff = tomorrowMax - todayMax
  // Determine temperature trend
  let trend = 'similar temperatures'
  if (Math.abs(tempDiff) >= 3) {
    trend = tempDiff > 0 ? 'warming up' : 'cooling down'
  }
  parts.push(trend)
  return parts
}

/**
 * Get forecast parts for morning time
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
 * Get forecast parts for afternoon time
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
 * Build forecast parts based on time of day
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
  // Extract hour from location's time (not browser time!)
  const currentHour = getHourFromISO(weather.current.time)
  const currentDateString = getDateFromISO(weather.current.time).dateString

  // Get today's and tomorrow's data
  const todayMax = weather.daily.temperature_2m_max[0]
  const tomorrowMax = weather.daily.temperature_2m_max[1]
  const tomorrowCode = weather.daily.weather_code[1]

  // Prepare hourly data for analysis (next 24 hours)
  // Filter hours that are in the future relative to location's time
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
    .slice(0, 18) // Next ~18 hours

  // Analyze different time periods today
  const periods = analyzeDayWeather(currentHour, hourlyDataToday)

  // Current condition
  const currentCondition = getSimpleWeather(weather.current.weather_code)

  // Build forecast parts
  const parts = buildForecastParts(
    currentHour,
    currentCondition,
    periods,
    tomorrowCode,
    todayMax,
    tomorrowMax
  )

  // Fix evening forecast to use actual condition
  if (currentHour >= 17) {
    parts[0] = getTonightCondition(weather.current.weather_code)
  }

  // Add more tomorrow info if needed
  if (parts.length < 3 && currentHour < 17) {
    const tomorrowTrend = getTomorrowTrend(
      todayMax,
      tomorrowMax,
      tomorrowCode,
      currentHour
    )
    if (tomorrowTrend) parts.push(tomorrowTrend)
  }

  // Fallback if no parts
  if (parts.length === 0) {
    return 'Conditions expected to remain steady'
  }

  // Join parts with proper capitalization
  const statement = parts.join(', ')
  return statement.charAt(0).toUpperCase() + statement.slice(1)
}
