import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { HOUSES } from '../data/houses'

gsap.registerPlugin(ScrollTrigger)

export default function Models() {
  const sectionRef=useRef(null),headingRef=useRef(null),trackRef=useRef(null),pinContainerRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{
    const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})})
    const mm=gsap.matchMedia();mm.add('(min-width: 1024px)',()=>{const track=trackRef.current;const getDistance=()=>track.scrollWidth-window.innerWidth+80;gsap.to(track,{x:()=>-getDistance(),ease:'none',scrollTrigger:{trigger:pinContainerRef.current,pin:true,scrub:1,start:'top top',end:()=>`+=${getDistance()}`,invalidateOnRefresh:true}})})
  },sectionRef);return()=>ctx.revert()},[])
  return <section id="models" ref={sectionRef} className="relative bg-navy-700 text-cream-200 overflow-hidden">
    <div className="pt-24 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-[1600px] mx-auto"><div className="grid grid-cols-12 gap-4 md:gap-8">
      <div className="col-span-12 md:col-span-4"><div className="section-label text-cream-200/50"><span className="text-gold-300">02</span> / 07 — COLECCIÓN</div></div>
      <div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest">Siete modelos.<br/><em className="italic text-gold-300 font-light">Todo</em> resuelto.</h2><p className="mt-8 max-w-lg text-cream-200/70 text-lg leading-relaxed">No diseñamos desde cero. Cada VORA nace de una distribución previamente optimizada y una selección de acabados coherente. Menos decisiones. Más certeza.</p></div>
    </div></div>
    <div ref={pinContainerRef} className="relative"><div className="lg:h-screen overflow-hidden flex items-center"><div ref={trackRef} className="flex flex-col lg:flex-row gap-6 md:gap-10 px-6 md:px-12 lg:pr-32 lg:will-change-transform">
      {HOUSES.map((model,i)=><ModelCard key={model.id} model={model} index={i}/>)}
      <div className="flex-shrink-0 w-full lg:w-[480px] flex flex-col justify-center gap-6 lg:pl-8 border-t lg:border-t-0 lg:border-l border-cream-200/10 pt-10 lg:pt-0">
        <div className="section-label text-gold-300">READY TO LIVE</div><h3 className="font-display text-4xl md:text-5xl tracking-tightest leading-[0.95]">Elige la casa.<br/><em className="italic text-gold-300 font-light">Nosotros hacemos el resto.</em></h3><p className="text-cream-200/70 leading-relaxed">La distribución no se reinventa en cada proyecto. Adaptamos técnicamente el modelo a la parcela y te acompañamos hasta la entrega final.</p><button onClick={()=>window.lenis?.scrollTo(document.querySelector('#contact'),{offset:-20,duration:1.6})} className="inline-flex items-center gap-3 text-sm font-medium text-cream-200 link-underline self-start">Quiero una VORA <ArrowUpRight size={14}/></button>
      </div>
    </div></div></div>
    <div className="py-10 md:py-16 px-6 md:px-12 section-label text-cream-200/40 flex justify-between"><span>DESPLÁZATE PARA EXPLORAR</span><span>07 MODELOS</span></div>
  </section>
}

function ModelCard({model}){
  const cardRef=useRef(null),imgRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{gsap.fromTo(imgRef.current,{scale:1.16},{scale:1,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:cardRef.current,start:'top 85%'}})},cardRef);return()=>ctx.revert()},[])
  return <article ref={cardRef} data-cursor="view" className="group flex-shrink-0 w-full lg:w-[560px] cursor-view">
    <div className="relative aspect-[4/5] overflow-hidden bg-navy-500"><div ref={imgRef} className="absolute inset-0 will-change-transform"><img src={model.image} alt={`VORA ${model.name}`} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" loading="lazy"/></div><div className="absolute inset-0 bg-gradient-to-t from-navy-800/70 via-transparent to-transparent"/><div className="absolute top-5 left-5 section-label text-cream-200/90">{model.code}</div><div className="absolute top-5 right-5 section-label text-gold-200">{model.tag}</div><div className="absolute bottom-0 left-0 right-0 p-6 md:p-8"><div className="flex items-end justify-between gap-4"><div><div className="section-label text-cream-200/55 mb-2">VORA</div><h3 className="font-display text-5xl md:text-6xl tracking-tightest leading-none">{model.name}</h3></div><ArrowUpRight size={28} className="text-gold-200 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"/></div></div></div>
    <div className="mt-6 flex justify-between gap-6"><p className="text-sm md:text-base text-cream-200/75 leading-relaxed max-w-sm">{model.description}</p><div className="text-right flex-shrink-0 space-y-1"><div className="section-label text-cream-200/50">{model.size}</div><div className="text-sm text-gold-200">{model.bedrooms} hab · {model.bathrooms} baños</div><div className="text-xs text-cream-200/45">Solicitar precio</div></div></div>
  </article>
}
