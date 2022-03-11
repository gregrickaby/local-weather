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
      <Title align="center" my="lg" order={2}>
        Alerts
      </Title>
      {alerts?.map((alert, index: number) => (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon />}
          key={index}
          mb="xl"
          sx={{textTransform: 'capitalize'}}
          title={alert?.event}
        >
          <Text mb="md" sx={{textTransform: 'lowercase'}}>
            {alert?.description}
          </Text>
        </Alert>
      ))}
    </section>
  )
}
