import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {localStorageMiddleware} from './middlewares/localStorageMiddleware'
import {airQualityApi} from './services/airQualityApi'
import {placesApi} from './services/placesApi'
import {radarApi} from './services/radarApi'
import {weatherApi} from './services/weatherApi'
import preferencesReducer from './slices/preferencesSlice'

/**
 * Create the Redux store.
 */
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      preferences: preferencesReducer,
      [weatherApi.reducerPath]: weatherApi.reducer,
      [placesApi.reducerPath]: placesApi.reducer,
      [airQualityApi.reducerPath]: airQualityApi.reducer,
      [radarApi.reducerPath]: radarApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(weatherApi.middleware)
        .concat(placesApi.middleware)
        .concat(airQualityApi.middleware)
        .concat(radarApi.middleware)
        .concat(localStorageMiddleware)
  })

  setupListeners(store.dispatch)

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
