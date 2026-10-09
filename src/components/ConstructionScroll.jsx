import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import useMediaQuery from '../hooks/useMediaQuery'
import { createGestureDetector, normalizeWheelDelta } from '../lib/scrollGesture'

const VIDEO_SRC = '/videos/vora-construccion.mp4'
const FPS = 24
// Each time was picked from the film's real frames, not from an even split.
export const PHASES = [
  { time: 0, title: 'Todo empieza aquí', state: 'Excavación y preparación de la parcela.' },
  { time: 1, title: 'Cimentación', state: 'Ejecución de la cimentación de hormigón.' },
  { time: 3, title: 'Precisión industrial', state: 'Montaje de paneles y muros estructurales de hormigón.' },
  { time: 5, title: 'La estructura toma forma', state: 'Forjados, cubiertas y voladizos.' },
  { time: 8.5, title: 'Arquitectura sin límites', state: 'Fachadas, cristaleras y acabados.' },
  { time: 10.5, title: 'Cada detalle importa', state: 'Piscina, terrazas, jardines y paisajismo.' },
  { time: 15, title: 'VORA — Concrete Living', state: 'La vivienda, completamente terminada.' },
]
const LAST = PHASES.length - 1
const still = (index) => `/media/construction/phase-${index + 1}.jpg`
const pad = (value) => String(value).padStart(2, '0')
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
// A quarter frame in, so a seek always lands on the intended frame.
const frameTime = (time) => (Math.round(time * FPS) + .25) / FPS

// About this much film time per second of transition; the rate is clamped so
// short steps play at natural speed and long jumps never feel frantic.
const SECONDS_PER_TRANSITION = 1.2
const MAX_RATE = 4
const LONG_JUMP_SECONDS = 1.6
const TOUCH_THRESHOLD = 28
const INPUT_WINDOW = 300
const MOMENTUM_WINDOW = 1500
const ENGAGE_GRACE = 500
const EXIT_MS = 750

function prefersStillImages() {
  const connection = navigator.connection
  if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) return true
  return Boolean(navigator.deviceMemory && navigator.deviceMemory <= 2)
}

const isEditable = (node) => node instanceof Element && Boolean(node.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))

