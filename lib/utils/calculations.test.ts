import {describe, expect, it} from 'vitest'
import {
  calculateSunPosition,
  generateForecastStatement,
  getHourFromISO,
  getMinuteFromISO,
  range
} from './calculations'

describe('range', () => {
  it('should generate array of numbers with step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
  })

  it('should handle step of 1', () => {
    expect(range(5, 10, 1)).toEqual([5, 6, 7, 8, 9])
  })

  it('should handle negative numbers', () => {
    expect(range(-5, 0, 1)).toEqual([-5, -4, -3, -2, -1])
  })
})

describe('getHourFromISO', () => {
  it('should extract hour from ISO string', () => {
    expect(getHourFromISO('2025-01-15T14:30:00')).toBe(14)
  })

  it('should handle midnight', () => {
    expect(getHourFromISO('2025-01-15T00:00:00')).toBe(0)
  })

  it('should handle noon', () => {
    expect(getHourFromISO('2025-01-15T12:00:00')).toBe(12)
  })

  it('should handle evening hours', () => {
    expect(getHourFromISO('2025-01-15T23:45:00')).toBe(23)
  })
})

describe('getMinuteFromISO', () => {
  it('should extract minute from ISO string', () => {
    expect(getMinuteFromISO('2025-01-15T14:30:00')).toBe(30)
  })

  it('should handle zero minutes', () => {
    expect(getMinuteFromISO('2025-01-15T14:00:00')).toBe(0)
  })

  it('should handle 59 minutes', () => {
    expect(getMinuteFromISO('2025-01-15T14:59:00')).toBe(59)
  })
})

describe('calculateSunPosition', () => {
  it('should return 50 when parameters are missing', () => {
    expect(calculateSunPosition()).toBe(50)
    expect(calculateSunPosition('2025-01-26T12:00:00')).toBe(50)
    expect(
      calculateSunPosition('2025-01-26T12:00:00', '2025-01-26T06:00:00')
    ).toBe(50)
  })

  it('should return 0 when current time is before sunrise', () => {
    const result = calculateSunPosition(
      '2025-01-26T05:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(0)
  })

  it('should return 100 when current time is after sunset', () => {
    const result = calculateSunPosition(
      '2025-01-26T19:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(100)
  })

  it('should return 50 when current time is at midday (halfway)', () => {
    const result = calculateSunPosition(
      '2025-01-26T12:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(50)
  })

  it('should return 25 when current time is at quarter day', () => {
    const result = calculateSunPosition(
      '2025-01-26T09:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(25)
  })

  it('should return 75 when current time is at three-quarter day', () => {
    const result = calculateSunPosition(
      '2025-01-26T15:00:00',
      '2025-01-26T06:00:00',
      '2025-01-26T18:00:00'
    )
    expect(result).toBe(75)
  })
})

describe('generateForecastStatement', () => {
  const mockWeather = {
    current: {
      time: '2025-01-15T14:00:00',
      temperature_2m: 20,
      weather_code: 0
    },
    hourly: {
      time: [
        '2025-01-15T15:00:00',
        '2025-01-15T16:00:00',
        '2025-01-15T17:00:00',
        '2025-01-15T18:00:00'
      ],
      temperature_2m: [19, 18, 17, 16],
      weather_code: [0, 0, 2, 3],
      precipitation_probability: [0, 0, 10, 20]
    },
    daily: {
      time: ['2025-01-15', '2025-01-16'],
      temperature_2m_max: [22, 18],
      temperature_2m_min: [15, 12],
      weather_code: [0, 61],
      sunset: ['2025-01-15T18:00:00', '2025-01-16T18:00:00']
    }
  }

  it('should generate a forecast statement', () => {
    const result = generateForecastStatement(mockWeather)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should start with capital letter', () => {
    const result = generateForecastStatement(mockWeather)
    expect(result[0]).toMatch(/[A-Z]/)
  })

  it('should include weather conditions', () => {
    const result = generateForecastStatement(mockWeather)
    expect(result.toLowerCase()).toMatch(
      /clear|cloudy|rain|snow|overcast|partly/
    )
  })

  it('should handle empty hourly data gracefully', () => {
    const emptyHourlyWeather = {
      current: {
        time: '2025-01-15T14:00:00',
        temperature_2m: 20,
        weather_code: 0
      },
      hourly: {
        time: [],
        temperature_2m: [],
        weather_code: [],
        precipitation_probability: []
      },
      daily: {
        time: ['2025-01-15', '2025-01-16'],
        temperature_2m_max: [20, 20],
        temperature_2m_min: [15, 15],
        weather_code: [0, 0],
        sunset: ['2025-01-15T18:00:00', '2025-01-16T18:00:00']
      }
    }

    const result = generateForecastStatement(emptyHourlyWeather)
    // Should still generate forecast from daily data even without hourly
    expect(result).toContain('clear')
    expect(result).toContain('tomorrow')
  })
})
