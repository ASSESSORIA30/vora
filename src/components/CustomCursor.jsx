import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(hover: none)').matches) {
      setHidden(true)
      return
    }

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let dotX = mouseX
    let dotY = mouseY

    const handleMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
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

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleEnter)

    let raf
    const loop = () => {
      dotX += (mouseX - dotX) * 0.45
      dotY += (mouseY - dotY) * 0.45
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${hover ? 2.4 : 1})`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleEnter)
      cancelAnimationFrame(raf)
    }
  }, [hover])

  if (hidden) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] w-1.5 h-1.5 rounded-full bg-gold-400 mix-blend-difference"
        style={{ transition: 'width 0.3s ease, height 0.3s ease' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[998] w-10 h-10 rounded-full border border-gold-400/60 flex items-center justify-center transition-transform duration-300 ease-out"
      >
        {text && (
          <span className="text-[10px] tracking-widest uppercase text-gold-400 font-mono">
            {text}
          </span>
        )}
      </div>
    </>
  )
}
