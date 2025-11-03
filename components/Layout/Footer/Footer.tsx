import config from '@/lib/constants/config'
import {Text} from '@mantine/core'
import classes from './Footer.module.css'

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Text>
        &copy; {new Date().getFullYear()} {config.siteName} by{' '}
        <a
          aria-label={`visit ${config.siteAuthor} website`}
          href={config.authorUrl}
          rel="author"
        >
          {config.siteAuthor}
        </a>
      </Text>
      <Text>
        {' '}
        Data from{' '}
        <a
          aria-label="visit Open-Meteo website"
          href="https://open-meteo.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Open-Meteo
        </a>{' '}
        and{' '}
        <a
          aria-label="visit RainViewer website"
          href="https://www.rainviewer.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          RainViewer
        </a>
        . View source code on{' '}
        <a
          aria-label="view source code on github"
          href={config.githubUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        {/* */}.
      </Text>
    </footer>
  )
}
