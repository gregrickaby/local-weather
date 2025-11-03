import config from '@/lib/constants/config'
import {Text} from '@mantine/core'
import classes from './Footer.module.css'

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Text size="sm">
        &copy; 2021-{new Date().getFullYear()} {config.siteName} by{' '}
        <a
          aria-label={`visit ${config.siteAuthor} website`}
          href={config.authorUrl}
          rel="author"
        >
          {config.siteAuthor}
        </a>
      </Text>
      <Text size="sm">
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
          aria-label="visit Rain Viewer website"
          href="https://www.rainviewer.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Rain Viewer
        </a>{' '}
        | Icons by{' '}
        <a
          aria-label="visit Meteocons website"
          href="https://meteocons.com/"
          rel="noopener norefer noreferrer"
          target="_blank"
        >
          Basmilius
        </a>
      </Text>
      <Text size="sm">
        View source code on{' '}
        <a
          aria-label="view source code on github"
          href={config.githubUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </Text>
    </footer>
  )
}
