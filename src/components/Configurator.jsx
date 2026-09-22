import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Copy, Pencil } from 'lucide-react'
import { HOUSES } from '../data/houses'
import useMediaQuery from '../hooks/useMediaQuery'
import { CONFIGURATION_EVENT, EXTERIORS, INTERIORS, configurationUrl, navigateToJourneySection, normalizeLeadSource, readConfiguration, replaceConfigurationInUrl } from '../lib/configuration'
import { analyticsFunnelKey, track, trackOnce } from '../lib/analytics'

export default function Configurator({initialModelId='vora-130',initialSource='configurator'}){
  const sectionRef=useRef(null)
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const initialConfiguration=useMemo(()=>readConfiguration(),[])
  const queryModel=HOUSES.find(({name})=>name===initialConfiguration.model)
  const [modelId,setModelId]=useState(queryModel?.id||initialModelId)
  const [interior,setInterior]=useState(initialConfiguration.interior||'EARTH')
  const [exterior,setExterior]=useState(initialConfiguration.exterior||'Terrace')
  const [journeySource,setJourneySource]=useState(initialConfiguration.source||initialSource)
  const [shareStatus,setShareStatus]=useState('')
  const model=useMemo(()=>HOUSES.find(h=>h.id===modelId)||HOUSES[2],[modelId])
  const poolEligible=model.name==='Signature'||Number(model.name)>=130
  const source=normalizeLeadSource(journeySource||initialSource)

  const selection=(overrides={})=>({model:model.name,interior,exterior,source,...overrides})
  const updateUrl=(overrides={})=>replaceConfigurationInUrl(selection(overrides))

  useEffect(()=>{
    if(!poolEligible&&exterior==='Pool'){
      setExterior('Terrace')
      replaceConfigurationInUrl({model:model.name,interior,exterior:'Terrace',source})
    }
  },[poolEligible,exterior,interior,model.name,source])

  useEffect(()=>{
    const applyJourney=(event)=>{
      const next=event.detail||{}
      if(next.target!=='configurator')return
      const selected=HOUSES.find(({name,id})=>name===next.model||id===next.model)
      if(selected)setModelId(selected.id)
      if(next.interior&&INTERIORS.some(({id})=>id===next.interior))setInterior(next.interior)
      if(next.exterior&&EXTERIORS.some(({id})=>id===next.exterior))setExterior(next.exterior)
      setJourneySource(normalizeLeadSource(next.source))
      setShareStatus('')
    }
    window.addEventListener(CONFIGURATION_EVENT,applyJourney)
    return()=>window.removeEventListener(CONFIGURATION_EVENT,applyJourney)
  },[])

  useEffect(()=>{
    if(!sectionRef.current)return
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting)trackOnce(analyticsFunnelKey('configurator-start',source,model.id),'configurator_start',{source,model:model.id,placement:'configurator'})
    },{threshold:.2})
    observer.observe(sectionRef.current)
    return()=>observer.disconnect()
  },[source,model.id])

  const changeModel=(next)=>{
    const nextExterior=next.name!=='Signature'&&Number(next.name)<130&&exterior==='Pool'?'Terrace':exterior
    setModelId(next.id)
    setExterior(nextExterior)
    setShareStatus('')
    updateUrl({model:next.name,exterior:nextExterior})
    track('configurator_change',{field:'model',value:next.id,model:next.id})
  }
  const changeInterior=(next)=>{
    setInterior(next)
    setShareStatus('')
    updateUrl({interior:next})
    track('configurator_change',{field:'interior',value:next,model:model.id})
  }
  const changeExterior=(next)=>{
    setExterior(next)
    setShareStatus('')
    updateUrl({exterior:next})
    track('configurator_change',{field:'exterior',value:next,model:model.id})
  }
  const share=async()=>{
    const url=configurationUrl(selection()).toString()
    try{
      await navigator.clipboard.writeText(url)
      setShareStatus('Enlace copiado')
      track('configurator_share',{model:model.id,source,method:'clipboard'})
    }catch{
      setShareStatus('No se ha podido copiar. Conserva la URL del navegador.')
    }
  }
  const goToContact=()=>{
    navigateToJourneySection({target:'contact',model:model.name,interior,exterior,source,reducedMotion})
    track('configurator_complete',{model:model.id,interior,exterior,source,has_configuration:true})
    track('contact_cta_click',{cta:'configurator_proposal',model:model.id,source,placement:'configurator',has_configuration:true})
    trackOnce(analyticsFunnelKey('contact-start',source,model.id),'contact_start',{source,model:model.id,placement:'configurator',has_configuration:true})
  }

  return <section ref={sectionRef} id="configurator" className="py-24 md:py-40 bg-cream-200"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-5 md:gap-8 mb-14 md:mb-20"><div className="col-span-12 md:col-span-4 section-label text-navy-700/50"><span className="text-gold-400">04</span> / 07 — CONFIGURA</div><div className="col-span-12 md:col-span-8"><h2 className="font-display text-display leading-[.95] tracking-tightest">Tres decisiones.<br/><em className="italic text-gold-400 font-light">Sin diseñar desde cero.</em></h2><p className="mt-8 max-w-xl text-lg text-navy-700/68">Elige el modelo, el ambiente interior y el paquete exterior. El resto mantiene el lenguaje VORA.</p></div></div>
    <div className="mb-5 flex items-center gap-4" aria-label="Progreso: tres de tres decisiones definidas"><div className="grid flex-1 grid-cols-3 gap-1" aria-hidden="true"><span className="h-1 bg-gold-400"/><span className="h-1 bg-gold-400"/><span className="h-1 bg-gold-400"/></div><span className="section-label whitespace-nowrap text-navy-700/55">3 / 3 DEFINIDAS</span></div>
    <div className="grid items-start border border-navy-700/10 lg:grid-cols-12"><div className="space-y-10 p-6 md:p-10 lg:col-span-7"><Choice id="configurator-model" title="01 · MODELO">{HOUSES.map(h=><button type="button" aria-pressed={modelId===h.id} key={h.id} onClick={()=>changeModel(h)} className={`min-h-11 px-4 py-2 rounded-full border text-sm ${modelId===h.id?'bg-navy-700 text-cream-200 border-navy-700':'border-navy-700/20 hover:border-gold-400'}`}>{h.name==='Signature'?'Signature':h.name}</button>)}</Choice><Choice id="configurator-interior" title="02 · INTERIOR">{INTERIORS.map(x=><button type="button" aria-pressed={interior===x.id} key={x.id} onClick={()=>changeInterior(x.id)} className={`min-h-20 text-left p-4 border ${interior===x.id?'border-gold-400 bg-gold-50':'border-navy-700/10'}`}><strong className="block section-label mb-2">{x.id}</strong><span className="text-sm text-navy-700/60">{x.desc}</span></button>)}</Choice><Choice id="configurator-exterior" title="03 · EXTERIOR">{EXTERIORS.filter(x=>x.id!=='Pool'||poolEligible).map(x=><button type="button" aria-pressed={exterior===x.id} key={x.id} onClick={()=>changeExterior(x.id)} className={`min-h-20 text-left p-4 border ${exterior===x.id?'border-gold-400 bg-gold-50':'border-navy-700/10'}`}><strong className="block section-label mb-2">{x.id}</strong><span className="text-sm text-navy-700/60">{x.desc}</span></button>)}</Choice></div>
      <aside aria-labelledby="configuration-result-title" aria-live="polite" className="bg-navy-800 text-cream-200 lg:col-span-5 lg:sticky lg:top-24 lg:self-start"><div className="aspect-[16/8] overflow-hidden"><img src={model.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover"/></div><div className="flex min-h-0 flex-col justify-between gap-8 p-6 md:p-10 lg:min-h-[460px]"><div><div className="section-label text-gold-300 mb-5">TU VORA</div><h3 id="configuration-result-title" className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tightest break-words">VORA {model.name}</h3><p className="mt-4 text-cream-200/60">{model.bedrooms} dormitorios · {model.bathrooms} baños</p></div><div className="space-y-5"><dl className="grid grid-cols-2 gap-3 border-t border-cream-200/10 pt-5"><SummaryChoice label="INTERIOR" value={interior} href="#configurator-interior"/><SummaryChoice label="EXTERIOR" value={exterior} href="#configurator-exterior"/></dl><div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={share} className="min-h-11 rounded-full border border-cream-200/20 px-4 inline-flex items-center justify-center gap-2 text-sm hover:border-gold-300"><Copy size={15}/>Copiar configuración</button><button type="button" onClick={goToContact} className="min-h-11 justify-center btn-primary !bg-cream-200 !text-navy-700"><span>Hablar de esta VORA</span><ArrowUpRight size={16}/></button></div>{shareStatus&&<p role="status" aria-live="polite" className="text-center text-xs text-cream-200/65">{shareStatus}</p>}</div></div></aside>
    </div></div></section>
}

function Choice({id,title,children}){return <div id={id} tabIndex="-1" role="group" aria-label={title} className="scroll-mt-28 outline-none"><div className="section-label text-navy-700/45 mb-4">{title}</div><div className="flex flex-wrap gap-2 md:gap-3">{children}</div></div>}

function SummaryChoice({label,value,href}){return <div><dt className="section-label text-cream-200/40">{label}</dt><dd className="mt-2 flex items-center justify-between gap-2"><span>{value}</span><a href={href} className="inline-flex min-h-11 items-center gap-1 text-xs text-cream-200/65 hover:text-cream-200"><Pencil size={12}/>Modificar</a></dd></div>}
