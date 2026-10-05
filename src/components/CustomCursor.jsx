import useMediaQuery from '../hooks/useMediaQuery'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    // Don't render on touch devices
    if (reducedMotion || window.matchMedia('(hover: none)').matches) {
      setHidden(true)
      return
    }

    setHidden(false)
    let raf = 0
    let x = 0
    let y = 0

    // Track the pointer 1:1 — any easing here reads as input lag.
    const render = () => {
      raf = 0
      const position = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      if (dotRef.current) dotRef.current.style.transform = position
      if (ringRef.current) ringRef.current.style.transform = position
    }

    const handleMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(render)
    }

    const handleEnter = (e) => {
      const target = e.target
      if (!target || typeof target.closest !== 'function') return
      if (target.closest('[data-cursor="view"]')) {
        setHover(true)
        setText('Ver')
      } else if (target.closest('[data-cursor="explore"]')) {
        setHover(true)
        setText('Explorar')
      } else if (target.closest('a, button, [role="button"]')) {
        setHover(true)
        setText('')
      } else {
        setHover(false)
        setText('')
      }
    }

    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleEnter)

    return () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('mouseover', handleEnter)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion])

  if (hidden) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] w-1.5 h-1.5 rounded-full bg-gold-400 mix-blend-difference"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[998]"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* Scale lives on a child so its transition never fights the position updates. */}
        <div
          className="w-10 h-10 rounded-full border border-gold-400/60 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${hover ? 2.4 : 1})` }}
        >
          {text && (
            <span className="text-[10px] tracking-widest uppercase text-gold-400 font-mono">
              {text}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
