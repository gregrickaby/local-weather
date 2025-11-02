'use client'

import {Card, Transition} from '@mantine/core'
import {ReactNode} from 'react'

interface DetailCardProps {
  readonly children: ReactNode
  readonly delay?: number
}

/**
 * Shared detail card component with glassmorphic styling and animations.
 *
 * @param children - Card content
 * @param delay - Animation delay in milliseconds
 */
export default function DetailCard({children, delay = 0}: DetailCardProps) {
  return (
    <Transition
      mounted
      transition="slide-up"
      duration={400}
      timingFunction="ease-out"
      exitDuration={200}
      enterDelay={delay}
    >
      {(styles) => (
        <Card
          shadow="sm"
          padding="lg"
          radius="lg"
          withBorder
          style={{
            ...styles,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'var(--mantine-color-body)',
            borderColor: 'var(--mantine-color-default-border)',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Card>
      )}
    </Transition>
  )
}
