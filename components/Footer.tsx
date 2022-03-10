import {Center, Text} from '@mantine/core'
import {GitHubLogoIcon} from '@modulz/radix-icons'

export default function Footer() {
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
            <GitHubLogoIcon />
          </Text>
        </Text>
      </Center>
    </footer>
  )
}
