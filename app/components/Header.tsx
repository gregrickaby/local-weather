import {Title} from '@mantine/core'
import classes from '~/components/Header.module.css'
import Meta from '~/components/Meta'
import Search from '~/components/Search'
import config from '~/lib/config'

/**
 * Header component.
 */
export default function Header() {
  return (
    <>
      <Meta />
      <header className={classes.header}>
        <Title className={classes.title} order={1}>
          {config.siteName}
        </Title>
        <Search />
      </header>
    </>
  )
}
