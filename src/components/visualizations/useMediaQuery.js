import { useCallback, useSyncExternalStore } from 'react'

const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

/** Reactive matchMedia: true while `query` matches. False during server rendering. */
export const useMediaQuery = query => {
  const subscribe = useCallback(
    onChange => {
      if (!canMatch()) return () => {}
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query]
  )
  const getSnapshot = useCallback(() => canMatch() && window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export default useMediaQuery