export default function ConstructionScroll() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const [lowEnd, setLowEnd] = useState(false)
  const [failed, setFailed] = useState(false)
  const [near, setNear] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const [phase, setPhase] = useState(0)
  const [seen, setSeen] = useState(() => new Set([0]))
  const [interactions, setInteractions] = useState(0)
  // Without motion the build is shown as stills with buttons and the page scrolls freely.
  const staticMode = reducedMotion || lowEnd

  const sectionRef = useRef(null), videoRef = useRef(null), bufferRef = useRef(null)
  const phaseRef = useRef(0)
  const readyRef = useRef(false)
  const transitionRef = useRef(null)
  const controlsRef = useRef({ goTo: () => {} })

  useEffect(() => { if (prefersStillImages()) setLowEnd(true) }, [])

  // Start fetching the film one screen before the section, never during the hero.
  useEffect(() => {
    if (staticMode || near) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect() }
    }, { rootMargin: '100% 0px' })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [staticMode, near])

  // Gestures and transitions. This effect must not restart while the reader is
  // mid-gesture, so it reads the <video> lazily instead of depending on it.
  useEffect(() => {
    const media = () => videoRef.current
    const section = sectionRef.current
    const root = document.documentElement

    const showPhase = (index) => {
      phaseRef.current = index
      setPhase(index)
      // Stills are only fetched while the film is not yet on screen.
      if (!readyRef.current) setSeen(previous => previous.has(index) ? previous : new Set(previous).add(index))
    }

    // ---------------------------------------------------------------- film
    const setMoving = (moving) => { if (section) section.dataset.moving = String(moving) }
    const cancelTransition = () => {
      const transition = transitionRef.current
      if (!transition) return
      setMoving(false)
      transition.cancelled = true
      transition.active = false
      if (transition.frame) cancelAnimationFrame(transition.frame)
      const video = media()
      if (transition.videoFrame && video?.cancelVideoFrameCallback) video.cancelVideoFrameCallback(transition.videoFrame)
      clearTimeout(transition.safety)
      clearTimeout(transition.timer)
      transitionRef.current = null
    }

    const settleOn = (target, transition) => new Promise(resolve => {
      const video = media()
      if (transition.cancelled || Math.abs(video.currentTime - target) < .5 / FPS) return resolve()
      video.addEventListener('seeked', resolve, { once: true })
      video.currentTime = target
    })

    // Forward: let the decoder play the stretch natively, then stop on the target frame.
    const playForward = (target, rate, transition) => {
      const video = media()
      video.playbackRate = rate
      return Promise.resolve(video.play()).then(() => new Promise(resolve => {
        const stopAt = target - rate / FPS
        const check = (_now, metadata) => {
          if (transition.cancelled) return resolve()
          const current = metadata?.mediaTime ?? video.currentTime
          if (current >= stopAt || video.ended) {
            video.pause()
            settleOn(target, transition).then(resolve)
            return
          }
          watch()
        }
        const watch = () => {
          if (video.requestVideoFrameCallback) transition.videoFrame = video.requestVideoFrameCallback(check)
          else transition.frame = requestAnimationFrame(() => check())
        }
        watch()
      }))
    }

    // Backward (and forward when playback is refused, e.g. iOS Low Power Mode):
    // walk the timeline frame by frame, issuing the next seek only once the
    // previous one has been decoded, so a slow decoder drops frames instead of queueing them.
    const scrub = (from, target, duration, transition) => new Promise(resolve => {
      const video = media()
      video.pause()
      const start = performance.now()
      let requested = null
      const step = (now) => {
        if (transition.cancelled) return resolve()
        const progress = Math.min(1, (now - start) / (duration * 1000))
        const next = progress >= 1 ? target : frameTime(from + (target - from) * progress)
        if (!video.seeking) {
          if (requested === target && progress >= 1) return resolve()
          if (next !== requested) { requested = next; video.currentTime = next }
        }
        transition.frame = requestAnimationFrame(step)
      }
      transition.frame = requestAnimationFrame(step)
    })

    const runFilm = (index, instant) => {
      const video = media()
      cancelTransition()
      const end = Number.isFinite(video.duration) ? video.duration - .5 / FPS : Infinity
      const target = Math.min(end, frameTime(PHASES[index].time))
      const from = video.currentTime
      const span = Math.abs(target - from)
      if (instant || span < 1 / FPS) {
        video.pause()
        if (span >= .5 / FPS) video.currentTime = target
        return
      }
      const rate = clamp(span / SECONDS_PER_TRANSITION, 1, MAX_RATE)
      // Long jumps from the progress bar would crawl even at the top rate; those
      // travel by seeking instead, in a fixed, brisk time.
      const longJump = span / MAX_RATE > LONG_JUMP_SECONDS
      const duration = longJump ? LONG_JUMP_SECONDS : span / rate
      const transition = { active: true, cancelled: false }
      transitionRef.current = transition
      setMoving(true)
      const done = () => {
        if (transition.cancelled) return
        clearTimeout(transition.safety)
        transition.active = false
        if (transitionRef.current === transition) transitionRef.current = null
        setMoving(false)
      }
      // Never stay stuck between phases, even if the network stalls mid-transition.
      transition.safety = setTimeout(() => {
        if (transition.cancelled) return
        cancelTransition()
        video.pause()
        video.currentTime = target
      }, duration * 1000 + 2500)
      const run = target > from && !longJump
        ? playForward(target, rate, transition).catch(() => transition.cancelled ? undefined : scrub(video.currentTime, target, duration, transition))
        : scrub(from, target, duration, transition)
      run.then(done)
    }

    const goTo = (index, { instant = false, user = true } = {}) => {
      index = clamp(index, 0, LAST)
      if (index === phaseRef.current && !instant) return false
      showPhase(index)
      if (user) setInteractions(count => count + 1)
      if (media() && readyRef.current && !staticMode) runFilm(index, instant)
      else if (!instant) {
        // Still images cross-fade; hold gestures for the same beat.
        cancelTransition()
        const transition = { active: true, cancelled: false }
        transition.timer = setTimeout(() => { transition.active = false; if (transitionRef.current === transition) transitionRef.current = null; setMoving(false) }, 450)
        transitionRef.current = transition
        setMoving(true)
      }
      return true
    }
    controlsRef.current = { goTo: (index) => goTo(index), cancel: cancelTransition }

    if (staticMode || !section) return () => cancelTransition()

    // ---------------------------------------------------------------- engagement
    const detector = createGestureDetector()
    let engaged = false, engagedAt = 0, lastInput = -Infinity, lastTouchEnd = -Infinity
    let previousTop = null, touch = null, realign = 0

    const busy = () => Boolean(transitionRef.current?.active)
    const sectionTop = () => section.getBoundingClientRect().top + window.scrollY

    const engage = (fromDirection) => {
      window.scrollTo(0, sectionTop())
      engaged = true
      engagedAt = performance.now()
      root.classList.add('construction-engaged')
      clearTimeout(realign)
      realign = setTimeout(() => { if (engaged && Math.abs(section.getBoundingClientRect().top) >= .5) window.scrollTo(0, sectionTop()) }, ENGAGE_GRACE + 50)
      const entry = fromDirection > 0 ? 0 : LAST
      if (phaseRef.current !== entry) goTo(entry, { instant: true, user: false })
    }
    const release = () => {
      engaged = false
      root.classList.remove('construction-engaged')
    }
    // Leave towards the neighbouring section with a short glide of our own:
    // browsers cancel a smooth scrollTo as soon as the same gesture keeps
    // sending wheel events, so the glide owns the page until it lands.
    let glide = 0
    const exit = (direction) => {
      release()
      const from = window.scrollY
      const to = direction > 0 ? sectionTop() + section.offsetHeight : sectionTop() - window.innerHeight * .75
      const start = performance.now()
      const frame = (now) => {
        const progress = Math.min(1, (now - start) / EXIT_MS)
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        window.scrollTo(0, from + (to - from) * eased)
        glide = progress < 1 ? requestAnimationFrame(frame) : 0
      }
      cancelAnimationFrame(glide)
      glide = requestAnimationFrame(frame)
    }
    // One gesture asks for one step; at either end it asks to leave instead.
    const step = (direction) => {
      if (busy()) return
      const next = phaseRef.current + direction
      if (next < 0 || next > LAST) exit(direction)
      else goTo(next)
    }

    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const delta = normalizeWheelDelta(event, window.innerHeight)
      const now = performance.now()
      lastInput = now
      const result = detector.push(delta, event.timeStamp || now)
      if (glide) { event.preventDefault(); return }
      if (engaged) {
        event.preventDefault()
        if (result.trigger) step(result.direction)
        return
      }
      // Catch the section on the exact event that would carry the page past it.
      const top = section.getBoundingClientRect().top
      const arriving = (delta > 0 && top > 0 && top - delta <= 0) || (delta < 0 && top < 0 && top - delta >= 0)
      if (arriving && Math.abs(top) < window.innerHeight) {
        event.preventDefault()
        detector.spend()
        engage(delta > 0 ? 1 : -1)
      }
    }

    const onTouchStart = (event) => {
      touch = event.touches.length === 1 ? { y: event.touches[0].clientY, spent: !engaged } : null
    }
    const onTouchMove = (event) => {
      lastInput = performance.now()
      if (!touch || event.touches.length !== 1) return
      if (glide && event.cancelable) { event.preventDefault(); return }
      if (!engaged) { touch.spent = true; return }
      if (event.cancelable) event.preventDefault()
      const travelled = touch.y - event.touches[0].clientY
      if (touch.spent || Math.abs(travelled) < TOUCH_THRESHOLD) return
      touch.spent = true
      step(Math.sign(travelled))
    }
    const onTouchEnd = () => { lastTouchEnd = performance.now(); touch = null }

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isEditable(event.target)) return
      // Home and End leave the section: unlock first so the browser can scroll.
      if (engaged && (event.key === 'Home' || event.key === 'End')) { release(); return }
      const space = event.key === ' '
      if (space && event.target instanceof Element && event.target.closest('button, a, summary, [role="button"]')) return
      const direction = ['ArrowDown', 'PageDown'].includes(event.key) || (space && !event.shiftKey) ? 1
        : ['ArrowUp', 'PageUp'].includes(event.key) || (space && event.shiftKey) ? -1 : 0
      if (!direction) return
      lastInput = performance.now()
      if (glide) { event.preventDefault(); return }
      if (!engaged) return
      event.preventDefault()
      if (!event.repeat) step(direction)
    }

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const top = rect.top
      const previous = previousTop
      previousTop = top
      const now = performance.now()
      if (engaged) {
        // Momentum or a smooth keyboard scroll still running when the section locked: hold the line.
        if (now - engagedAt < ENGAGE_GRACE) { if (Math.abs(top) >= .5) window.scrollTo(0, sectionTop()); return }
        if (Math.abs(top) < 2) return
        // Anything else moved the page (scrollbar, Tab, links, find in page): never trap.
        release()
        return
      }
      // Off screen, prepare the frame the reader will meet when they arrive.
      if (!busy()) {
        if (top >= window.innerHeight && phaseRef.current !== 0) goTo(0, { instant: true, user: false })
        else if (rect.bottom <= 0 && phaseRef.current !== LAST) goTo(LAST, { instant: true, user: false })
      }
      const recent = now - lastInput < INPUT_WINDOW || now - lastTouchEnd < MOMENTUM_WINDOW
      const crossed = previous !== null && ((previous > 0 && top <= 0) || (previous < 0 && top >= 0))
      if (crossed && recent && Math.abs(top) < window.innerHeight * .9) engage(previous > 0 ? 1 : -1)
    }

    const onResize = () => { if (engaged) window.scrollTo(0, sectionTop()) }
    // Content above that changes height (late images, fonts) would nudge the
    // locked section without any scroll event; put it back in place.
    const layout = new ResizeObserver(() => {
      if (engaged && Math.abs(section.getBoundingClientRect().top) >= .5) window.scrollTo(0, sectionTop())
    })
    layout.observe(document.body)
    // Keyboard and assistive-technology users moving focus elsewhere always get the page back.
    const onFocusIn = (event) => {
      if (!engaged || section.contains(event.target) || !(event.target instanceof Element)) return
      release()
      event.target.scrollIntoView({ block: 'nearest' })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('focusin', onFocusIn)
    onScroll()

    return () => {
      cancelTransition()
      cancelAnimationFrame(glide)
      clearTimeout(realign)
      release()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('focusin', onFocusIn)
      layout.disconnect()
    }
  }, [staticMode])

  // Video readiness: reveal the film once it can show the current phase.
  useEffect(() => {
    const video = videoRef.current
    if (staticMode || !near || !video) return
    const onBuffer = () => {
      if (!bufferRef.current || !video?.duration || !video.buffered.length) return
      const loaded = video.buffered.end(video.buffered.length - 1) / video.duration
      bufferRef.current.style.transform = `scaleX(${clamp(loaded, 0, 1).toFixed(3)})`
    }
    let primed = false
    const onReady = () => {
      if (primed) return
      primed = true
      // The film takes over only once it shows the current phase; until then
      // phase changes keep using the stills, so nothing races the first seek.
      const reveal = () => {
        const target = Math.min(frameTime(PHASES[phaseRef.current].time), video.duration - .5 / FPS)
        if (Math.abs(video.currentTime - target) >= .5 / FPS) video.currentTime = target
        readyRef.current = true
        setVideoVisible(true)
      }
      const seekToPhase = () => {
        const target = Math.min(frameTime(PHASES[phaseRef.current].time), video.duration - .5 / FPS)
        if (Math.abs(video.currentTime - target) < .5 / FPS) return reveal()
        video.addEventListener('seeked', reveal, { once: true })
        video.currentTime = target
      }
      // iOS Safari only paints seeks once the element has played.
      Promise.resolve(video.play()).then(() => { video.pause(); seekToPhase() }).catch(seekToPhase)
    }
    // A film the browser cannot play leaves the phases to the still frames.
    const onError = () => {
      readyRef.current = false
      controlsRef.current.cancel?.()
      setSeen(previous => new Set(previous).add(phaseRef.current))
      setVideoVisible(false)
      setFailed(true)
    }
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('progress', onBuffer)
    video.addEventListener('error', onError)
    if (video.readyState >= 2) onReady()
    return () => {
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('progress', onBuffer)
      video.removeEventListener('error', onError)
    }
  }, [staticMode, near])

  const goTo = (index) => controlsRef.current.goTo(index)
  const current = PHASES[phase]
  const hintHidden = interactions >= 2
  const loading = near && !videoVisible && !staticMode && !failed

  return <section id="construction" ref={sectionRef} aria-labelledby="construction-title" className="construction-stage" data-moving="false">
    <h2 id="construction-title" className="sr-only">Construcción de una vivienda VORA en siete fases</h2>
    {PHASES.map((item, index) => seen.has(index) && <img key={index} src={still(index)} alt="" width="1600" height="900" loading="lazy" decoding="async" className="construction-media construction-still" style={{ opacity: index === phase ? 1 : 0 }}/>)}
    {near && !staticMode && !failed && <video ref={videoRef} src={VIDEO_SRC} muted playsInline preload="auto" disablePictureInPicture disableRemotePlayback tabIndex={-1} aria-hidden="true" className="construction-media construction-video" style={{ opacity: videoVisible ? 1 : 0 }}/>}
    <div className="construction-shade" aria-hidden="true"/>

    <div className="construction-hud">
      {loading && <div className="hud-buffer" aria-hidden="true"><div ref={bufferRef} className="hud-buffer-bar"/></div>}
      <div className="hud-meta">
        <span>VORA — Concrete Living</span>
        <span aria-hidden="true"><span className="hud-count-current">{pad(phase + 1)}</span> / {pad(PHASES.length)}</span>
      </div>
      <div className="hud-titles" aria-hidden="true">
        {PHASES.map((item, index) => <span key={item.title} className="hud-title" data-active={index === phase}>{item.title}</span>)}
      </div>
      <ol className="hud-segments" aria-label="Fases de la construcción">
        {PHASES.map((item, index) => <li key={item.title} className="flex-1">
          <button type="button" className="hud-segment" onClick={() => goTo(index)} data-state={index < phase ? 'done' : index === phase ? 'active' : 'pending'} aria-label={`Fase ${index + 1} de ${PHASES.length}: ${item.title}`} aria-current={index === phase ? 'step' : undefined}/>
        </li>)}
      </ol>
      <div className="hud-foot">
        <span className="hud-hint" data-hidden={hintHidden} aria-hidden={hintHidden}>
          {staticMode ? <span>Usa los controles para recorrer la construcción</span> : <>
            {coarsePointer ? <SwipeIcon/> : <MouseIcon/>}
            <span>{coarsePointer ? 'Desliza para descubrir la construcción' : 'Desplázate para descubrir la construcción'}</span>
          </>}
        </span>
        <span className="hud-steps">
          <button type="button" className="hud-step" onClick={() => goTo(phase - 1)} disabled={phase === 0} aria-label="Fase anterior"><ChevronUp size={14} strokeWidth={1.6}/></button>
          <button type="button" className="hud-step" onClick={() => goTo(phase + 1)} disabled={phase === LAST} aria-label="Fase siguiente"><ChevronDown size={14} strokeWidth={1.6}/></button>
        </span>
      </div>
      <p className="sr-only" aria-live="polite">{`Fase ${phase + 1} de ${PHASES.length}: ${current.title}. ${current.state}`}</p>
    </div>
  </section>
}

function MouseIcon() {
  return <svg className="hud-icon" width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true"><rect x=".75" y=".75" width="10.5" height="16.5" rx="5.25" stroke="currentColor" strokeWidth="1"/><rect className="hud-icon-wheel" x="5.25" y="4" width="1.5" height="3.5" rx=".75" fill="currentColor"/></svg>
}

function SwipeIcon() {
  return <svg className="hud-icon" width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true"><path d="M6 16.5V2.5M2.5 6 6 2.5 9.5 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
