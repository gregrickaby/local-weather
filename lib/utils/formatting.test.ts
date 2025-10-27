import {describe, expect, it} from 'vitest'
import {
  formatDay,
  formatPressure,
  formatTemperature,
  formatTime,
  formatTimeWithMinutes,
  getMoonIlluminationPercentage
} from './formatting'

describe('formatTemperature', () => {
  it('should format Fahrenheit temperature', () => {
    expect(formatTemperature('f', 72.3)).toBe('72°F')
  })

  it('should format Celsius temperature', () => {
    expect(formatTemperature('c', 22.7)).toBe('23°C')
  })

  it('should round to nearest integer', () => {
    expect(formatTemperature('f', 72.9)).toBe('73°F')
    expect(formatTemperature('c', 22.1)).toBe('22°C')
  })
})

describe('formatTime', () => {
  it('should format midnight as 12 AM', () => {
    expect(formatTime('2025-01-15T00:00:00')).toBe('12 AM')
  })

  it('should format morning hours', () => {
    expect(formatTime('2025-01-15T06:00:00')).toBe('6 AM')
    expect(formatTime('2025-01-15T09:30:00')).toBe('9 AM')
  })

  it('should format noon as 12 PM', () => {
    expect(formatTime('2025-01-15T12:00:00')).toBe('12 PM')
  })

  it('should format afternoon hours', () => {
    expect(formatTime('2025-01-15T14:00:00')).toBe('2 PM')
    expect(formatTime('2025-01-15T17:30:00')).toBe('5 PM')
  })

  it('should format evening hours', () => {
    expect(formatTime('2025-01-15T20:00:00')).toBe('8 PM')
    expect(formatTime('2025-01-15T23:45:00')).toBe('11 PM')
  })
})

describe('formatTimeWithMinutes', () => {
  it('should format midnight with minutes', () => {
    expect(formatTimeWithMinutes('2025-01-15T00:30:00')).toBe('12:30 AM')
  })

  it('should format morning hours with minutes', () => {
    expect(formatTimeWithMinutes('2025-01-15T06:54:32')).toBe('6:54 AM')
    expect(formatTimeWithMinutes('2025-01-15T09:05:00')).toBe('9:05 AM')
  })

  it('should format noon with minutes', () => {
    expect(formatTimeWithMinutes('2025-01-15T12:15:00')).toBe('12:15 PM')
  })

  it('should format afternoon hours with minutes', () => {
    expect(formatTimeWithMinutes('2025-01-15T14:42:00')).toBe('2:42 PM')
    expect(formatTimeWithMinutes('2025-01-15T17:59:00')).toBe('5:59 PM')
  })

  it('should pad single-digit minutes with zero', () => {
    expect(formatTimeWithMinutes('2025-01-15T08:03:00')).toBe('8:03 AM')
  })
})

describe('formatDay', () => {
  it('should return "Tod" for today', () => {
    const result = formatDay('2025-01-15', '2025-01-15T12:00:00')
    expect(result).toBe('Tod')
  })

  it('should return "Tom" for tomorrow', () => {
    const result = formatDay('2025-01-16', '2025-01-15T12:00:00')
    expect(result).toBe('Tom')
  })

  it('should return day of week for other days', () => {
    // January 17, 2025 is a Friday
    const result = formatDay('2025-01-17', '2025-01-15T12:00:00')
    expect(result).toBe('Fri')
  })

  it('should handle different dates correctly', () => {
    // January 20, 2025 is a Monday
    const result = formatDay('2025-01-20', '2025-01-15T12:00:00')
    expect(result).toBe('Mon')
  })
})

describe('formatPressure', () => {
  it('should format pressure in inHg for Fahrenheit users', () => {
    const result = formatPressure('f', 1013)
    expect(result.value).toBe('29.91')
    expect(result.unit).toBe('inHg')
  })

  it('should format pressure in hPa for Celsius users', () => {
    const result = formatPressure('c', 1013)
    expect(result.value).toBe('1013')
    expect(result.unit).toBe('hPa')
  })

  it('should convert different pressure values correctly', () => {
    const result = formatPressure('f', 1020)
    expect(result.value).toBe('30.12')
    expect(result.unit).toBe('inHg')
  })

  it('should round hPa to integer', () => {
    const result = formatPressure('c', 1013.7)
    expect(result.value).toBe('1014')
  })
})

describe('getMoonIlluminationPercentage', () => {
  it('should format 0.0 as "0%"', () => {
    expect(getMoonIlluminationPercentage(0.0)).toBe('0%')
  })

  it('should format 0.23 as "23%"', () => {
    expect(getMoonIlluminationPercentage(0.23)).toBe('23%')
  })

  it('should format 0.5 as "50%"', () => {
    expect(getMoonIlluminationPercentage(0.5)).toBe('50%')
  })

  it('should format 1.0 as "100%"', () => {
    expect(getMoonIlluminationPercentage(1.0)).toBe('100%')
  })

  it('should round 0.237 to "24%"', () => {
    expect(getMoonIlluminationPercentage(0.237)).toBe('24%')
  })
})
