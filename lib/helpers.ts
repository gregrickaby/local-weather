/**
 * Generic fetcher for SWR library.
 */
export async function fetcher(url: string) {
  return await fetch(url).then((res) => res.json())
}

/**
 * Format the temperature in either Fahrenheit or Celsius.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export function formatTemperature(tempUnit: string, temp: number): string {
  const temperature = tempUnit === 'c' ? temp : temp * 1.8 + 32

  return new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: tempUnit === 'c' ? 'celsius' : 'fahrenheit'
  }).format(Math.round(temperature))
}

export function formatDay(day: number, index: number): string {
  // Get the current day.
  const now = new Date()

  // Format today's day of the week.
  const today = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(now)

  // Format tomorrow's day of the week.
  const tomorrow = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(
    now.setDate(now.getDate() + 1)
  )

  // Format the day of the week set in OpenWeather API.
  let dayOfWeek = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(
    day * 1000
  )

  if (dayOfWeek === today && index === 0) {
    dayOfWeek = 'Today'
  }

  if (dayOfWeek === tomorrow) {
    dayOfWeek = 'Tomorrow'
  }

  return dayOfWeek
}

/**
 * Convert UNIX time into human readable format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatTime(time: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric'
  }).format(time * 1000)
}
