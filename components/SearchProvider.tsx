import {createContext, useContext, useState} from 'react'

// Create the SearchContext.
const SearchContext = createContext(null)

// Create useSearchContext hook.
export const useSearchContext = () => useContext(SearchContext)

/**
 * Render the SearchProvider component.
 *
 * @author Greg Rickaby
 * @param  {object}  props          The component properties.
 * @param  {any}     props.children The children to render.
 * @return {Element}                The SearchProvider component.
 */
export default function SearchProvider({children}) {
  const [search, setSearch] = useState()

  return (
    <SearchContext.Provider value={{search, setSearch}}>
      {children}
    </SearchContext.Provider>
  )
}
