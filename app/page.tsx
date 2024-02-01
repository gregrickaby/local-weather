'use client'

import classes from '@/app/Page.module.css'
import Alerts from '@/components/Alerts'
import BackToTop from '@/components/BackTopTop'
import CurrentConditions from '@/components/CurrentConditions'
import Footer from '@/components/Footer'
import Forecast from '@/components/Forecast'
import Header from '@/components/Header'
import Search from '@/components/Search'
import {useWeatherContext} from '@/components/WeatherProvider'
import {LoadingOverlay} from '@mantine/core'

/**
 * Home page component.
 */
export default function HomePage() {
  const {isLoading} = useWeatherContext()

  return (
    <>
      <div className={classes.container}>
        <Header />
        <LoadingOverlay visible={isLoading} />
        {!isLoading && (
          <main className={classes.main}>
            <div className={classes.search}>
              <Search />
            </div>
            <CurrentConditions />
            <Forecast />
            <Alerts />
          </main>
        )}
        <Footer />
        <BackToTop />
      </div>
    </>
  )
}
