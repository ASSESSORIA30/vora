import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null), headingRef = useRef(null), paragraphRef = useRef(null), statsRef = useRef(null), imageRef = useRef(null), imageWrapRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'})
      gsap.set(split.words,{yPercent:110})
      ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})})
      gsap.from(paragraphRef.current,{opacity:0,y:30,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:paragraphRef.current,start:'top 80%'}})
      const statItems = statsRef.current.querySelectorAll('[data-stat]')
      gsap.from(statItems,{opacity:0,y:30,duration:1,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:statsRef.current,start:'top 80%'}})
      statItems.forEach(el=>{const target=parseFloat(el.dataset.stat);const numEl=el.querySelector('[data-num]');if(!numEl)return;const obj={val:0};gsap.to(obj,{val:target,duration:2,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%'},onUpdate:()=>numEl.textContent=Math.round(obj.val).toLocaleString('es-ES')})})
      gsap.fromTo(imageWrapRef.current,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.6,ease:'expo.inOut',scrollTrigger:{trigger:imageWrapRef.current,start:'top 80%'}})
      gsap.to(imageRef.current,{yPercent:12,ease:'none',scrollTrigger:{trigger:imageWrapRef.current,start:'top bottom',end:'bottom top',scrub:true}})
    },sectionRef)
    return ()=>ctx.revert()
  },[])

  return <section id="about" ref={sectionRef} className="relative py-24 md:py-40 bg-cream-200 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-4 md:gap-8 mb-12 md:mb-20">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">01</span> / 07 — CONCEPTO</div></div>
        <div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest text-navy-700">La arquitectura ya está pensada.<br/><em className="italic text-gold-400 font-light">Tú empiezas</em> a vivirla.</h2></div>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-5"><p ref={paragraphRef} className="text-lg md:text-xl leading-relaxed text-navy-700/75">VORA convierte una de las decisiones más complejas de la vida en una elección clara. Casas de hormigón con arquitectura, distribución y equipamiento concebidos como un único producto.<br/><br/><span className="text-navy-700">Escoges el modelo. Lo adaptamos técnicamente a tu parcela. Lo construimos, lo equipamos y te entregamos las llaves.</span></p></div>
      </div>
      <div ref={imageWrapRef} className="relative mt-16 md:mt-28 aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm bg-navy-700">
        <div ref={imageRef} className="absolute inset-0 scale-110"><img src="/media/houses/model-06-exterior.webp" alt="VORA 200, vivienda de hormigón contemporánea" className="w-full h-full object-cover" loading="lazy"/></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-700/45 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-cream-200"><div className="section-label text-cream-200/70 mb-1">VORA 200</div><div className="font-display text-xl md:text-2xl tracking-tighter-2">Concrete Living · Architecture ready to live</div></div>
      </div>
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mt-16 md:mt-24 pt-10 border-t border-navy-700/10">
        <div data-stat="7"><div className="section-label text-navy-700/50 mb-2">MODELOS</div><div className="font-display text-5xl md:text-7xl tracking-tightest"><span data-num>0</span></div></div>
        <div data-stat="245"><div className="section-label text-navy-700/50 mb-2">HASTA</div><div className="font-display text-5xl md:text-7xl tracking-tightest"><span data-num>0</span><span className="text-gold-400 text-2xl md:text-3xl ml-1">m²</span></div></div>
        <div data-stat="100"><div className="section-label text-navy-700/50 mb-2">EQUIPADA</div><div className="font-display text-5xl md:text-7xl tracking-tightest"><span data-num>0</span><span className="text-gold-400">%</span></div></div>
        <div data-stat="1"><div className="section-label text-navy-700/50 mb-2">INTERLOCUTOR</div><div className="font-display text-5xl md:text-7xl tracking-tightest"><span data-num>0</span></div></div>
      </div>
    </div>
  </section>
}
