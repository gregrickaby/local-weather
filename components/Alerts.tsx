import {Alert, Text, Title} from '@mantine/core'
import {useNotifications} from '@mantine/notifications'
import {ExclamationTriangleIcon} from '@modulz/radix-icons'
import {useEffect} from 'react'
import {useWeatherContext} from './WeatherProvider'

export default function Alerts() {
  const notifications = useNotifications()
  const {
    weather: {alerts}
  } = useWeatherContext()

  /**
   * If there are alerts, display a notification.
   */
  useEffect(() => {
    if (!!alerts && alerts?.length > 0) {
      notifications.showNotification({
        icon: <ExclamationTriangleIcon />,
        title: 'Warning',
        message:
          'Hazardous weather conditions reported for this area. Scroll down for details.',
        autoClose: true,
        color: 'red'
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // No alerts? Bail...
  if (!alerts) {
    return null
  }

  return (
    <section>
      <Title order={2} align="center" my="lg">
        Alerts
      </Title>
      {alerts?.map((alert, index: number) => (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon />}
          key={index}
          mb="lg"
          title={alert?.event}
        >
          <Text mb="md">{alert?.description}</Text>
        </Alert>
      ))}
    </section>
  )
}
