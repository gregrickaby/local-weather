import {Alert, Text, Title} from '@mantine/core'
import {useNotifications} from '@mantine/notifications'
import {ExclamationTriangleIcon} from '@modulz/radix-icons'
import {useEffect} from 'react'

interface AlertProps {
  alerts: [
    {
      properties: {
        headline: string
        description: string
        instruction: string
      }
    }
  ]
}

/**
 * Render the Alerts component.
 *
 * @author Greg Rickaby
 * @param  {object}  props        The component attributes as props.
 * @param  {Array}   props.alerts The weather alert array.
 * @return {Element}              The Alerts component.
 */
export default function Alerts({alerts}: AlertProps) {
  const notifications = useNotifications()

  /**
   * If there are alerts, display a notification.
   */
  useEffect(() => {
    if (alerts?.length > 0) {
      notifications.showNotification({
        icon: <ExclamationTriangleIcon />,
        title: 'Warning',
        message: 'Hazardous weather conditions reported for this area.',
        autoClose: true,
        color: 'red'
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!!alerts && alerts?.length < 1) {
    return null
  }

  return (
    <section>
      <Title order={2} align="center" my="lg">
        Alerts
      </Title>
      {alerts?.map(({properties}, index: number) => (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon />}
          key={index}
          mb="lg"
          title={properties?.headline}
        >
          <Text mb="md">{properties?.description}</Text>
        </Alert>
      ))}
    </section>
  )
}
