'use client'

import {AppStore, makeStore} from '@/lib/store'
import {setMounted} from '@/lib/store/slices/preferencesSlice'
import type {ChildrenProps} from '@/lib/types'
import {useEffect, useRef} from 'react'
import {Provider} from 'react-redux'

/**
 * Redux store provider component.
 */
export default function StoreProvider({children}: Readonly<ChildrenProps>) {
  const storeRef = useRef<AppStore | undefined>(undefined)

  storeRef.current ??= makeStore()

  useEffect(() => {
    // Mark as mounted after hydration to avoid SSR mismatch
    storeRef.current?.dispatch(setMounted(true))
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
