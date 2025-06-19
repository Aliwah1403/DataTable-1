/*
 * Source: https://usehooks-ts.com/react-hook/use-debounce-callback
 */

import { useEffect, useMemo, useRef } from 'react'
import { debounce } from '../lib/debounce'
import { useUnmount } from './use-unmount'

export function useDebounceCallback(func, delay = 500, options) {
  const debouncedFunc = useRef(null)

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel()
    }
  })

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options)

    const wrappedFunc = (...args) => {
      return debouncedFuncInstance(...args);
    }

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel()
    }

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current
    }

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    }

    return wrappedFunc
  }, [func, delay, options])

  // Update the debounced function ref whenever func, wait, or options change
  useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options)
  }, [func, delay, options])

  return debounced
}
