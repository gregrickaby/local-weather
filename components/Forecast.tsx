import Image from 'next/image'
import {ForecastPeriodProps, ForecastProps} from '~/types'

/**
 * Render the Forecast component
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component properties.
 * @param  {object}  props.forecast The weather forecast data.
 * @return {Element}                The Forecast component.
 */
export default function Forecast({forecast}: ForecastProps) {
  return (
    <section>
      <h2>Forecast</h2>
      <div>
        {forecast?.properties?.periods.map(
          (
            {name, icon, detailedForecast}: ForecastPeriodProps,
            index: number
          ) => (
            <div key={index}>
              <p>{name}</p>
              <Image
                alt={name}
                height="86"
                loading="lazy"
                src={icon}
                width="86"
              />
              <p>{detailedForecast}</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}
