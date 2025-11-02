'use client'

import {DEFAULT_LOCATION} from '@/lib/constants'
import {createLocationSlug} from '@/lib/utils/slug'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

/**
 * Home page component.
 *
 * Redirects to the default location's weather page.
 */
export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Get stored location from localStorage or use default
    let targetLocation = DEFAULT_LOCATION
    
    try {
      const storedLocation = localStorage.getItem('location')
      if (storedLocation) {
        targetLocation = JSON.parse(storedLocation)
      }
    } catch (error) {
      console.error('Failed to parse stored location:', error)
    }

    // Navigate to the location's page
    const slug = createLocationSlug(targetLocation)
    router.replace(`/${slug}`)
  }, [router])

  // Show nothing while redirecting
  return null
}
