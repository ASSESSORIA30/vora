import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef(null), titleRef = useRef(null), subtitleRef = useRef(null), metaRef = useRef(null), ctaRef = useRef(null), sideRef = useRef(null), mediaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(titleRef.current, { types: 'lines,words', lineClass: 'reveal-line' })
      gsap.set(split.words, { yPercent: 110 })
      gsap.set([subtitleRef.current, metaRef.current, ctaRef.current, sideRef.current], { opacity: 0, y: 30 })
      gsap.set(mediaRef.current, { opacity: 0, scale: 1.03 })
      gsap.timeline({ delay: 0.18 })
        .to(mediaRef.current, { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' })
        .to(split.words, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.06 }, '-=1.3')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, '-=1')
        .to(metaRef.current, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.8')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.7')
        .to(sideRef.current, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.7')

      gsap.to(titleRef.current, { yPercent: -16, opacity: .5, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to(mediaRef.current, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-navy-800 text-cream-200">
      <div ref={mediaRef} className="absolute inset-0">
        <video className="hidden md:block w-full h-full object-cover" autoPlay muted playsInline preload="metadata" poster="/media/hero/hero-desktop-poster.jpg">
          <source src="/media/hero/hero-desktop.mp4" type="video/mp4" />
        </video>
        <video className="md:hidden w-full h-full object-cover" autoPlay muted playsInline preload="metadata" poster="/media/hero/hero-mobile-poster.jpg">
          <source src="/media/hero/hero-mobile.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 hero-sidefade" />
      <div className="absolute top-0 left-0 right-0 pt-28 md:pt-32 px-6 md:px-12 z-10 pointer-events-none">
        <div className="flex justify-between items-start section-label text-cream-200/65 max-w-[1600px] mx-auto">
          <span>ARQUITECTURA DE HORMIGÓN · READY TO LIVE</span><span className="hidden md:inline">VORA / CONCRETE LIVING</span>
        </div>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-20 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            <h1 ref={titleRef} className="font-display text-hero leading-[0.88] tracking-tightest text-cream-200">Tu casa.<br />Ya <em className="italic text-gold-200 font-light">resuelta.</em></h1>
            <p ref={subtitleRef} className="mt-7 md:mt-9 max-w-lg text-base md:text-lg text-cream-200/82 leading-relaxed">Arquitectura de hormigón concebida como un producto completo. Diseñada, construida, equipada y preparada para vivir.</p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pb-3">
            <div ref={metaRef} className="grid grid-cols-2 lg:block gap-6 lg:space-y-6 lg:text-right">
              <div><div className="section-label text-cream-200/55">Colección</div><div className="font-display text-3xl md:text-5xl mt-1 tracking-tighter">90<span className="text-gold-200">—</span>245 <span className="text-sm font-sans text-cream-200/60">m²</span></div></div>
              <div><div className="section-label text-cream-200/55">Modelos</div><div className="font-display text-3xl md:text-5xl mt-1 tracking-tighter">07</div></div>
            </div>
          </div>
        </div>
        <div ref={ctaRef} className="mt-9 md:mt-12 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-9">
          <button onClick={() => window.lenis?.scrollTo(document.querySelector('#models'), { offset: -20, duration: 1.6 })} className="btn-primary group bg-cream-200 !text-navy-700"><span>Descubrir la colección</span><ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
          <button onClick={() => window.lenis?.scrollTo(document.querySelector('#about'), { offset: -20, duration: 1.6 })} className="flex items-center gap-3 text-sm font-medium text-cream-200 link-underline"><span className="w-8 h-8 rounded-full border border-cream-200/35 flex items-center justify-center"><ArrowDown size={12} /></span>Descubre el concepto</button>
        </div>
        <div ref={sideRef} className="mt-10 md:mt-16 pt-5 border-t border-cream-200/20 flex flex-col md:flex-row justify-between gap-3 text-xs text-cream-200/65"><span className="section-label">VORA · CONCRETE LIVING</span><span className="section-label"><span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-200 mr-2 animate-shimmer" />COLECCIÓN 2026</span></div>
      </div>
    </section>
  )
}
