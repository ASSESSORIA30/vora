import { useEffect, useRef, useState } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'

// Each caption peaks at its point of the build. The video occupies the first
// VIDEO_SPAN of the scroll so the finished house holds for a moment before release.
const CAPTIONS = [
  { at: 0, kicker: '00 — TERRENO', text: <>El futuro de<br/><em className="italic font-light text-gold-200">la construcción</em></> },
  { at: .25, kicker: '01 — ESTRUCTURA', text: <>Precisión<br/><em className="italic font-light text-gold-200">industrial</em></> },
  { at: .5, kicker: '02 — VOLUMEN', text: <>Hormigón. Diseño.<br/><em className="italic font-light text-gold-200">Solidez.</em></> },
  { at: .75, kicker: '03 — ACABADOS', text: <>Cada detalle<br/><em className="italic font-light text-gold-200">importa</em></> },
  { at: 1, kicker: '04 — LISTA PARA VIVIR', text: <>VORA —<br/><em className="italic font-light text-gold-200">Concrete Living</em></> },
]
const VIDEO_SPAN = .9
const FPS = 24
const HOLD = .055, FADE = .075

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function captionState(index, progress) {
  const { at } = CAPTIONS[index]
  // The first and last captions stay on screen at the very edges of the section.
  if (index === 0 && progress <= at) return { opacity: 1, offset: 0 }
  if (index === CAPTIONS.length - 1 && progress >= at) return { opacity: 1, offset: 0 }
  const distance = progress - at
  const opacity = 1 - clamp((Math.abs(distance) - HOLD) / FADE)
  return { opacity, offset: clamp(-distance / (HOLD + FADE), -1, 1) }
}

function canScrub() {
  const connection = navigator.connection
  if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) return false
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false
  return typeof HTMLVideoElement !== 'undefined'
}

