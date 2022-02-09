import Image from 'next/image'
import Meta from '~/components/Meta'
import SearchBar from '~/components/SearchBar'
import logo from '~/public/logo.webp'

/**
 * Render the Header component.
 *
 * @author Greg Rickaby
 * @return {Element} The Header component.
 */
export default function Header() {
  return (
    <>
      <Meta />
      <header>
        <div>
          <div>
            <Image src={logo} alt="" priority />
            <h1>Local Weather</h1>
          </div>
        </div>
        <SearchBar />
      </header>
    </>
  )
}
