import {Button, createStyles, TextInput} from '@mantine/core'
import {useForm} from '@mantine/hooks'
import {useState} from 'react'
import {useSearchContext} from './SearchProvider'

const useStyles = createStyles((theme, _params, getRef) => {
  const button = getRef('button')

  return {
    form: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      ref: button,
      borderTopLeftRadius: 0,
      borderLeft: 0,
      borderBottomLeftRadius: 0
    }
  }
})

/**
 * Render the SearchBar component.
 *
 * @author Greg Rickaby
 * @return {Element} The SearchBar component.
 */
export default function SearchBar() {
  const search = useSearchContext()
  const {classes} = useStyles()
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
      className={classes.form}
      onSubmit={form.onSubmit((values) => {
        search.setSearch(value)
      })}
    >
      <TextInput
        id="search"
        aria-label="Enter your location"
        minLength={4}
        onChange={(e) => setValue(e.target.value)}
        pattern="^[^~`^<>]+$"
        placeholder="Bay Lake, FL"
        size="md"
        styles={{
          input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 0
          }
        }}
        type="text"
        value={value}
      />

      <Button className={classes.button} type="submit" size="md">
        Search
      </Button>
    </form>
  )
}
