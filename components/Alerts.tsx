import {Alert, Text, Title} from '@mantine/core'
import {showNotification} from '@mantine/notifications'
import {ExclamationTriangleIcon} from '@modulz/radix-icons'
import {useEffect} from 'react'
import {useWeatherContext} from '~/components/WeatherProvider'

export default function Alerts() {
  const {
    weather: {alerts}
  } = useWeatherContext()

  /**
   * If there are alerts, display a notification.
   */
  useEffect(() => {
    if (!!alerts && alerts?.length > 0) {
      showNotification({
        autoClose: 5000,
        color: 'red',
        icon: <ExclamationTriangleIcon />,
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
