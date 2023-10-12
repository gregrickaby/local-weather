'use client'

import {Alert, Text, Title} from '@mantine/core'
import {notifications} from '@mantine/notifications'
import {IconAlertTriangle} from '@tabler/icons-react'
import {useEffect} from 'react'
import {useWeatherContext} from '~/components/WeatherProvider'

/**
 * Alerts component.
 */
export default function Alerts() {
  const {
    weather: {alerts}
  } = useWeatherContext()

  /**
   * If there are alerts, display a notification.
   */
  useEffect(() => {
    if (!!alerts && alerts?.length > 0) {
      notifications.show({
        autoClose: 5000,
        color: 'red',
        icon: <IconAlertTriangle />,
        message:
          'Hazardous weather conditions reported for this area. Scroll down for details.',
        title: 'Warning'
      })
    }
  }, [alerts])

  // No alerts? Bail...
  if (!alerts) {
    return null
  }

  return (
    <section>
      <Title my="lg" order={2}>
        Alerts
      </Title>
      {alerts?.map((alert, index: number) => (
        <Alert
          color="red"
          icon={<IconAlertTriangle />}
          key={index}
          mb="xl"
          title={alert?.event}
        >
          <Text mb="md">{alert?.description}</Text>
        </Alert>
      ))}
    </section>
  )
}
