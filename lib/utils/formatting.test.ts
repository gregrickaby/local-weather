import {describe, expect, it} from 'vitest'
import {
  formatDay,
  formatPrecipitation,
  formatPressure,
  formatRelativeFromMs,
  formatSnowDepth,
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
    expect(getMoonIlluminationPercentage(0)).toBe('0%')
  })

  it('should format 0.23 as "23%"', () => {
    expect(getMoonIlluminationPercentage(0.23)).toBe('23%')
  })

  it('should format 0.5 as "50%"', () => {
    expect(getMoonIlluminationPercentage(0.5)).toBe('50%')
  })

  it('should format 1.0 as "100%"', () => {
    expect(getMoonIlluminationPercentage(1)).toBe('100%')
  })

  it('should round 0.237 to "24%"', () => {
    expect(getMoonIlluminationPercentage(0.237)).toBe('24%')
  })
})

describe('formatPrecipitation', () => {
  it('should format imperial precipitation in inches', () => {
    expect(formatPrecipitation('f', 0.12)).toBe('0.12 in')
    expect(formatPrecipitation('f', 1.5)).toBe('1.50 in')
  })

  it('should format metric precipitation in millimeters', () => {
    expect(formatPrecipitation('c', 3.2)).toBe('3 mm')
    expect(formatPrecipitation('c', 12.7)).toBe('13 mm')
  })

  it('should handle zero precipitation', () => {
    expect(formatPrecipitation('f', 0)).toBe('0.00 in')
    expect(formatPrecipitation('c', 0)).toBe('0 mm')
  })
})

describe('formatSnowDepth', () => {
  it('should convert meters to inches for imperial', () => {
    expect(formatSnowDepth('f', 0.1)).toBe('4 in') // 0.1m ≈ 3.94 inches
    expect(formatSnowDepth('f', 0.5)).toBe('20 in') // 0.5m ≈ 19.69 inches
  })

  it('should convert meters to centimeters for metric', () => {
    expect(formatSnowDepth('c', 0.1)).toBe('10 cm')
    expect(formatSnowDepth('c', 0.5)).toBe('50 cm')
  })

  it('should handle zero snow depth', () => {
    expect(formatSnowDepth('f', 0)).toBe('0 in')
    expect(formatSnowDepth('c', 0)).toBe('0 cm')
  })
})

describe('formatRelativeFromMs', () => {
  it('should render seconds threshold as "a few seconds ago"', () => {
    expect(formatRelativeFromMs(10_000)).toBe('a few seconds ago')
    expect(formatRelativeFromMs(44_000)).toBe('a few seconds ago')
  })

  it('should render minutes correctly', () => {
    expect(formatRelativeFromMs(60_000)).toBe('1 min ago')
    expect(formatRelativeFromMs(5 * 60_000)).toBe('5 mins ago')
  })

  it('should render hours correctly', () => {
    expect(formatRelativeFromMs(60 * 60_000)).toBe('1 hr ago')
    expect(formatRelativeFromMs(2.4 * 60 * 60_000)).toBe('2 hrs ago')
  })

  it('should render days correctly', () => {
    expect(formatRelativeFromMs(24 * 60 * 60_000)).toBe('1 day ago')
    expect(formatRelativeFromMs(3.2 * 24 * 60 * 60_000)).toBe('3 days ago')
  })

  it('should clamp negative values to zero', () => {
    expect(formatRelativeFromMs(-5_000)).toBe('a few seconds ago')
  })
})
