import {
  RADAR_ANIMATION_INTERVAL,
  RADAR_DEFAULT_ZOOM,
  RADAR_LAYER_OPACITY
} from '@/lib/constants/radar'
import type {Map, TileLayer} from 'leaflet'
import {useEffect, useRef, useState} from 'react'

interface UseRadarMapParams {
  latitude: number
  longitude: number
  locationName: string
  radarFrames: string[]
  mounted: boolean
}

/**
 * Custom hook to manage Leaflet map and radar animation.
 *
 * Handles map initialization, radar layer updates, and animation logic.
 * Uses layer stacking and opacity to prevent blinking during animation.
 */
export function useRadarMap({
  latitude,
  longitude,
  locationName,
  radarFrames,
  mounted
}: UseRadarMapParams) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<Map | null>(null)
  const radarLayersRef = useRef<TileLayer[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapRef.current || !mounted || globalThis.window === undefined) return

    let isMounted = true

    async function initMap() {
      try {
        setIsMapReady(false)
        setMapError(null)
        const L = (await import('leaflet')).default

        // Clean up existing map and radar layers
        radarLayersRef.current.forEach((layer) => {
          layer.remove()
        })
        radarLayersRef.current = []

        if (leafletMapRef.current) {
          leafletMapRef.current.remove()
          leafletMapRef.current = null
        }

        if (!mapRef.current || !isMounted) return

        // Create new map using destructured method to avoid ESLint false positive
        const {map: createMap, tileLayer, marker} = L
        const map = createMap(mapRef.current, {
          center: [latitude, longitude],
          zoom: RADAR_DEFAULT_ZOOM,
          zoomControl: true
        })

        // Add base tile layer
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        // Add location marker
        marker([latitude, longitude])
          .addTo(map)
          .bindPopup(locationName)
          .openPopup()

        leafletMapRef.current = map
        if (isMounted) {
          setIsMapReady(true)
        }
      } catch (error) {
        console.error('[useRadarMap] Failed to initialize map:', error)
        if (isMounted) {
          setMapError('Failed to load map')
        }
      }
    }

    void initMap()

    return () => {
      isMounted = false
      radarLayersRef.current.forEach((layer) => {
        layer.remove()
      })
      radarLayersRef.current = []

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [latitude, longitude, locationName, mounted])

  // Preload all radar layers when map is ready and frames are available
  useEffect(() => {
    if (!leafletMapRef.current || radarFrames.length === 0 || !isMapReady)
      return

    async function preloadRadarLayers() {
      try {
        const L = (await import('leaflet')).default

        if (!leafletMapRef.current) return

        // Clean up existing layers
        radarLayersRef.current.forEach((layer) => {
          leafletMapRef.current?.removeLayer(layer)
        })
        radarLayersRef.current = []

        // Create all radar layers and add them to map (all initially invisible)
        radarFrames.forEach((frameUrl, index) => {
          const layer = L.tileLayer(frameUrl, {
            opacity: index === 0 ? RADAR_LAYER_OPACITY : 0,
            maxZoom: 19
          })

          if (leafletMapRef.current) {
            layer.addTo(leafletMapRef.current)
            radarLayersRef.current.push(layer)
          }
        })
      } catch (error) {
        console.error('[useRadarMap] Failed to preload radar layers:', error)
      }
    }

    void preloadRadarLayers()
  }, [radarFrames, isMapReady])

  // Update visible radar layer when frame changes
  useEffect(() => {
    if (radarLayersRef.current.length === 0) return

    // Hide all layers
    radarLayersRef.current.forEach((layer) => {
      layer.setOpacity(0)
    })

    // Show current frame
    if (radarLayersRef.current[currentFrame]) {
      radarLayersRef.current[currentFrame].setOpacity(RADAR_LAYER_OPACITY)
    }
  }, [currentFrame])

  // Animate through radar frames
  useEffect(() => {
    if (!isPlaying || radarFrames.length === 0) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % radarFrames.length)
    }, RADAR_ANIMATION_INTERVAL)

    return () => clearInterval(interval)
  }, [isPlaying, radarFrames.length])

  const togglePlay = () => setIsPlaying(!isPlaying)

  return {
    mapRef,
    isPlaying,
    togglePlay,
    currentFrame,
    totalFrames: radarFrames.length,
    isMapReady,
    mapError
  }
}
