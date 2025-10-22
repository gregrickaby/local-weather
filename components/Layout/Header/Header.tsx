import config from '@/lib/constants/config'
import {Title} from '@mantine/core'
import classes from './Header.module.css'

/**
 * Header component.
 */
export default function Header() {
  return (
    <header className={classes.header}>
      <Title className={classes.title} order={1}>
        {config.siteName}
      </Title>
    </header>
  )
}
