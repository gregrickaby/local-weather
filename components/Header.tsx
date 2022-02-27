import {Button, Grid, Group, Title} from '@mantine/core'
import {useScrollIntoView} from '@mantine/hooks'
import {ArrowUpIcon} from '@modulz/radix-icons'
import Image from 'next/image'
import Meta from '~/components/Meta'
import Search from '~/components/Search'
import logo from '~/public/icons/09d.svg'
import TempUnitToggle from './TempUnitToggle'

/**
 * Render the Header component.
 *
 * @author Greg Rickaby
 * @return {Element} The Header component.
 */
export default function Header() {
  const {scrollIntoView, targetRef} = useScrollIntoView()
  return (
    <>
      <Meta />
      <header ref={targetRef} style={{marginBottom: '2rem'}}>
        <Grid gutter="md" justify="center" align="center" mt="lg">
          <Grid.Col>
            <Group align="center" position="center">
              <Image alt="" src={logo} height={75} width={75} priority />
              <Title order={1}>Local Weather</Title>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Search />
          </Grid.Col>
        </Grid>
      </header>
      <TempUnitToggle />
      <Button
        aria-label="Scroll to top"
        onClick={() => scrollIntoView({alignment: 'center'})}
        sx={{position: 'fixed', bottom: '24px', right: '24px', zIndex: 100}}
        tabIndex={0}
      >
        <ArrowUpIcon aria-hidden="true" />
      </Button>
    </>
  )
}
