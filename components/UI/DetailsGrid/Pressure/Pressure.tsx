'use client'

import {usePressure} from '@/lib/hooks/usePressure'
import {Box, Flex, Progress, Stack, Text, Title} from '@mantine/core'
import DetailCard from '../DetailCard/DetailCard'

/**
 * Pressure detail card component.
 *
 * Displays current atmospheric pressure with gauge visualization.
 * Shows inHg for Fahrenheit users, hPa for Celsius users.
 */
export default function Pressure() {
  const {pressureValue, pressureUnit, normalizedValue, description} =
    usePressure()

  return (
    <DetailCard delay={300}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          Pressure
        </Text>

        <Box px="md">
          <Stack gap="xs">
            <Title order={2} size="xl" ta="center">
              {pressureValue}
              <Text component="span" size="sm" c="dimmed" ml={4}>
                {pressureUnit}
              </Text>
            </Title>

            <Progress
              value={normalizedValue}
              color="indigo"
              size="lg"
              radius="xl"
            />

            <Flex justify="space-between">
              <Text size="xs" c="dimmed">
                Low
              </Text>
              <Text size="xs" c="dimmed">
                High
              </Text>
            </Flex>
          </Stack>
        </Box>

        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </DetailCard>
  )
}
