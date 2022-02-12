import {Button, Grid, Group, Title} from '@mantine/core'
import {useScrollIntoView} from '@mantine/hooks'
import {ArrowUpIcon} from '@modulz/radix-icons'
import Image from 'next/image'
import Meta from '~/components/Meta'
import Search from '~/components/Search'
import logo from '~/public/logo.webp'

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
      <header ref={targetRef}>
        <Grid gutter="md" justify="center" align="center" mt="lg">
          <Grid.Col>
            <Group align="center" position="center">
              <Image src={logo} alt="" priority />
              <Title order={1}>Local Weather</Title>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Search />
          </Grid.Col>
        </Grid>
      </header>
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
