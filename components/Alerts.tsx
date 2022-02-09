import {AlertProps, AlertsProps} from '~/types'

/**
 * Render the Alerts component.
 *
 * @author Greg Rickaby
 * @param  {object}  props        The component properties as props.
 * @param  {Array}   props.alerts The weather alert array.
 * @return {Element}              The Alerts component.
 */
export default function Alerts({alerts}: AlertProps) {
  return (
    <section>
      <h2>Alerts</h2>
      {alerts?.map(({properties}: AlertsProps, index: number) => (
        <div key={index}>
          <p>{properties?.headline}</p>
          <p>{properties?.description}</p>
          <p>{properties?.instruction}</p>
        </div>
      ))}
    </section>
  )
}
