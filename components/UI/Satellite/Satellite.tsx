'use client'

import {useSatellite} from '@/lib/hooks/useSatellite'
import {useAppSelector} from '@/lib/store/hooks'
import {selectMounted} from '@/lib/store/selectors'
import {
  ActionIcon,
  Card,
  Group,
  Loader,
  Overlay,
  Text,
  Title
} from '@mantine/core'
import {IconMaximize, IconMinimize, IconRefresh} from '@tabler/icons-react'
import Image from 'next/image'
import {useState} from 'react'
import classes from './Satellite.module.css'

/**
 * Satellite component using multiple geostationary satellites.
 *
 * Displays latest satellite imagery from:
 * - GOES-East (GOES-16) for Eastern US/Atlantic
 * - GOES-West (GOES-18) for Western US/Pacific
 * - Himawari-8/9 for Asia-Pacific
 * - Zoom.Earth for Europe (GIBS/MODIS imagery)
 *
 * Automatically selects appropriate satellite and sector based on location.
 * Free service from NOAA/NASA/JMA/Zoom.Earth, no API key required.
 */
export default function Satellite() {
  const mounted = useAppSelector(selectMounted)
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    imageUrl,
    satelliteName,
    satelliteType,
    lastUpdate,
    isLoading,
    error,
    refreshImage,
    handleImageError,
    handleImageLoad
  } = useSatellite()

  const toggleExpand = () => setIsExpanded(!isExpanded)

  if (!mounted) return null

  // Format last update time
  const updateTime = lastUpdate
    ? lastUpdate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    : ''

  // Determine status message
  let statusMessage = `${satelliteType} • ${satelliteName}`
  if (isLoading) {
    statusMessage = 'Loading satellite data...'
  } else if (error) {
    statusMessage = error
  } else if (updateTime && satelliteType) {
    statusMessage = `${satelliteType} • ${satelliteName} • Updated ${updateTime}`
  }

  const hasError = !!error

  return (
    <>
      {isExpanded && (
        <Overlay
          className={classes.backdrop}
          onClick={toggleExpand}
          aria-label="close satellite"
        />
      )}
      <Card className={`${classes.card} ${isExpanded ? classes.expanded : ''}`}>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2} size="lg">
              Satellite
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
              onClick={refreshImage}
              disabled={isLoading}
              aria-label="refresh satellite imagery"
            >
              <IconRefresh size={18} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={toggleExpand}
              aria-label={
                isExpanded ? 'minimize satellite' : 'maximize satellite'
              }
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
          className={classes.imageContainer}
          style={{height: isExpanded ? '700px' : '400px'}}
          aria-label="satellite imagery"
        >
          {isLoading && !imageUrl && (
            <div className={classes.loading}>
              <Loader size="lg" />
            </div>
          )}
          {hasError && !isLoading && (
            <div className={classes.error}>
              <Text size="sm" c="red">
                {error}
              </Text>
            </div>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${satelliteType} ${satelliteName} satellite imagery`}
              fill
              className={classes.image}
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority
              unoptimized
            />
          )}
        </div>
      </Card>
    </>
  )
}
