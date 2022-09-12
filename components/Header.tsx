import {Button, Grid, Group, Title} from '@mantine/core'
import {useScrollIntoView} from '@mantine/hooks'
import {FiChevronUp} from 'react-icons/fi'
import Meta from '~/components/Meta'
import Search from '~/components/Search'
import Settings from '~/components/Settings'

export default function Header() {
  const {scrollIntoView, targetRef} = useScrollIntoView<HTMLDivElement>()
  return (
    <>
      <Meta />
      <header ref={targetRef} style={{marginBottom: '2rem'}}>
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
      <Button
        aria-label="Scroll to top"
        onClick={() => scrollIntoView({alignment: 'center'})}
        leftIcon={<FiChevronUp />}
        sx={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          paddingRight: 0,
          zIndex: 100
        }}
        tabIndex={0}
      ></Button>
    </>
  )
}
