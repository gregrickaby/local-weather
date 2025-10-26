import {describe, it, expect} from 'vitest'
import {
  formatTemperature,
  formatPressure,
  getWeatherInfo,
  formatDay,
  formatTime,
  range
} from './helpers'

describe('formatTemperature', () => {
  it('should format temperature in Celsius', () => {
    const result = formatTemperature('c', 25.5)
    expect(result).toBe('26°C')
  })

  it('should format temperature in Fahrenheit', () => {
    const result = formatTemperature('f', 77.8)
    expect(result).toBe('78°F')
  })

  it('should round temperature values', () => {
    const result = formatTemperature('c', 25.4)
    expect(result).toBe('25°C')
  })
})

describe('formatPressure', () => {
  it('should format pressure in hPa for Celsius users', () => {
    const result = formatPressure('c', 1013.25)
    expect(result).toEqual({
      value: '1013',
      unit: 'hPa'
    })
  })

  it('should format pressure in inHg for Fahrenheit users', () => {
    const result = formatPressure('f', 1013.25)
    expect(result).toEqual({
      value: '29.92',
      unit: 'inHg'
    })
  })
})

describe('getWeatherInfo', () => {
  it('should return clear sky for code 0 during daytime', () => {
    const result = getWeatherInfo(
      0,
      '2025-01-15T12:00:00Z',
      '2025-01-15T07:00:00Z',
      '2025-01-15T18:00:00Z'
    )
    expect(result).toEqual({
      description: 'Clear sky',
      icon: '01d'
    })
  })

  it('should return clear sky for code 0 during nighttime', () => {
    const result = getWeatherInfo(
      0,
      '2025-01-15T20:00:00Z',
      '2025-01-15T07:00:00Z',
      '2025-01-15T18:00:00Z'
    )
    expect(result).toEqual({
      description: 'Clear sky',
      icon: '01n'
    })
  })

  it('should return rain description for code 61', () => {
    const result = getWeatherInfo(61)
    expect(result.description).toBe('Slight rain')
    expect(result.icon).toMatch(/10[dn]/)
  })

  it('should return thunderstorm for code 95', () => {
    const result = getWeatherInfo(95)
    expect(result.description).toBe('Thunderstorm')
    expect(result.icon).toMatch(/11[dn]/)
  })

  it('should handle unknown weather codes', () => {
    const result = getWeatherInfo(999)
    expect(result.description).toBe('Unknown')
    expect(result.icon).toMatch(/01[dn]/)
  })
})

describe('formatDay', () => {
  it('should return "Today" for today\'s date', () => {
    const today = new Date()
    // Use local date string (YYYY-MM-DD) instead of UTC to avoid timezone issues
    const isoDate = today.toLocaleDateString('en-CA')
    expect(formatDay(isoDate)).toBe('Today')
  })

  it('should return "Tomorrow" for tomorrow\'s date', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    // Use local date string (YYYY-MM-DD) instead of UTC to avoid timezone issues
    const isoDate = tomorrow.toLocaleDateString('en-CA')
    expect(formatDay(isoDate)).toBe('Tomorrow')
  })

  it('should return day of week for future dates', () => {
    const future = new Date()
    future.setDate(future.getDate() + 3)
    const isoDate = future.toISOString().split('T')[0]
    const result = formatDay(isoDate)
    expect([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]).toContain(result)
  })
})

describe('formatTime', () => {
  it('should format ISO time to human readable format', () => {
    const result = formatTime('2025-01-15T14:30:00Z')
    // The result will vary based on timezone, but should include a number
    expect(result).toMatch(/\d+/)
  })
})

describe('range', () => {
  it('should create an array of numbers with given step', () => {
    const result = range(0, 10, 2)
    expect(result).toEqual([0, 2, 4, 6, 8])
  })

  it('should handle different start values', () => {
    const result = range(5, 15, 5)
    expect(result).toEqual([5, 10])
  })

  it('should create empty array for equal start and stop', () => {
    const result = range(5, 5, 1)
    expect(result).toEqual([])
  })
})
