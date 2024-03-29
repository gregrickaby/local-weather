import classes from '@/components/Header.module.css'
import config from '@/lib/config'
import {Title} from '@mantine/core'

/**
 * Header component.
 */
export default function Header() {
  return (
    <>
      <header className={classes.header}>
        <Title className={classes.title} order={1}>
          {config.siteName}
        </Title>
      </header>
    </>
  )
}
