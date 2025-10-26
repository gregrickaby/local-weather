import {describe, expect, it} from 'vitest'
import {
  formatDay,
  formatPressure,
  formatTemperature,
  formatTime,
  generateForecastStatement,
  getWeatherInfo,
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

  it('should return partly cloudy for code 2', () => {
    const result = getWeatherInfo(2)
    expect(result.description).toBe('Partly cloudy')
    expect(result.icon).toMatch(/02[dn]/)
  })

  it('should return fog for codes 45 and 48', () => {
    const fog = getWeatherInfo(45)
    expect(fog.description).toBe('Foggy')
    expect(fog.icon).toMatch(/50[dn]/)

    const rimeFog = getWeatherInfo(48)
    expect(rimeFog.description).toBe('Depositing rime fog')
    expect(rimeFog.icon).toMatch(/50[dn]/)
  })

  it('should return drizzle for codes 51-57', () => {
    const lightDrizzle = getWeatherInfo(51)
    expect(lightDrizzle.description).toBe('Light drizzle')

    const freezingDrizzle = getWeatherInfo(56)
    expect(freezingDrizzle.description).toBe('Light freezing drizzle')
  })

  it('should return snow for codes 71-77', () => {
    const lightSnow = getWeatherInfo(71)
    expect(lightSnow.description).toBe('Slight snow fall')
    expect(lightSnow.icon).toMatch(/13[dn]/)

    const heavySnow = getWeatherInfo(75)
    expect(heavySnow.description).toBe('Heavy snow fall')
  })

  it('should return showers for codes 80-86', () => {
    const rainShower = getWeatherInfo(80)
    expect(rainShower.description).toBe('Slight rain showers')

    const snowShower = getWeatherInfo(85)
    expect(snowShower.description).toBe('Slight snow showers')
  })

  it('should return thunderstorm with hail for codes 96-99', () => {
    const lightHail = getWeatherInfo(96)
    expect(lightHail.description).toBe('Thunderstorm with slight hail')

    const heavyHail = getWeatherInfo(99)
    expect(heavyHail.description).toBe('Thunderstorm with heavy hail')
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

describe('generateForecastStatement', () => {
  const createMockWeather = (
    overrides: {
      current?: Partial<{
        time: string
        temperature_2m: number
        weather_code: number
      }>
      hourly?: Partial<{
        time?: string[]
        temperature_2m?: number[]
        weather_code?: number[]
        precipitation_probability?: number[]
      }>
      daily?: Partial<{
        time?: string[]
        temperature_2m_max?: number[]
        temperature_2m_min?: number[]
        weather_code?: number[]
        sunset?: string[]
      }>
    } = {}
  ) => ({
    current: {
      time: '2025-01-15T10:00:00Z',
      temperature_2m: 72,
      weather_code: 0,
      ...overrides.current
    },
    hourly: {
      time: Array.from({length: 24}, (_, i) => {
        const date = new Date('2025-01-15T00:00:00Z')
        date.setHours(i)
        return date.toISOString()
      }),
      temperature_2m: new Array(24).fill(70),
      weather_code: new Array(24).fill(0),
      precipitation_probability: new Array(24).fill(0),
      ...overrides.hourly
    },
    daily: {
      time: ['2025-01-15', '2025-01-16', '2025-01-17'],
      temperature_2m_max: [75, 80, 72],
      temperature_2m_min: [65, 68, 60],
      weather_code: [0, 2, 61],
      sunset: [
        '2025-01-15T18:00:00Z',
        '2025-01-16T18:00:00Z',
        '2025-01-17T18:00:00Z'
      ],
      ...overrides.daily
    }
  })

  it('should generate forecast for morning time', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T08:00:00Z', weather_code: 0}
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
    // Should start with capital letter
    expect(result[0]).toBe(result[0].toUpperCase())
  })

  it('should generate forecast for afternoon time', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T14:00:00Z', weather_code: 2}
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate forecast for evening/night time', () => {
    // Use a late hour that will definitely be evening in most timezones
    const now = new Date()
    now.setHours(21, 0, 0, 0) // 9 PM local time
    const weather = createMockWeather({
      current: {time: now.toISOString(), weather_code: 0}
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    // At evening/night, forecast should mention tomorrow or tonight
    expect(result.toLowerCase()).toMatch(/tomorrow|tonight/)
  })

  it('should mention rain when rain is expected', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T14:00:00Z', weather_code: 61},
      hourly: {
        weather_code: new Array(24).fill(61)
      }
    })
    const result = generateForecastStatement(weather)
    expect(result.toLowerCase()).toMatch(/rain/)
  })

  it('should mention snow when snow is expected', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T14:00:00Z', weather_code: 71},
      daily: {
        weather_code: [71, 71, 0]
      }
    })
    const result = generateForecastStatement(weather)
    expect(result.toLowerCase()).toMatch(/snow/)
  })

  it('should mention temperature change when significant', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T10:00:00Z'},
      daily: {
        temperature_2m_max: [70, 85, 72] // 15° increase tomorrow
      }
    })
    const result = generateForecastStatement(weather)
    expect(result.toLowerCase()).toMatch(/warm/)
  })

  it('should mention cooling when temperature drops significantly', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T10:00:00Z'},
      daily: {
        temperature_2m_max: [80, 65, 70] // 15° decrease tomorrow
      }
    })
    const result = generateForecastStatement(weather)
    expect(result.toLowerCase()).toMatch(/cool/)
  })

  it('should handle clear conditions', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T10:00:00Z', weather_code: 0},
      hourly: {weather_code: new Array(24).fill(0)},
      daily: {weather_code: [0, 0, 0]}
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    expect(result.toLowerCase()).toMatch(/clear/)
  })

  it('should handle cloudy conditions', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T10:00:00Z', weather_code: 3},
      hourly: {weather_code: new Array(24).fill(3)}
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    expect(result.toLowerCase()).toMatch(/cloud|overcast/)
  })

  it('should return default statement when no clear forecast', () => {
    const weather = createMockWeather({
      current: {time: '2025-01-15T23:00:00Z'}, // Late night
      daily: {
        temperature_2m_max: [72, 72, 72] // No change
      }
    })
    const result = generateForecastStatement(weather)
    expect(result).toBeTruthy()
    // Should still return a statement
    expect(result.length).toBeGreaterThan(0)
  })
})
