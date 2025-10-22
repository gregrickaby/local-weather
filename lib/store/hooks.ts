import {useDispatch, useSelector, useStore} from 'react-redux'
import type {AppDispatch, AppStore, RootState} from './index'

/**
 * Typed Redux hooks for use throughout the app.
 *
 * Use these instead of plain `useDispatch` and `useSelector`.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
