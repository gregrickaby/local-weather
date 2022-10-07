import {Button, Center, Text} from '@mantine/core'
import {useWindowScroll} from '@mantine/hooks'
import {FiChevronUp, FiGithub} from 'react-icons/fi'
import Settings from '~/components/Settings'

/**
 * Footer component.
 */
export default function Footer() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <footer>
      <Center>
        <Text m="xl" size="sm" sx={{fontFamily: 'monospace'}}>
          website by{' '}
          <Text
            component="a"
            href="https://gregrickaby.com"
            rel="author"
            size="sm"
            variant="link"
            sx={{fontFamily: 'monospace'}}
          >
            @gregrickaby
          </Text>{' '}
          <Text
            aria-label="View source code on GitHub"
            component="a"
            href="https://github.com/gregrickaby/local-weather"
            sx={{verticalAlign: 'sub'}}
          >
            <FiGithub />
          </Text>
        </Text>
      </Center>
      <Settings />
      {scroll.y > 100 && (
        <Button
          aria-label="Scroll to top"
          leftIcon={<FiChevronUp />}
          onClick={() => scrollTo({y: 0})}
          sx={{
            bottom: '24px',
            paddingRight: 0,
            position: 'fixed',
            right: '24px',
            zIndex: 100
          }}
          tabIndex={0}
        ></Button>
      )}
    </footer>
  )
}
