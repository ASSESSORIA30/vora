import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { HOUSES } from '../data/houses'
import useMediaQuery from '../hooks/useMediaQuery'
import { navigateToJourneySection } from '../lib/configuration'
import { analyticsFunnelKey, track, trackOnce } from '../lib/analytics'

gsap.registerPlugin(ScrollTrigger)

export default function Models(){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef=useRef(null),headingRef=useRef(null),trackRef=useRef(null),pinRef=useRef(null)

  useEffect(()=>{
    const splitCleanup=[]
    const ctx=gsap.context(()=>{
      if(reducedMotion)return
      const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'})
      splitCleanup.push(()=>split.revert())
      gsap.set(split.words,{yPercent:110})
      ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.25,ease:'expo.out',stagger:.035})})
      const mm=gsap.matchMedia()
      mm.add('(min-width:1024px)',()=>{
        const getDistance=()=>Math.max(0,trackRef.current.scrollWidth-window.innerWidth+80)
        gsap.to(trackRef.current,{x:()=>-getDistance(),ease:'none',scrollTrigger:{trigger:pinRef.current,pin:true,scrub:1,start:'top top',end:()=>`+=${getDistance()}`,invalidateOnRefresh:true}})
      })
    },sectionRef)
    return()=>{ctx.revert();splitCleanup.forEach(cleanup=>cleanup())}
  },[reducedMotion])

  const configure=(event,model)=>{
    event.preventDefault()
    trackOnce(analyticsFunnelKey('configurator-start','model-collection',model.id),'configurator_start',{source:'model-collection',model:model.id,placement:'collection'})
    navigateToJourneySection({target:'configurator',model:model.name,source:'model-collection',reducedMotion})
  }
  const continueJourney=(event,target)=>{
    event.preventDefault()
    if(target==='contact')track('contact_cta_click',{cta:'collection_help',source:'model-collection',placement:'collection',has_configuration:false})
    navigateToJourneySection({target,source:'model-collection',reducedMotion})
  }

  return <section id="models" ref={sectionRef} className="relative bg-navy-700 text-cream-200 overflow-hidden">
    <div className="pt-24 md:pt-40 pb-12 md:pb-24 px-6 md:px-12 max-w-[1600px] mx-auto"><div className="grid grid-cols-12 gap-4 md:gap-8"><div className="col-span-12 md:col-span-4"><div className="section-label text-cream-200/50"><span className="text-gold-300">02</span> / 07 — COLECCIÓN</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[.95] tracking-tightest">Siete casas.<br/><em className="italic text-gold-300 font-light">Una misma</em> idea.</h2><p className="mt-7 max-w-xl text-cream-200/70 text-base md:text-lg leading-relaxed">Compara de un vistazo capacidad y carácter. Puedes abrir la ficha o empezar a configurar el modelo directamente.</p></div></div></div>
    <div ref={pinRef}><div className="motion-collection lg:h-screen overflow-hidden flex items-center"><div ref={trackRef} className="motion-collection-track flex flex-col lg:flex-row gap-4 md:gap-7 lg:gap-12 px-6 md:px-12 lg:pr-32 lg:will-change-transform">{HOUSES.map(model=><ModelCard key={model.id} model={model} onConfigure={configure}/>)}<div className="flex-shrink-0 w-full lg:w-[520px] flex flex-col justify-center gap-5 lg:pl-10 border-t lg:border-t-0 lg:border-l border-cream-200/10 py-10 lg:py-0"><div className="section-label text-gold-300">SIGUIENTE PASO</div><h3 className="font-display text-4xl md:text-6xl tracking-tightest leading-[.95]">¿Ya tienes<br/><em className="italic text-gold-300 font-light">un modelo?</em></h3><div className="flex flex-wrap gap-4"><a href="/?source=model-collection#configurator" onClick={(event)=>continueJourney(event,'configurator')} className="min-h-12 inline-flex items-center gap-3 text-sm font-medium link-underline">Configurar <ArrowUpRight size={14}/></a><a href="/?source=model-collection#contact" onClick={(event)=>continueJourney(event,'contact')} className="min-h-12 inline-flex items-center gap-3 text-sm font-medium link-underline">Hablar del proyecto <ArrowUpRight size={14}/></a></div></div></div></div></div>
    <div className="hidden lg:block max-w-[1600px] mx-auto px-6 md:px-12 pb-12"><div className="flex gap-3 overflow-x-auto no-scrollbar">{HOUSES.map(h=><a key={h.id} href={`/modelos/${h.id}`} onClick={()=>track('select_model',{model:h.id,source:'model-collection',placement:'collection_nav'})} className="flex-shrink-0 min-h-11 px-4 py-2 rounded-full border border-cream-200/15 text-xs uppercase tracking-[.14em] hover:bg-cream-200 hover:text-navy-700 transition-colors">{h.name==='Signature'?'Signature':h.name}</a>)}</div></div>
  </section>
}

