import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger once the DOM is fully laid out
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)

    // Expose lenis to window for anchor scrolling
    window.lenis = lenis

    return () => {
      clearTimeout(refreshTimeout)
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  return <>{children}</>
}
