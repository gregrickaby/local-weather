import dayjs from 'dayjs'
import Link from 'next/link'
import {FooterProps} from '~/types'

/**
 * Render the footer component.
 *
 * @param  {object}  props                The component properties as props.
 * @param  {string}  props.updatedTime    The time the weather data was last updated.
 * @param  {string}  props.weatherStation The name of the weather station.
 * @return {Element}                      The footer component.
 */
export default function Footer({updatedTime, weatherStation}: FooterProps) {
  return (
    <footer>
      <p>
        <time>As of {dayjs(updatedTime).format('MMMM D, YYYY @ H:mm')}</time>{' '}
        from <a href="https://www.weather.gov/">the National Weather Service</a>{' '}
        in {weatherStation}.
      </p>
      <Link href="/">
        <a>Back to Top</a>
      </Link>
    </footer>
  )
}
