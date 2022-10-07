import {Alert, Text, Title} from '@mantine/core'
import {showNotification} from '@mantine/notifications'
import {useEffect} from 'react'
import {FiTriangle} from 'react-icons/fi'
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
      showNotification({
        autoClose: 5000,
        color: 'red',
        icon: <FiTriangle />,
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
          icon={<FiTriangle />}
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
