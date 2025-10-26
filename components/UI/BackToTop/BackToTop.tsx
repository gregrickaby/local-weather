'use client'

import {Affix, Button, rem, Transition} from '@mantine/core'
import {useWindowScroll} from '@mantine/hooks'
import {IconArrowUp} from '@tabler/icons-react'
import classes from './BackToTop.module.css'

/**
 * Back To Top component.
 */
export default function BackToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <div className={classes.backtotop}>
      <Affix position={{bottom: rem(20), right: rem(20)}}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              aria-label="scroll to top"
              style={transitionStyles}
              onClick={() => scrollTo({y: 0})}
              size="lg"
              radius="xl"
              p="md"
            >
              <IconArrowUp size="1.25rem" />
            </Button>
          )}
        </Transition>
      </Affix>
    </div>
  )
}
