import { useIsoLayoutEffect } from './iso.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Wrap each word in a masked span so it can slide up. `em` = words rendered in italic accent. */
export function Split({ as: Tag = 'h2', text, em = [], className = '', ...rest }) {
  const norm = (w) => w.toLowerCase().replace(/[.,?]/g, '')
  const emSet = new Set(em.map(norm))
  const words = text.split(' ')
  return (
    <Tag className={className} data-split aria-label={text} {...rest}>
      {words.map((w, i) => {
        const isEm = emSet.has(norm(w))
        return (
          <span key={i} aria-hidden="true">
            <span className="sw">
              <span>{isEm ? <em>{w}</em> : w}</span>
            </span>{' '}
          </span>
        )
      })}
    </Tag>
  )
}

/**
 * Page-level reveal choreography. Elements opt in with data attributes:
 *   [data-split]  words slide up from a mask
 *   [data-reveal] fade + rise
 *   [data-draw]   SVG path draws itself (stroke-dashoffset)
 * Everything is visible by default; motion is applied only when reduced-motion is off.
 */
export function usePageAnimations(ref, deps = []) {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = ref.current
        if (!root) return
        root.querySelectorAll('[data-split]').forEach((el) => {
          const inner = el.querySelectorAll('.sw > span')
          // y is pinned to 0 on both sides: GSAP otherwise adopts the CSS pre-hide offset (translateY(115%)) as a pixel `y`.
          gsap.fromTo(inner, { yPercent: 115, y: 0 }, {
            yPercent: 0,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.045,
            delay: el.hasAttribute('data-hero') ? 0.25 : 0,
            scrollTrigger: el.hasAttribute('data-hero') ? undefined : { trigger: el, start: 'top 88%', once: true },
          })
        })
        root.querySelectorAll('[data-reveal]').forEach((el) => {
          const d = parseFloat(el.dataset.delay || '0')
          gsap.fromTo(el, { y: 36, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: d,
            ease: 'power3.out',
            scrollTrigger: el.hasAttribute('data-hero') ? undefined : { trigger: el, start: 'top 90%', once: true },
          })
        })
        root.querySelectorAll('[data-stagger]').forEach((el) => {
          gsap.fromTo(el.children, { y: 30, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
        root.querySelectorAll('[data-draw]').forEach((el) => {
          const paths = el.matches('path,line,polyline,circle,rect') ? [el] : el.querySelectorAll('path,line,polyline,circle,rect')
          paths.forEach((p) => {
            p.setAttribute('pathLength', '1')
          })
          gsap.fromTo(
            paths,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 2.2,
              ease: 'power2.inOut',
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            },
          )
        })
        // Count-ups (only used on verified numbers)
        root.querySelectorAll('[data-count]').forEach((el) => {
          const end = parseInt(el.dataset.count, 10)
          const o = { v: 0 }
          gsap.to(o, {
            v: end,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = Math.round(o.v)),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
      })
    }, ref)
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(t)
      mm.revert()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
