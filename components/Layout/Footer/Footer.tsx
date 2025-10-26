import config from '@/lib/constants/config'
import classes from './Footer.module.css'

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <p>
          Weather data from{' '}
          <a
            aria-label="visit Open-Meteo website"
            href="https://open-meteo.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open-Meteo
          </a>
          . Weather app created by{' '}
          <a
            aria-label={`visit ${config.siteAuthor} website`}
            href={config.authorUrl}
            rel="author"
          >
            {config.siteAuthor}
          </a>
          . View source on{' '}
          <a
            aria-label="view source code on github"
            href={config.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
