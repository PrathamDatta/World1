import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect warns during server rendering; fall back to useEffect there.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
