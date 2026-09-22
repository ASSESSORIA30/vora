import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import useMediaQuery from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

const FACTS=[
  ['07','Modelos'],
  ['03—05','Dormitorios'],
  ['03','Ambientes interiores'],
  ['01','Colección'],
]

export default function About() {
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef=useRef(null),headingRef=useRef(null),paragraphRef=useRef(null),factsRef=useRef(null),imageRef=useRef(null),imageWrapRef=useRef(null)

  useEffect(() => {
    const splitCleanup=[]
    const ctx=gsap.context(() => {
      if(reducedMotion)return
      const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'})
      splitCleanup.push(()=>split.revert())
      gsap.set(split.words,{yPercent:110})
      ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})})
      gsap.from(paragraphRef.current,{opacity:0,y:30,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:paragraphRef.current,start:'top 80%'}})
      gsap.from(factsRef.current.children,{opacity:0,y:30,duration:1,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:factsRef.current,start:'top 80%'}})
      gsap.fromTo(imageWrapRef.current,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.6,ease:'expo.inOut',scrollTrigger:{trigger:imageWrapRef.current,start:'top 80%'}})
      gsap.to(imageRef.current,{yPercent:12,ease:'none',scrollTrigger:{trigger:imageWrapRef.current,start:'top bottom',end:'bottom top',scrub:true}})
    },sectionRef)
    return()=>{ctx.revert();splitCleanup.forEach(cleanup=>cleanup())}
  },[reducedMotion])

  return <section id="about" ref={sectionRef} className="relative py-24 md:py-40 bg-cream-200 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-4 md:gap-8 mb-12 md:mb-20">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">01</span> / 07 — CONCEPTO</div></div>
        <div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest text-navy-700">La arquitectura ya está pensada.<br/><em className="italic text-gold-400 font-light">Tú eliges</em> cómo vivirla.</h2></div>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-5"><p ref={paragraphRef} className="text-lg md:text-xl leading-relaxed text-navy-700/75">VORA reúne siete viviendas industrializadas de hormigón con arquitectura, distribución y equipamiento definidos como una colección.<br/><br/><span className="text-navy-700">Puedes compararlas, revisar sus planos y configurar acabados antes de compartir tu proyecto.</span></p></div>
      </div>
      <div ref={imageWrapRef} className="relative mt-16 md:mt-28 aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm bg-navy-700">
        <div ref={imageRef} className="absolute inset-0 scale-110"><img src="/media/houses/model-06-exterior.webp" alt="VORA 200, vivienda de hormigón contemporánea" className="w-full h-full object-cover" loading="lazy" decoding="async"/></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-700/45 via-transparent to-transparent"/>
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-cream-200"><div className="section-label text-cream-200/70 mb-1">VORA 200</div><div className="font-display text-xl md:text-2xl tracking-tighter-2">Concrete Living · Architecture ready to live</div></div>
      </div>
      <dl ref={factsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mt-16 md:mt-24 pt-10 border-t border-navy-700/10">
        {FACTS.map(([value,label])=><div key={label}><dt className="section-label text-navy-700/50 mb-2">{label}</dt><dd className="font-display text-5xl md:text-7xl tracking-tightest">{value}</dd></div>)}
      </dl>
    </div>
  </section>
}