export default function ConstructionScroll() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width:767px)')
  const [unsupported, setUnsupported] = useState(false)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  const sectionRef = useRef(null), videoRef = useRef(null), barRef = useRef(null), counterRef = useRef(null)
  const captionRefs = useRef([])
  const staticMode = reducedMotion || unsupported

  useEffect(() => { if (!canScrub()) setUnsupported(true) }, [])

  // Fetch the video only as the reader approaches, so it never competes with the hero.
  useEffect(() => {
    if (staticMode || near) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect() }
    }, { rootMargin: '150% 0px' })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [staticMode, near])

  useEffect(() => {
    if (staticMode) return
    const section = sectionRef.current, video = videoRef.current
    let frame = 0, progress = 0, shown = -1, smoothed = 0, duration = 0, lastSeek = -1

    const measure = () => {
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      progress = travel > 0 ? clamp(-rect.top / travel) : 0
    }

    const paintOverlay = () => {
      CAPTIONS.forEach((_, index) => {
        const node = captionRefs.current[index]
        if (!node) return
        const { opacity, offset } = captionState(index, clamp(progress / VIDEO_SPAN))
        node.style.opacity = opacity.toFixed(3)
        node.style.transform = `translate3d(0, ${(offset * 18).toFixed(2)}px, 0)`
        node.style.visibility = opacity > 0 ? 'visible' : 'hidden'
      })
      const built = clamp(progress / VIDEO_SPAN)
      if (barRef.current) barRef.current.style.transform = `scaleX(${built.toFixed(4)})`
      if (counterRef.current) counterRef.current.textContent = String(Math.round(built * 100)).padStart(3, '0')
    }

    // Ease the playhead towards the scroll target; seek at most once per frame and
    // never while a previous seek is still decoding, so the decoder is never flooded.
    const tick = () => {
      frame = 0
      if (shown !== progress) { shown = progress; paintOverlay() }
      if (!duration) return
      const target = clamp(progress / VIDEO_SPAN) * duration
      smoothed += (target - smoothed) * .22
      if (Math.abs(target - smoothed) < .5 / FPS) smoothed = target
      const snapped = Math.min(duration - .001, Math.round(smoothed * FPS) / FPS)
      if (!video.seeking && snapped !== lastSeek) {
        lastSeek = snapped
        video.currentTime = snapped
      }
      if (smoothed !== target || video.seeking) schedule()
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick) }
    const onScroll = () => { measure(); schedule() }

    const onMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      duration = video.duration
      measure()
      smoothed = clamp(progress / VIDEO_SPAN) * duration
      lastSeek = -1
      // iOS Safari only paints seeks once the element has started playback.
      const primed = video.play()
      if (primed?.then) primed.then(() => { video.pause(); schedule() }).catch(schedule)
      else { video.pause(); schedule() }
    }
    const onLoaded = () => setReady(true)
    const onError = () => setUnsupported(true)

    video?.addEventListener('loadedmetadata', onMetadata)
    video?.addEventListener('loadeddata', onLoaded)
    video?.addEventListener('seeked', schedule)
    video?.addEventListener('error', onError)
    if (video && video.readyState >= 1) onMetadata()
    if (video && video.readyState >= 2) onLoaded()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      video?.removeEventListener('loadedmetadata', onMetadata)
      video?.removeEventListener('loadeddata', onLoaded)
      video?.removeEventListener('seeked', schedule)
      video?.removeEventListener('error', onError)
    }
  }, [staticMode, near, mobile])

  if (staticMode) return <section id="construction" aria-labelledby="construction-title" className="relative bg-navy-800 text-cream-200">
    <div className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <img src="/media/construction/construction-end.jpg" alt="Vivienda VORA de hormigón terminada, con piscina y vistas al mar" width="1280" height="960" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center"/>
      <div className="absolute inset-0 construction-veil"/>
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 md:pb-20">
        <div className="section-label text-cream-200/70 mb-5">CONSTRUCCIÓN INDUSTRIALIZADA</div>
        <h2 id="construction-title" className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[.92] tracking-tightest">VORA —<br/><em className="italic font-light text-gold-200">Concrete Living</em></h2>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 section-label text-cream-200/70">
          {['El futuro de la construcción', 'Precisión industrial', 'Hormigón. Diseño. Solidez.', 'Cada detalle importa'].map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </div>
  </section>

  const src = mobile ? '/media/construction/construction-mobile.mp4' : '/media/construction/construction-desktop.mp4'
  return <section id="construction" ref={sectionRef} aria-labelledby="construction-title" className="construction-scroll relative h-[350vh] bg-navy-800 text-cream-200">
    <div className="sticky top-0 h-screen h-[100svh] overflow-hidden">
      <img src="/media/construction/construction-start.jpg" alt="" width="1280" height="960" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center"/>
      {near && <video key={src} ref={videoRef} src={src} muted playsInline preload="auto" disablePictureInPicture disableRemotePlayback tabIndex={-1} aria-hidden="true" className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}/>}
      <div className="absolute inset-0 construction-veil"/>

      <div className="absolute top-0 inset-x-0 z-10 pt-24 md:pt-28 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex justify-between section-label text-cream-200/70">
          <span>CONSTRUCCIÓN INDUSTRIALIZADA</span>
          <span className="hidden md:inline">DESLIZA PARA CONSTRUIR</span>
        </div>
      </div>

      <h2 id="construction-title" className="sr-only">VORA — Concrete Living: así se construye una vivienda industrializada de hormigón</h2>
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-24 md:pb-28">
        <div className="relative max-w-[1600px] mx-auto min-h-[8.5rem] md:min-h-[12rem]">
          {CAPTIONS.map((caption, index) => <div key={caption.kicker} ref={node => { captionRefs.current[index] = node }} aria-hidden="true" className="construction-caption absolute left-0 bottom-0 max-w-4xl" style={{ opacity: index === 0 ? 1 : 0, visibility: index === 0 ? 'visible' : 'hidden' }}>
            <div className="section-label text-gold-200/90 mb-4">{caption.kicker}</div>
            <p className="font-display text-[clamp(2.4rem,6.4vw,6rem)] leading-[.92] tracking-tightest">{caption.text}</p>
          </div>)}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-7 md:pb-10">
        <div className="max-w-[1600px] mx-auto flex items-center gap-5 section-label text-cream-200/70">
          <span aria-hidden="true"><span ref={counterRef}>000</span> %</span>
          <div className="relative flex-1 h-px bg-cream-200/20 overflow-hidden"><div ref={barRef} className="absolute inset-0 bg-cream-200 origin-left" style={{ transform: 'scaleX(0)' }}/></div>
          <span>VORA · CONCRETE LIVING</span>
        </div>
      </div>
    </div>
  </section>
}
