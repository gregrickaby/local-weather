import {Grid, Group, Title} from '@mantine/core'
import Meta from '~/components/Meta'
import Search from '~/components/Search'
import Settings from '~/components/Settings'

export default function Header() {
  return (
    <>
      <Meta />
      <header style={{marginBottom: '2rem'}}>
        <Grid gutter="md" justify="center" align="center" mt="lg">
          <Grid.Col>
            <Group>
              <Title order={1}>Local Weather</Title>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Search />
          </Grid.Col>
        </Grid>
      </header>
      <Settings />
    </>
  )
}
