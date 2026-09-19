import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { number:'01', title:'Escoge', duration:'MODELO', description:'Elige la VORA que encaja con tu forma de vivir. La arquitectura y la distribución ya están resueltas.', keywords:['90—245 m²','7 modelos','Sin rediseñar desde cero'] },
  { number:'02', title:'Parcela', duration:'VIABILIDAD', description:'Estudiamos la parcela y comprobamos encaje, accesos, orientación y condicionantes urbanísticos básicos.', keywords:['Parcela','Accesos','Implantación'] },
  { number:'03', title:'Adaptación', duration:'TÉCNICA', description:'Adaptamos el modelo técnicamente al solar y se desarrolla la documentación necesaria para tramitar el proyecto y las licencias.', keywords:['Proyecto','Licencias','Coordinación'] },
  { number:'04', title:'Cimentación', duration:'OBRA PREVIA', description:'Preparamos la base y las acometidas para recibir la vivienda industrializada en las condiciones previstas.', keywords:['Cimentación','Acometidas','Preparación'] },
  { number:'05', title:'Fabricación', duration:'INDUSTRIAL', description:'La vivienda se fabrica mediante un proceso industrializado de hormigón, con control de producción y una secuencia definida.', keywords:['Hormigón','Precisión','Control'] },
  { number:'06', title:'Montaje', duration:'FINALIZACIÓN', description:'La vivienda llega a parcela, se monta y se completan las conexiones, acabados y equipamiento previstos para el modelo.', keywords:['Montaje','Acabados','Equipamiento'] },
  { number:'07', title:'Llaves', duration:'READY TO LIVE', description:'Te entregamos una casa terminada, equipada y amueblada según la especificación seleccionada. Tú solo tienes que entrar.', keywords:['Entrega','Amueblada','Lista para vivir'] },
]

export default function Process(){
  const sectionRef=useRef(null),headingRef=useRef(null),lineRef=useRef(null),stepsWrapRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})});gsap.fromTo(lineRef.current,{scaleY:0},{scaleY:1,ease:'none',transformOrigin:'top center',scrollTrigger:{trigger:stepsWrapRef.current,start:'top 70%',end:'bottom 70%',scrub:.8}});stepsWrapRef.current.querySelectorAll('[data-step]').forEach(step=>gsap.from(step,{opacity:0,y:60,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:step,start:'top 80%'}}))},sectionRef);return()=>ctx.revert()},[])
  return <section id="process" ref={sectionRef} className="relative py-24 md:py-40 bg-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12">
    <div className="grid grid-cols-12 gap-4 md:gap-8 mb-16 md:mb-28"><div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">03</span> / 07 — PROCESO</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest">Escoge tu casa.<br/><em className="italic text-gold-400 font-light">Nosotros</em> hacemos el resto.</h2><p className="mt-8 max-w-lg text-navy-700/70 text-lg leading-relaxed">Un proceso pensado para eliminar decisiones innecesarias, coordinación dispersa e incertidumbre.</p></div></div>
    <div ref={stepsWrapRef} className="relative pl-4 md:pl-0"><div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-navy-700/10 -translate-x-1/2"/><div ref={lineRef} className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gold-400 -translate-x-1/2 origin-top"/>
      {STEPS.map((step,i)=><div key={step.number} data-step className={`relative py-10 md:py-16 grid grid-cols-12 gap-4 md:gap-8 items-start ${i%2===0?'':'md:[&>*:first-child]:order-2'}`}><div className="absolute left-4 md:left-1/2 top-10 md:top-16 w-3 h-3 rounded-full bg-gold-400 -translate-x-1/2 ring-4 ring-cream-200"/><div className={`col-span-12 md:col-span-6 ${i%2===0?'md:text-right md:pr-20':'md:pl-20'} pl-8 md:pl-0`}><div className="section-label text-navy-700/40 mb-3">ETAPA {step.number}</div><h3 className="font-display text-5xl md:text-7xl leading-none tracking-tightest">{step.title}</h3><div className="mt-4 text-gold-400 text-sm font-mono tracking-widest">{step.duration}</div></div><div className={`col-span-12 md:col-span-6 ${i%2===0?'md:pl-20':'md:pr-20 md:text-right'} pl-8 md:pl-20`}><p className="text-lg md:text-xl leading-relaxed text-navy-700/80">{step.description}</p><div className={`mt-6 flex flex-wrap gap-2 ${i%2===0?'':'md:justify-end'}`}>{step.keywords.map(kw=><span key={kw} className="inline-flex items-center gap-2 px-3 py-1.5 border border-navy-700/15 rounded-full text-xs text-navy-700/70"><span className="w-1 h-1 rounded-full bg-gold-400"/>{kw}</span>)}</div></div></div>)}
    </div>
  </div></section>
}
