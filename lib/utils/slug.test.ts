import {describe, it, expect} from 'vitest'
import {createSlug, createLocationSlug, parseLocationSlug} from './slug'
import type {Location} from '@/lib/types'

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
  it('should create slug from full location data', () => {
    const location: Location = {
      id: 5128581,
      name: 'New York',
      latitude: 40.71427,
      longitude: -74.00597,
      admin1: 'New York',
      country: 'United States',
      display: 'New York, New York, United States'
    }
    expect(createLocationSlug(location)).toBe('new-york-new-york-united-states')
  })

  it('should create slug without admin1', () => {
    const location: Location = {
      id: 1,
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      display: 'London, United Kingdom'
    }
    expect(createLocationSlug(location)).toBe('london-united-kingdom')
  })

  it('should handle special characters in location names', () => {
    const location: Location = {
      id: 1,
      name: 'São Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      admin1: 'São Paulo',
      country: 'Brazil',
      display: 'São Paulo, São Paulo, Brazil'
    }
    expect(createLocationSlug(location)).toBe('so-paulo-so-paulo-brazil')
  })

  it('should handle location with just name and country', () => {
    const location: Location = {
      id: 1,
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      country: 'France',
      display: 'Paris, France'
    }
    expect(createLocationSlug(location)).toBe('paris-france')
  })
})

describe('parseLocationSlug', () => {
  it('should parse slug and create search term', () => {
    const result = parseLocationSlug('new-york-new-york-united-states')
    expect(result.slug).toBe('new-york-new-york-united-states')
    expect(result.searchTerm).toBe('new york new york')
  })

  it('should remove USA from search term', () => {
    const result = parseLocationSlug('chicago-illinois-usa')
    expect(result.searchTerm).toBe('chicago illinois')
  })

  it('should remove United Kingdom from search term', () => {
    const result = parseLocationSlug('london-england-united-kingdom')
    expect(result.searchTerm).toBe('london england')
  })

  it('should remove France from search term', () => {
    const result = parseLocationSlug('paris-france')
    expect(result.searchTerm).toBe('paris')
  })

  it('should remove Canada from search term', () => {
    const result = parseLocationSlug('toronto-ontario-canada')
    expect(result.searchTerm).toBe('toronto ontario')
  })

  it('should remove Germany from search term', () => {
    const result = parseLocationSlug('berlin-germany')
    expect(result.searchTerm).toBe('berlin')
  })

  it('should handle slug without country', () => {
    const result = parseLocationSlug('london-england')
    expect(result.slug).toBe('london-england')
    expect(result.searchTerm).toBe('london england')
  })

  it('should handle simple slug', () => {
    const result = parseLocationSlug('sydney-australia')
    expect(result.searchTerm).toBe('sydney')
  })

  it('should normalize hyphens to spaces', () => {
    const result = parseLocationSlug('los-angeles-california')
    expect(result.searchTerm).toBe('los angeles california')
  })
})
