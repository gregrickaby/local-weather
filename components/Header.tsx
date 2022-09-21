import {createStyles, Title} from '@mantine/core'
import Meta from '~/components/Meta'
import Search from '~/components/Search'

const useStyles = createStyles((theme) => ({
  header: {
    margin: `${theme.spacing.xl}px 0`
  },
  title: {
    textAlign: 'center',
    marginBottom: `${theme.spacing.xl}px`
  }
}))

export default function Header() {
  const {classes} = useStyles()

  return (
    <>
      <Meta />
      <header className={classes.header}>
        <Title className={classes.title} order={1}>
          Local Weather
        </Title>
        <Search />
      </header>
    </>
  )
}
