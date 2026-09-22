import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMediaQuery from '../hooks/useMediaQuery'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { track } from '../lib/analytics'

gsap.registerPlugin(ScrollTrigger)
export default function Hero(){
  const heroRef=useRef(null),titleRef=useRef(null),subtitleRef=useRef(null),ctaRef=useRef(null),mediaRef=useRef(null)
  const mobile=useMediaQuery('(max-width:767px)')
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const [videoReady,setVideoReady]=useState(false)
  useEffect(()=>{
    if(reducedMotion||navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType)||(navigator.deviceMemory&&navigator.deviceMemory<=2))return
    let idleId,timeoutId
    const schedule=()=>{
      if(document.visibilityState==='hidden')return
      if('requestIdleCallback' in window)idleId=window.requestIdleCallback(()=>setVideoReady(true),{timeout:1800})
      else timeoutId=window.setTimeout(()=>setVideoReady(true),650)
    }
    if(document.readyState==='complete')schedule()
    else window.addEventListener('load',schedule,{once:true})
    return()=>{window.removeEventListener('load',schedule);if(idleId)window.cancelIdleCallback?.(idleId);if(timeoutId)window.clearTimeout(timeoutId)}
  },[reducedMotion])
  useEffect(()=>{
    if(reducedMotion)return
    const ctx=gsap.context(()=>{
      gsap.fromTo(mediaRef.current,{scale:1.02},{scale:1,duration:1.35,ease:'power2.out'})
      gsap.to(mediaRef.current,{scale:1.06,ease:'none',scrollTrigger:{trigger:heroRef.current,start:'top top',end:'bottom top',scrub:1}})
    },heroRef)
    return()=>ctx.revert()
  },[reducedMotion])
  const src=mobile?'/media/hero/hero-mobile.mp4':'/media/hero/hero-desktop.mp4',poster=mobile?'/media/hero/hero-mobile-poster.jpg':'/media/hero/hero-desktop-poster.jpg'
  return <section id="top" ref={heroRef} className="relative min-h-[100svh] min-h-[100dvh] w-full overflow-hidden bg-navy-800 text-cream-200"><div ref={mediaRef} className="absolute inset-0"><picture><source media="(max-width: 767px)" srcSet="/media/hero/hero-mobile-poster.jpg"/><img src="/media/hero/hero-desktop-poster.jpg" alt="" width="1600" height="900" decoding="async" fetchpriority="high" className="absolute inset-0 w-full h-full object-cover"/></picture>{videoReady&&!reducedMotion&&!navigator.connection?.saveData&&!['slow-2g','2g'].includes(navigator.connection?.effectiveType)&&!(navigator.deviceMemory&&navigator.deviceMemory<=2)&&<video key={src} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline preload="none" poster={poster} aria-hidden="true"><source src={src} type="video/mp4"/></video>}</div><div className="absolute inset-0 hero-vignette"/><div className="absolute inset-0 hero-sidefade"/><div className="hero-kicker absolute top-0 inset-x-0 pt-28 md:pt-32 px-6 md:px-12 z-10"><div className="section-label text-cream-200/65 max-w-[1600px] mx-auto">ARQUITECTURA DE HORMIGÓN · READY TO LIVE</div></div><div className="hero-content relative z-10 min-h-[100svh] min-h-[100dvh] flex flex-col justify-end px-6 md:px-12 pt-28 pb-7 md:pb-20 max-w-[1600px] mx-auto"><div className="max-w-5xl"><h1 ref={titleRef} className="hero-title font-display text-[clamp(4.2rem,21vw,5.5rem)] md:text-hero leading-[.86] md:leading-[.88] tracking-tightest">Tu casa.<br/>Ya <em className="italic text-gold-200 font-light">resuelta.</em></h1><p ref={subtitleRef} className="hero-copy mt-5 md:mt-9 max-w-xl text-[15px] md:text-lg text-cream-200/82 leading-relaxed">Viviendas industrializadas de hormigón, completamente equipadas y preparadas para vivir. Escoges el modelo. Nosotros hacemos el resto.</p></div><div ref={ctaRef} className="mt-6 md:mt-12 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-9"><a href="#models" onClick={()=>track('cta_click',{cta:'hero_collection'})} className="btn-primary group !bg-cream-200 !text-navy-700 !px-6 !py-3.5 whitespace-nowrap"><span>Descubrir la colección</span><ArrowUpRight size={16}/></a><a href="#process" className="min-h-11 flex items-center gap-3 text-sm font-medium text-cream-200 link-underline"><span className="w-8 h-8 rounded-full border border-cream-200/35 flex items-center justify-center"><ArrowDown size={12}/></span>Cómo funciona VORA</a></div><div className="hero-footer mt-6 md:mt-16 pt-5 border-t border-cream-200/20 flex justify-between section-label text-cream-200/60"><span>VORA · CONCRETE LIVING</span><span className="hidden md:inline">07 MODELOS · 3—5 DORMITORIOS</span></div></div></section>
}
