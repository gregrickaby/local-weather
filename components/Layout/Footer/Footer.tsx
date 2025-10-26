import config from '@/lib/constants/config'
import {IconBrandGithub} from '@tabler/icons-react'
import classes from './Footer.module.css'

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <p className={classes.attribution}>
          Weather data by{' '}
          <a
            aria-label="visit Open-Meteo website"
            href="https://open-meteo.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open-Meteo
          </a>
        </p>
        <p className={classes.divider}>·</p>
        <p className={classes.author}>
          Created by{' '}
          <a
            aria-label={`visit ${config.siteAuthor} website`}
            href={config.authorUrl}
            rel="author"
          >
            {config.siteAuthor}
          </a>
        </p>
        <p className={classes.divider}>·</p>
        <p className={classes.github}>
          <a
            aria-label="view source code on github"
            href={config.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub size={18} />
            <span>Source</span>
          </a>
        </p>
      </div>
    </footer>
  )
}
