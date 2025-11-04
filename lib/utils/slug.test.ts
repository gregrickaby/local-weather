import type {Location} from '@/lib/types'
import {describe, expect, it} from 'vitest'
import {createLocationSlug, createSlug, parseLocationSlug} from './slug'

describe('createSlug', () => {
  it('should convert text to lowercase', () => {
    expect(createSlug('New York')).toBe('new-york')
  })

  it('should replace spaces with hyphens', () => {
    expect(createSlug('New York City')).toBe('new-york-city')
  })

  it('should remove special characters', () => {
    expect(createSlug('São Paulo, Brazil')).toBe('so-paulo-brazil')
  })

  it('should handle multiple spaces', () => {
    expect(createSlug('New  York   City')).toBe('new-york-city')
  })

  it('should handle multiple hyphens', () => {
    expect(createSlug('New--York---City')).toBe('new-york-city')
  })

  it('should trim whitespace', () => {
    expect(createSlug('  New York  ')).toBe('new-york')
  })

  it('should handle commas', () => {
    expect(createSlug('New York, New York, United States')).toBe(
      'new-york-new-york-united-states'
    )
  })
})

describe('createLocationSlug', () => {
  it('should create slug from full location data with coordinates', () => {
    const location: Location = {
      id: 5128581,
      name: 'New York',
      latitude: 40.71427,
      longitude: -74.00597,
      admin1: 'New York',
      country: 'United States',
      display: 'New York, New York, United States'
    }
    expect(createLocationSlug(location)).toBe(
      'new-york/new-york/united-states/40.71/-74.01'
    )
  })

  it('should create slug without admin1 with coordinates', () => {
    const location: Location = {
      id: 2643743,
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      display: 'London, United Kingdom'
    }
    expect(createLocationSlug(location)).toBe(
      'london//united-kingdom/51.51/-0.13'
    )
  })

  it('should handle special characters in location names with coordinates', () => {
    const location: Location = {
      id: 3448439,
      name: 'São Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      admin1: 'São Paulo',
      country: 'Brazil',
      display: 'São Paulo, São Paulo, Brazil'
    }
    expect(createLocationSlug(location)).toBe(
      'so-paulo/so-paulo/brazil/-23.55/-46.63'
    )
  })

  it('should handle location with just name and country with coordinates', () => {
    const location: Location = {
      id: 1,
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      country: 'France',
      display: 'Paris, France'
    }
    expect(createLocationSlug(location)).toBe('paris//france/48.86/2.35')
  })

  it('should handle enterprise location with coordinates', () => {
    const location: Location = {
      id: 4060791,
      name: 'Enterprise',
      latitude: 31.31517,
      longitude: -85.85522,
      admin1: 'Alabama',
      country: 'United States',
      display: 'Enterprise, Alabama, United States'
    }
    expect(createLocationSlug(location)).toBe(
      'enterprise/alabama/united-states/31.32/-85.86'
    )
  })
})

describe('parseLocationSlug', () => {
  it('should extract coordinates from slug with full location data', () => {
    const result = parseLocationSlug(
      'new-york/new-york/united-states/40.71/-74.01'
    )
    expect(result.slug).toBe('new-york/new-york/united-states/40.71/-74.01')
    expect(result.latitude).toBe(40.71)
    expect(result.longitude).toBe(-74.01)
  })

  it('should extract coordinates from slug without admin1', () => {
    const result = parseLocationSlug('london//united-kingdom/51.51/-0.13')
    expect(result.slug).toBe('london//united-kingdom/51.51/-0.13')
    expect(result.latitude).toBe(51.51)
    expect(result.longitude).toBe(-0.13)
  })

  it('should extract coordinates from slug with negative lat and lon', () => {
    const result = parseLocationSlug('so-paulo/so-paulo/brazil/-23.55/-46.63')
    expect(result.slug).toBe('so-paulo/so-paulo/brazil/-23.55/-46.63')
    expect(result.latitude).toBe(-23.55)
    expect(result.longitude).toBe(-46.63)
  })

  it('should handle location with just name and country with coordinates', () => {
    const location: Location = {
      id: 2988507,
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      country: 'France',
      display: 'Paris, France'
    }
    expect(createLocationSlug(location)).toBe('paris//france/48.86/2.35')
  })

  it('should handle enterprise location with coordinates', () => {
    const location: Location = {
      id: 4060791,
      name: 'Enterprise',
      latitude: 31.31517,
      longitude: -85.85522,
      admin1: 'Alabama',
      country: 'United States',
      display: 'Enterprise, Alabama, United States'
    }
    expect(createLocationSlug(location)).toBe(
      'enterprise/alabama/united-states/31.32/-85.86'
    )
  })
})

describe('parseLocationSlug', () => {
  it('should extract coordinates from slug with full location data', () => {
    const result = parseLocationSlug(
      'new-york/new-york/united-states/40.71/-74.01'
    )
    expect(result.slug).toBe('new-york/new-york/united-states/40.71/-74.01')
    expect(result.latitude).toBe(40.71)
    expect(result.longitude).toBe(-74.01)
  })

  it('should extract coordinates from slug without admin1', () => {
    const result = parseLocationSlug('london//united-kingdom/51.51/-0.13')
    expect(result.slug).toBe('london//united-kingdom/51.51/-0.13')
    expect(result.latitude).toBe(51.51)
    expect(result.longitude).toBe(-0.13)
  })

  it('should extract coordinates from slug with negative lat and lon', () => {
    const result = parseLocationSlug('so-paulo/so-paulo/brazil/-23.55/-46.63')
    expect(result.slug).toBe('so-paulo/so-paulo/brazil/-23.55/-46.63')
    expect(result.latitude).toBe(-23.55)
    expect(result.longitude).toBe(-46.63)
  })

  it('should extract coordinates from simple slug', () => {
    const result = parseLocationSlug('paris//france/48.86/2.35')
    expect(result.slug).toBe('paris//france/48.86/2.35')
    expect(result.latitude).toBe(48.86)
    expect(result.longitude).toBe(2.35)
  })

  it('should extract coordinates from enterprise slug', () => {
    const result = parseLocationSlug(
      'enterprise/alabama/united-states/31.32/-85.86'
    )
    expect(result.slug).toBe('enterprise/alabama/united-states/31.32/-85.86')
    expect(result.latitude).toBe(31.32)
    expect(result.longitude).toBe(-85.86)
  })

  it('should return null for slug without coordinates', () => {
    const result = parseLocationSlug('new-york/new-york/united-states')
    expect(result.slug).toBe('new-york/new-york/united-states')
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('should return null for invalid slug', () => {
    const result = parseLocationSlug('invalid-slug')
    expect(result.slug).toBe('invalid-slug')
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('should return null for single word slug', () => {
    const result = parseLocationSlug('paris')
    expect(result.slug).toBe('paris')
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('should validate coordinate ranges', () => {
    const result = parseLocationSlug('invalid/invalid/invalid/999.99/999.99')
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })
})
