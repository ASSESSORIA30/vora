import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { HOUSES } from '../data/houses'
import ModelDetail from './ModelDetail'

gsap.registerPlugin(ScrollTrigger)

export default function Models() {
  const sectionRef=useRef(null),headingRef=useRef(null),trackRef=useRef(null),pinContainerRef=useRef(null)
  const [selectedModel,setSelectedModel]=useState(null)

  useEffect(()=>{const ctx=gsap.context(()=>{
    const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})})
    const mm=gsap.matchMedia();mm.add('(min-width: 1024px)',()=>{const track=trackRef.current;const getDistance=()=>track.scrollWidth-window.innerWidth+80;gsap.to(track,{x:()=>-getDistance(),ease:'none',scrollTrigger:{trigger:pinContainerRef.current,pin:true,scrub:1,start:'top top',end:()=>`+=${getDistance()}`,invalidateOnRefresh:true}})})
  },sectionRef);return()=>ctx.revert()},[])

  return <>
    <section id="models" ref={sectionRef} className="relative bg-navy-700 text-cream-200 overflow-hidden">
      <div className="pt-24 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-[1600px] mx-auto"><div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-cream-200/50"><span className="text-gold-300">02</span> / 07 — COLECCIÓN</div></div>
        <div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest">Siete casas.<br/><em className="italic text-gold-300 font-light">Una misma</em> idea.</h2><p className="mt-8 max-w-xl text-cream-200/70 text-lg leading-relaxed">Cada VORA nace ya resuelta: arquitectura, distribución y una selección de acabados pensados para funcionar juntos. Tú eliges el modelo. Nosotros preservamos la coherencia.</p></div>
      </div></div>
      <div ref={pinContainerRef} className="relative"><div className="lg:h-screen overflow-hidden flex items-center"><div ref={trackRef} className="flex flex-col lg:flex-row gap-10 md:gap-12 px-6 md:px-12 lg:pr-32 lg:will-change-transform">
        {HOUSES.map((model)=><ModelCard key={model.id} model={model} onOpen={()=>setSelectedModel(model)}/>) }
        <div className="flex-shrink-0 w-full lg:w-[520px] flex flex-col justify-center gap-6 lg:pl-10 border-t lg:border-t-0 lg:border-l border-cream-200/10 pt-10 lg:pt-0">
          <div className="section-label text-gold-300">READY TO LIVE</div><h3 className="font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">No eliges una obra.<br/><em className="italic text-gold-300 font-light">Eliges tu VORA.</em></h3><p className="text-cream-200/70 leading-relaxed max-w-md">La casa llega con las decisiones difíciles ya tomadas: proporción, distribución, materiales y equipamiento dentro de un sistema claro.</p><button onClick={()=>window.lenis?.scrollTo(document.querySelector('#contact'),{offset:-20,duration:1.6})} className="inline-flex items-center gap-3 text-sm font-medium text-cream-200 link-underline self-start">Hablar con VORA <ArrowUpRight size={14}/></button>
        </div>
      </div></div></div>
      <div className="py-10 md:py-16 px-6 md:px-12 section-label text-cream-200/40 flex justify-between"><span>DESPLÁZATE PARA EXPLORAR</span><span>ABRE CADA MODELO PARA DESCUBRIRLO</span></div>
    </section>
    <ModelDetail model={selectedModel} onClose={()=>setSelectedModel(null)} />
  </>
}

function ModelCard({model,onOpen}){
  const cardRef=useRef(null),imgRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{gsap.fromTo(imgRef.current,{scale:1.12},{scale:1,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:cardRef.current,start:'top 85%'}})},cardRef);return()=>ctx.revert()},[])
  return <article ref={cardRef} data-cursor="view" onClick={onOpen} className="group flex-shrink-0 w-full lg:w-[720px] cursor-view">
    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-navy-500"><div ref={imgRef} className="absolute inset-0 will-change-transform"><img src={model.image} alt={`VORA ${model.name}`} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]" loading="lazy"/></div><div className="absolute inset-0 bg-gradient-to-t from-navy-900/72 via-navy-900/5 to-navy-900/10"/><div className="absolute top-5 left-5 md:top-7 md:left-7 section-label text-cream-200/90">{model.code}</div><div className="absolute top-5 right-5 md:top-7 md:right-7 section-label text-gold-200">{model.tag}</div><div className="absolute bottom-0 left-0 right-0 p-6 md:p-8"><div className="flex items-end justify-between gap-4"><div><div className="section-label text-cream-200/55 mb-2">VORA</div><h3 className="font-display text-6xl md:text-8xl tracking-tightest leading-none">{model.name}</h3></div><span className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-cream-200/25 flex items-center justify-center group-hover:bg-cream-200 group-hover:text-navy-700 transition-all duration-500"><ArrowUpRight size={20} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span></div></div></div>
    <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6"><div className="col-span-12 md:col-span-7"><p className="font-display text-2xl md:text-3xl leading-tight tracking-tighter-2 mb-3">{model.statement}</p><p className="text-sm md:text-base text-cream-200/62 leading-relaxed max-w-lg">{model.description}</p></div><div className="col-span-12 md:col-span-5 md:text-right flex md:block justify-between items-end"><div><div className="section-label text-cream-200/50">{model.size}</div><div className="text-sm text-gold-200 mt-1">{model.bedrooms} hab · {model.bathrooms} baños · {model.floors} planta</div></div><button onClick={(e)=>{e.stopPropagation();onOpen()}} className="mt-3 text-xs uppercase tracking-[.16em] text-cream-200/55 link-underline">Descubrir modelo</button></div></div>
  </article>
}
