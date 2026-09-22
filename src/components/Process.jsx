import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import useMediaQuery from '../hooks/useMediaQuery'
import { CONFIRMED_PROCESS_STEPS } from '../data/businessContent'
import { trackOnce } from '../lib/analytics'

gsap.registerPlugin(ScrollTrigger)

export default function Process(){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef=useRef(null),headingRef=useRef(null)

  useEffect(()=>{
    if(!sectionRef.current)return
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        trackOnce('process-view:home','process_view',{steps:CONFIRMED_PROCESS_STEPS.length})
        observer.disconnect()
      }
    },{threshold:.2})
    observer.observe(sectionRef.current)
    return()=>observer.disconnect()
  },[])

  useEffect(()=>{
    const splitCleanup=[]
    const ctx=gsap.context(()=>{
      if(reducedMotion)return
      const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'})
      splitCleanup.push(()=>split.revert())
      gsap.set(split.words,{yPercent:110})
      ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.2,ease:'expo.out',stagger:.035})})
      gsap.from(sectionRef.current.querySelectorAll('[data-step]'),{opacity:0,y:40,duration:1,stagger:.09,ease:'expo.out',scrollTrigger:{trigger:sectionRef.current.querySelector('[data-steps]'),start:'top 80%'}})
    },sectionRef)
    return()=>{ctx.revert();splitCleanup.forEach(cleanup=>cleanup())}
  },[reducedMotion])

  return <section id="process" ref={sectionRef} aria-labelledby="process-title" className="relative py-24 md:py-40 bg-cream-200 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">05</span> / 07 — CÓMO FUNCIONA</div></div>
        <div className="col-span-12 md:col-span-8"><h2 id="process-title" ref={headingRef} className="font-display text-display leading-[.95] tracking-tightest">De la elección<br/><em className="italic text-gold-400 font-light">al proyecto.</em></h2><p className="mt-8 max-w-2xl text-navy-700/70 text-lg">Un recorrido ordenado que parte de un modelo ya resuelto y avanza con la información real de cada proyecto.</p></div>
      </div>
      <ol data-steps className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-navy-700/10">
        {CONFIRMED_PROCESS_STEPS.map((step,index)=><li key={step.id} data-step className="min-h-[260px] p-7 md:p-9 border-r border-b border-navy-700/10 flex flex-col justify-between"><div className="section-label text-gold-400">{String(index+1).padStart(2,'0')}</div><div><h3 className="font-display text-3xl md:text-4xl tracking-tighter-2 mb-4">{step.title}</h3><p className="text-navy-700/65 leading-relaxed">{step.description}</p></div></li>)}
      </ol>
    </div>
  </section>
}
