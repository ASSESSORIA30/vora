import { useEffect } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger once the DOM is fully laid out
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)

    // Expose lenis to window for anchor scrolling
    window.lenis = lenis

    return () => {
      clearTimeout(refreshTimeout)
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      window.lenis = null
    }
  }, [reducedMotion])

  return <>{children}</>
}
