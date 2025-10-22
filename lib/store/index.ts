import {configureStore} from '@reduxjs/toolkit'
import {localStorageMiddleware} from './middlewares/localStorageMiddleware'
import {placesApi} from './services/placesApi'
import {weatherApi} from './services/weatherApi'
import preferencesReducer from './slices/preferencesSlice'

/**
 * Create the Redux store.
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      [weatherApi.reducerPath]: weatherApi.reducer,
      [placesApi.reducerPath]: placesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(weatherApi.middleware)
        .concat(placesApi.middleware)
        .concat(localStorageMiddleware)
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
