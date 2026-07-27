import { useEffect, useRef } from 'react'
import { revealText } from './motion.js'

/**
 * Attaches the blur-in text reveal (see motion.js) to an element via a ref.
 * Used by the interior-page intro headings so each page wires the effect with a
 * single line rather than repeating the ref + effect boilerplate.
 *
 * @param {{ delay?: number }} [options]
 * @returns {import('react').RefObject<HTMLElement>}
 */
export function useRevealText({ delay = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    revealText(ref.current, { delay })
  }, [delay])

  return ref
}
