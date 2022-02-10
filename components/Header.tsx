import {Grid, Group} from '@mantine/core'
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
        <Grid gutter="md">
          <Grid.Col span={4}>
            <Group align="center" position="center">
              <Image src={logo} alt="" priority />
              <h1>Local Weather</h1>
            </Group>
          </Grid.Col>
          <Grid.Col span={8}>
            <SearchBar />
          </Grid.Col>
        </Grid>
      </header>
    </>
  )
}
