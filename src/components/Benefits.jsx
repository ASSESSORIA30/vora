import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Armchair, Layers3, ListChecks, PackageCheck, Route, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const BENEFITS = [
  { icon:PackageCheck, metric:'100%', title:'Lista para vivir', description:'Cocina, electrodomésticos, mobiliario, iluminación, baños, climatización y acabados integrados en la propuesta.', large:true },
  { icon:Layers3, metric:'07', title:'Modelos resueltos', description:'Una colección cerrada de viviendas previamente optimizadas. El cliente elige, no empieza de cero.' },
  { icon:ListChecks, metric:'—', title:'Menos decisiones', description:'Reducimos cientos de elecciones a un sistema claro de modelos y acabados curados por la marca.' },
  { icon:Route, metric:'01', title:'Un único recorrido', description:'Parcela, adaptación, fabricación, montaje, equipamiento y entrega dentro de un proceso coordinado.' },
  { icon:Armchair, metric:'IN', title:'Mobiliario incluido', description:'La casa se concibe como producto terminado: no termina cuando acaba la obra, sino cuando puedes vivir en ella.', large:true },
  { icon:Sparkles, metric:'03', title:'Atmósferas seleccionadas', description:'Acabados coherentes y previamente combinados para mantener el lenguaje de VORA sin convertir cada proyecto en un catálogo infinito.' },
]

export default function Benefits(){
  const sectionRef=useRef(null),headingRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})});const cards=sectionRef.current.querySelectorAll('[data-benefit]');gsap.from(cards,{opacity:0,y:50,duration:1,stagger:{amount:.5,from:'start',grid:'auto'},ease:'expo.out',scrollTrigger:{trigger:cards[0],start:'top 80%'}})},sectionRef);return()=>ctx.revert()},[])
  return <section ref={sectionRef} className="relative py-24 md:py-40 bg-navy-700 text-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12">
    <div className="grid grid-cols-12 gap-4 md:gap-8 mb-16 md:mb-24"><div className="col-span-12 md:col-span-4"><div className="section-label text-cream-200/50"><span className="text-gold-300">04</span> / 07 — TODO INCLUIDO</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest">Más que<br/><em className="italic text-gold-300 font-light">llave en mano.</em></h2><p className="mt-8 max-w-lg text-cream-200/70 text-lg leading-relaxed">VORA no entrega una casa vacía. Entrega una vivienda pensada como un producto completo.</p></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-cream-200/10">{BENEFITS.map((b,i)=>{const Icon=b.icon;return <article key={i} data-benefit className={`${b.large?'lg:col-span-2':''} min-h-[300px] md:min-h-[340px] border-r border-b border-cream-200/10 p-7 md:p-10 flex flex-col justify-between group hover:bg-cream-200/[.035] transition-colors`}><div className="flex justify-between items-start"><Icon size={22} className="text-gold-300"/><span className="font-display text-5xl md:text-6xl tracking-tightest text-cream-200/22 group-hover:text-gold-300/60 transition-colors">{b.metric}</span></div><div><h3 className="font-display text-3xl md:text-4xl tracking-tighter-2 mb-4">{b.title}</h3><p className="text-cream-200/65 leading-relaxed max-w-md">{b.description}</p></div></article>})}</div>
  </div></section>
}
