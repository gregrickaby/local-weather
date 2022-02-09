import {useState} from 'react'
import {useSearchContext} from './SearchProvider'
/**
 * Render the SearchBar component.
 *
 * @author Greg Rickaby
 * @return {Element} The SearchBar component.
 */
export default function SearchBar() {
  const search = useSearchContext()
  const [value, setValue] = useState('Bay Lake, FL')

  /**
   * Search handler.
   *
   * @param {object} event The event object.
   */
  function handleSearch(event) {
    event.preventDefault()
    search.setSearch(value)
  }

  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="search">Enter your location</label>
      <input
        id="search"
        minLength={4}
        onChange={(e) => setValue(e.target.value)}
        pattern="^[^~`^<>]+$"
        placeholder="Bay Lake, FL"
        type="text"
        value={value}
      />
      <button>Search</button>
    </form>
  )
}
