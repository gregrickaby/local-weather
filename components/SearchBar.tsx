import {Button, TextInput} from '@mantine/core'
import {useForm} from '@mantine/hooks'
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
  const form = useForm<{search?: string}>({
    initialValues: {
      search: 'Bay Lake, FL'
    },

    validationRules: {
      search: (value) => value.trim().length >= 2
    }
  })

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        search.setSearch(value)
      })}
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <TextInput
        styles={{
          input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 0
          },
          label: {
            borderWidth: 0,
            clip: 'rect(0, 0, 0, 0)',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: '1px'
          }
        }}
        label="Enter your location"
        id="search"
        minLength={4}
        onChange={(e) => setValue(e.target.value)}
        pattern="^[^~`^<>]+$"
        placeholder="Bay Lake, FL"
        type="text"
        value={value}
        size="md"
      />

      <Button
        type="submit"
        size="md"
        style={{
          borderTopLeftRadius: 0,
          borderLeft: 0,
          borderBottomLeftRadius: 0
        }}
      >
        Search
      </Button>
    </form>
  )
}
