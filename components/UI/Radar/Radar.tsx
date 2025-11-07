'use client'

import {useRadarMap} from '@/lib/hooks/useRadarMap'
import {useAppSelector} from '@/lib/store/hooks'
import {selectLocation, selectMounted} from '@/lib/store/selectors'
import {useGetRadarFramesQuery} from '@/lib/store/services/radarApi'
import {
  ActionIcon,
  Card,
  Group,
  Loader,
  Overlay,
  Text,
  Title
} from '@mantine/core'
import {
  IconMaximize,
  IconMinimize,
  IconPlayerPause,
  IconPlayerPlay
} from '@tabler/icons-react'
import {useState} from 'react'
import classes from './Radar.module.css'

/**
 * Radar component using RainViewer API.
 *
 * Displays animated weather radar imagery on an interactive map.
 * Free service, no API key required.
 */
export default function Radar() {
  const location = useAppSelector(selectLocation)
  const mounted = useAppSelector(selectMounted)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch radar frames using RTK Query
  const {
    data: radarFrames = [],
    isLoading,
    error
  } = useGetRadarFramesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 300
  })

  // Manage map and animation
  const {
    mapRef,
    isPlaying,
    togglePlay,
    currentFrame,
    totalFrames,
    isMapReady,
    mapError
  } = useRadarMap({
    latitude: location.latitude,
    longitude: location.longitude,
    locationName: location.name,
    radarFrames,
    mounted
  })

  const toggleExpand = () => setIsExpanded(!isExpanded)

  if (!mounted) return null

  // Determine status message
  let statusMessage = 'Live radar imagery'
  if (isLoading || !isMapReady) {
    statusMessage = 'Loading radar data...'
  } else if (error || mapError) {
    statusMessage = mapError || 'Failed to load radar'
  } else if (totalFrames > 0) {
    statusMessage = `Frame ${currentFrame + 1} of ${totalFrames}`
  }

  const hasError = !!error || !!mapError
  const isLoadingData = isLoading || !isMapReady

  return (
    <>
      {isExpanded && (
        <Overlay
          className={classes.backdrop}
          onClick={toggleExpand}
          aria-label="close radar"
        />
      )}
      <Card className={`${classes.card} ${isExpanded ? classes.expanded : ''}`}>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2} size="lg">
              Radar
            </Title>
            <Text size="xs" c="dimmed">
              {statusMessage}
            </Text>
          </div>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={togglePlay}
              disabled={isLoadingData || hasError}
              aria-label={
                isPlaying ? 'pause radar animation' : 'play radar animation'
              }
            >
              {isPlaying ? (
                <IconPlayerPause size={18} />
              ) : (
                <IconPlayerPlay size={18} />
              )}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={toggleExpand}
              aria-label={isExpanded ? 'minimize radar' : 'maximize radar'}
            >
              {isExpanded ? (
                <IconMinimize size={18} />
              ) : (
                <IconMaximize size={18} />
              )}
            </ActionIcon>
          </Group>
        </Group>

        <div
          ref={mapRef}
          className={classes.map}
          style={{height: isExpanded ? '700px' : '400px'}}
          aria-label="weather radar map"
        >
          {isLoadingData && (
            <div className={classes.loading}>
              <Loader size="lg" />
            </div>
          )}
          {hasError && !isLoadingData && (
            <div className={classes.error}>
              <Text size="sm" c="red">
                {mapError || 'Unable to load radar data'}
              </Text>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