function ModelCard({model,onConfigure}){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const cardRef=useRef(null),imgRef=useRef(null)
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      if(reducedMotion)return
      gsap.fromTo(imgRef.current,{scale:1.06},{scale:1,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:cardRef.current,start:'top 90%'}})
    },cardRef)
    return()=>ctx.revert()
  },[reducedMotion])

  return <article ref={cardRef} className="motion-collection-card group flex-shrink-0 w-full lg:w-[720px] border-t border-cream-200/12 pt-4 lg:border-0 lg:pt-0">
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 lg:block">
      <a href={`/modelos/${model.id}`} onClick={()=>track('select_model',{model:model.id,source:'model-collection',placement:'collection_card'})} aria-label={`Ver ficha de VORA ${model.name}`} className="block">
        <div className="relative h-full min-h-[170px] lg:min-h-0 lg:aspect-[16/10] overflow-hidden bg-navy-500"><div ref={imgRef} className="absolute inset-0"><img src={model.image} alt={`VORA ${model.name}, casa industrializada de hormigón`} className="w-full h-full object-cover transition-transform duration-[1400ms] motion-reduce:transition-none group-hover:scale-[1.035]" loading="lazy" decoding="async"/></div><div className="absolute inset-0 bg-gradient-to-t from-navy-900/78 via-transparent to-navy-900/10"/><div className="absolute top-3 left-3 section-label text-cream-200/80 lg:top-5 lg:left-5">{model.code}</div><div className="absolute bottom-3 inset-x-3 lg:bottom-0 lg:inset-x-0 lg:p-8"><div className="section-label text-cream-200/55 mb-1">VORA</div><h3 className="font-display text-4xl lg:text-8xl tracking-tightest leading-none break-words">{model.name}</h3></div></div>
      </a>
      <div className="min-w-0 flex flex-col lg:mt-6 lg:grid lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-7"><div className="section-label text-gold-200 mb-2 lg:hidden">{model.tag}</div><p className="font-display text-xl md:text-2xl lg:text-3xl leading-tight">{model.statement}</p><p className="hidden md:block mt-3 text-sm md:text-base text-cream-200/62 leading-relaxed max-w-lg">{model.description}</p></div>
        <div className="mt-3 lg:mt-0 lg:col-span-5 lg:text-right"><div className="text-sm text-gold-200">{model.bedrooms} hab · {model.bathrooms} baños · {model.floors} planta</div></div>
        <div className="mt-auto pt-4 lg:col-span-12 lg:flex lg:justify-end lg:gap-3"><div className="grid grid-cols-2 gap-2 lg:flex"><a href={`/modelos/${model.id}`} onClick={()=>track('select_model',{model:model.id,source:'model-collection',placement:'collection_action'})} className="min-h-11 rounded-full border border-cream-200/20 px-3 inline-flex items-center justify-center text-xs font-medium">Ver modelo</a><a href={`/?model=${encodeURIComponent(model.name)}&source=model-collection#configurator`} onClick={(event)=>onConfigure(event,model)} className="min-h-11 rounded-full bg-cream-200 text-navy-700 px-3 inline-flex items-center justify-center text-xs font-medium">Configurar</a></div></div>
      </div>
    </div>
  </article>
}
