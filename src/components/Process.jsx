import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SIMPLE=[
  ['01','Escoge tu VORA','Elige uno de los siete modelos. La arquitectura y la distribución ya están resueltas.'],
  ['02','Validamos tu parcela','Comprobamos encaje, accesos, orientación y condicionantes urbanísticos básicos.'],
  ['03','La construimos y equipamos','Adaptación técnica, cimentación, fabricación industrializada, montaje, acabados y equipamiento.'],
  ['04','Entras a vivir','Te entregamos una casa terminada, equipada y amueblada según la especificación elegida.'],
]
const DETAIL=['Estudio de parcela','Adaptación técnica y proyecto','Licencias','Cimentación y acometidas','Fabricación industrializada','Montaje y finalización','Entrega ready to live']

export default function Process(){
  const sectionRef=useRef(null),headingRef=useRef(null);const [open,setOpen]=useState(false)
  useEffect(()=>{const ctx=gsap.context(()=>{const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.2,ease:'expo.out',stagger:.035})});gsap.from(sectionRef.current.querySelectorAll('[data-step]'),{opacity:0,y:40,duration:1,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:sectionRef.current.querySelector('[data-steps]'),start:'top 80%'}})},sectionRef);return()=>ctx.revert()},[])
  return <section id="process" ref={sectionRef} className="relative py-24 md:py-40 bg-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-4 md:gap-8 mb-16 md:mb-24"><div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">05</span> / 07 — PROCESO</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[.95] tracking-tightest">Cuatro decisiones.<br/><em className="italic text-gold-400 font-light">Una casa completa.</em></h2><p className="mt-8 max-w-xl text-navy-700/70 text-lg">Hemos simplificado el proceso para que construir no se convierta en gestionar una obra.</p></div></div>
    <div data-steps className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-l border-navy-700/10">{SIMPLE.map(([n,t,d])=><article key={n} data-step className="min-h-[310px] p-7 md:p-9 border-r border-b border-navy-700/10 flex flex-col justify-between"><div className="section-label text-gold-400">{n}</div><div><h3 className="font-display text-3xl md:text-4xl tracking-tighter-2 mb-4">{t}</h3><p className="text-navy-700/65 leading-relaxed">{d}</p></div></article>)}</div>
    <div className="mt-10"><button onClick={()=>setOpen(!open)} className="inline-flex items-center gap-3 text-sm font-medium"><span>{open?'Ocultar proceso técnico':'Ver proceso completo'}</span><ChevronDown size={16} className={`transition-transform ${open?'rotate-180':''}`}/></button>{open&&<div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 border-t border-navy-700/10">{DETAIL.map((item,i)=><div key={item} className="py-5 border-b border-navy-700/10 flex gap-4"><span className="section-label text-gold-400">{String(i+1).padStart(2,'0')}</span><span>{item}</span></div>)}</div>}</div>
  </div></section>
}
