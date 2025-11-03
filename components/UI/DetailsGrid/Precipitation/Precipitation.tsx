'use client'

import Icon from '@/components/UI/Icon/Icon'
import {usePrecipitation} from '@/lib/hooks/usePrecipitation'
import {Stack, Text, Title} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Precipitation detail card component.
 *
 * Displays current precipitation including rain and snow amounts.
 */
export default function Precipitation() {
  const {
    formattedRain,
    formattedSnow,
    hasRain,
    hasSnow,
    hasPrecipitation,
    description
  } = usePrecipitation()

  return (
    <DetailCard delay={0}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Precipitation
        </Text>

        <Icon icon="raindrops" alt="precipitation" />

        <Stack gap="xs">
          {hasPrecipitation ? (
            <>
              {hasRain && (
                <>
                  <Title order={2} size="xl">
                    {formattedRain}
                  </Title>
                  <Text size="sm" c="dimmed">
                    Rain
                  </Text>
                </>
              )}
              {hasSnow && (
                <>
                  <Title order={2} size="xl">
                    {formattedSnow}
                  </Title>
                  <Text size="sm" c="dimmed">
                    Snow
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Title order={2} size="xl">
                None
              </Title>
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </DetailCard>
  )
}
