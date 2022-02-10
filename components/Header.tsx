import {Button, Grid, Group, Title} from '@mantine/core'
import {useScrollIntoView} from '@mantine/hooks'
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
  const {scrollIntoView, targetRef} = useScrollIntoView()
  return (
    <>
      <Meta />
      <header ref={targetRef}>
        <Grid gutter="md" justify="center" align="center">
          <Grid.Col span={4}>
            <Group align="center" position="center">
              <Image src={logo} alt="" priority />
              <Title order={1}>Local Weather</Title>
            </Group>
          </Grid.Col>
          <Grid.Col span={8}>
            <SearchBar />
          </Grid.Col>
        </Grid>
      </header>
      <Button
        style={{position: 'fixed', bottom: '24px', right: '24px', zIndex: 100}}
        onClick={() => scrollIntoView({alignment: 'center'})}
      >
        &uarr;
      </Button>
    </>
  )
}
