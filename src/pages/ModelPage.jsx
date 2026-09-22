import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Check, House, Ruler } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlanTabs from '../components/PlanTabs'
import Configurator from '../components/Configurator'
import Contact from '../components/Contact'
import useMediaQuery from '../hooks/useMediaQuery'
import { HOUSES, getListedRooms } from '../data/houses'
import { CONFIRMED_SCOPE_ITEMS } from '../data/businessContent'
import { navigateToJourneySection } from '../lib/configuration'
import { analyticsFunnelKey, track, trackOnce } from '../lib/analytics'

function relatedModels(model){
  const index=HOUSES.findIndex(({id})=>id===model.id)
  const selected=[]
  const add=(house,relation)=>{if(house&&!selected.some(({model:entry})=>entry.id===house.id))selected.push({model:house,relation})}
  add(HOUSES[index-1],'Modelo anterior')
  add(HOUSES[index+1],'Modelo siguiente')
  add(HOUSES.find((house)=>house.id!==model.id&&house.bedrooms!==model.bedrooms), 'Diferente capacidad')
  HOUSES.forEach((house)=>add(house,`${house.bedrooms} dormitorios`))
  return selected.slice(0,3)
}

export default function ModelPage({model}){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const related=relatedModels(model)
  const listedRooms=getListedRooms(model)
  const measurementsVerified=model.validationStatus==='verified'
  const [stickyVisible,setStickyVisible]=useState(true)

  useEffect(()=>{
    trackOnce(`model-view:${model.id}`,'model_view',{model:model.id})
    window.scrollTo(0,0)
  },[model.id])

  useEffect(()=>{
    const targets=['plan','configurator','contact'].map(id=>document.getElementById(id)).filter(Boolean)
    const features=document.querySelector('section[aria-labelledby="features-title"]')
    if(features)targets.push(features)
    const footer=document.querySelector('footer')
    if(footer)targets.push(footer)
    const visible=new Set()
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target):visible.delete(entry.target))
      setStickyVisible(visible.size===0)
    },{threshold:.08})
    targets.forEach(target=>observer.observe(target))
    return()=>observer.disconnect()
  },[model.id])

  const contact=(event,placement)=>{
    event.preventDefault()
    navigateToJourneySection({target:'contact',model:model.name,source:'model_page',reducedMotion})
    track('contact_cta_click',{cta:'model_contact',source:'model_page',model:model.id,placement,has_configuration:false})
    trackOnce(analyticsFunnelKey('contact-start','model_page',model.id),'contact_start',{source:'model_page',model:model.id,placement,has_configuration:false})
  }

  const configure=()=>trackOnce(analyticsFunnelKey('configurator-start','model_page',model.id),'configurator_start',{source:'model_page',model:model.id,placement:'model_detail'})

  return <><Navbar forceLight/><main className="bg-cream-200 text-navy-700">
    <section className="relative min-h-[92svh] bg-navy-800 text-cream-200 overflow-hidden">
      <img src={model.image} alt={`Exterior VORA ${model.name}`} decoding="async" fetchpriority="high" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-navy-900/20"/>
      <div className="relative z-10 min-h-[92svh] max-w-[1600px] mx-auto px-6 md:px-12 pt-28 pb-10 flex flex-col justify-between">
        <nav aria-label="Migas de pan" className="text-sm text-cream-200/75"><ol className="flex flex-wrap items-center gap-2"><li><a href="/" className="hover:text-cream-200">Inicio</a></li><li aria-hidden="true">/</li><li><a href="/#models" className="inline-flex items-center gap-2 hover:text-cream-200"><ArrowLeft size={15}/> Modelos</a></li><li aria-hidden="true">/</li><li aria-current="page">VORA {model.name}</li></ol></nav>
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8"><div className="section-label text-gold-200 mb-5">{model.code} · {model.tag}</div><h1 className="font-display text-[clamp(5.5rem,14vw,14rem)] leading-[.72] tracking-[-.07em]">{model.name}</h1><p className="mt-7 font-display text-2xl md:text-4xl max-w-3xl leading-tight">{model.statement}</p></div>
          <div className="col-span-12 lg:col-span-4 lg:text-right"><p className="section-label text-cream-200/65">{model.bedrooms} dormitorios · {model.bathrooms} baños · {model.floors} planta</p><div className="mt-6 flex flex-wrap gap-4 lg:justify-end"><a href="#plan" className="inline-flex items-center gap-2 text-sm link-underline">Ver distribución <ArrowUpRight size={14}/></a><a href="#configurator" onClick={configure} className="inline-flex items-center gap-2 text-sm link-underline">Configurar <ArrowUpRight size={14}/></a></div></div>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-6 md:gap-10"><div className="col-span-12 md:col-span-4 section-label text-navy-700/45">ARQUITECTURA / {model.code}</div><div className="col-span-12 md:col-span-8"><h2 className="font-display text-display leading-[.95] tracking-tightest">{model.description}</h2><p className="mt-8 md:mt-12 text-lg md:text-2xl leading-relaxed text-navy-700/72 max-w-3xl">{model.narrative}</p></div></div>
    </section>

    <section aria-label={`Datos principales de VORA ${model.name}`} className="py-16 md:py-24 bg-navy-800 text-cream-200"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-cream-200/12"><Spec icon={House} label="Modelo" value={`VORA ${model.name}`}/><Spec icon={BedDouble} label="Dormitorios" value={String(model.bedrooms).padStart(2,'0')}/><Spec icon={Bath} label="Baños" value={String(model.bathrooms).padStart(2,'0')}/><Spec icon={Ruler} label="Porche" value={model.surfaces.porch===null?'—':measurementsVerified?`${model.surfaces.porch} m²`:'Incluido'}/></div></div></section>

    <section id="plan" className="py-20 md:py-36 bg-cream-100"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-8"><div className="col-span-12 md:col-span-4"><div className="section-label text-gold-400 mb-5">PLANO CONCEPTUAL</div><h2 className="font-display text-4xl md:text-6xl tracking-tightest leading-[.95]">{measurementsVerified?<>{model.surfaces.useful} m² útiles.<br/><em className="italic text-gold-400 font-light">Sin metros perdidos.</em></>:<>Una distribución<br/><em className="italic text-gold-400 font-light">ya resuelta.</em></>}</h2>{measurementsVerified&&<p className="mt-6 text-navy-700/65">Dimensiones exteriores: {model.dimensions}</p>}</div><div className="col-span-12 md:col-span-8"><PlanTabs model={model} showMeasurements={measurementsVerified}/><p className="mt-4 text-xs text-navy-700/45">Distribución orientativa sujeta a adaptación técnica, urbanística y estructural.</p></div></div><div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-navy-700/10">{listedRooms.map(room=><div key={room.id} className="min-h-14 p-4 md:p-5 border-r border-b border-navy-700/10 flex items-center justify-between gap-4"><span>{room.name}</span>{measurementsVerified&&<span className="font-mono text-sm text-navy-700/55">{room.area.toFixed(1).replace('.',',')} m²</span>}</div>)}</div></div></section>

    <section className="px-3 md:px-6 py-3 md:py-6"><div className="grid grid-cols-12 gap-3 md:gap-6 max-w-[1800px] mx-auto"><figure className="col-span-12 lg:col-span-7 aspect-[16/11] overflow-hidden"><img src={model.image} alt={`Fachada y jardín VORA ${model.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover"/></figure><figure className="col-span-12 lg:col-span-5 aspect-[4/5] overflow-hidden"><img src={model.interior} alt={`Interior VORA ${model.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover"/></figure></div></section>

    <section aria-labelledby="features-title" className="py-20 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-8 md:gap-12"><div className="col-span-12 md:col-span-4"><div className="section-label text-gold-400 mb-5">CARACTERÍSTICAS</div><h2 id="features-title" className="font-display text-4xl md:text-6xl tracking-tightest leading-[.95]">Lo que define<br/>VORA {model.name}.</h2></div><div className="col-span-12 md:col-span-8"><ul className="grid sm:grid-cols-2 border-t border-l border-navy-700/10">{model.features.map((feature)=><li key={feature} className="min-h-20 border-r border-b border-navy-700/10 p-5 flex items-center gap-3"><Check size={17} className="text-gold-500" aria-hidden="true"/><span>{feature}</span></li>)}</ul><div className="mt-8 grid grid-cols-2 gap-3 md:flex md:flex-wrap"><a href="#configurator" onClick={configure} className="btn-primary col-span-2 justify-center md:justify-start"><span>Configurar VORA {model.name}</span><ArrowUpRight size={16}/></a><a href="#contact" onClick={(event)=>contact(event,'features')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-navy-700/20 px-4 md:px-6 text-sm font-medium hover:border-gold-400">Contactar <ArrowUpRight size={15}/></a><a href="/#compare" aria-label="Comparar modelos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-navy-700/20 px-4 md:px-6 text-sm font-medium hover:border-gold-400">Comparar <ArrowUpRight size={15}/></a></div></div></div>
    </section>

    <section className="py-20 md:py-32 bg-navy-700 text-cream-200"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-8"><div className="col-span-12 md:col-span-4"><div className="section-label text-gold-300 mb-5">PENSADA PARA</div><h2 className="font-display text-4xl md:text-6xl leading-[.95] tracking-tightest">{model.idealFor}</h2></div><div className="col-span-12 md:col-span-8"><div className="section-label text-gold-300 mb-5">READY TO LIVE</div><div className="grid grid-cols-2 md:grid-cols-3 gap-x-7">{CONFIRMED_SCOPE_ITEMS.map((item,i)=><div key={item.id} className="py-5 border-t border-cream-200/12"><div className="section-label text-gold-300 mb-2">{String(i+1).padStart(2,'0')}</div><div>{item.name}</div><div className="mt-1 text-sm text-cream-200/55">{item.detail}</div></div>)}</div></div></div></div></section>

    <Configurator initialModelId={model.id} initialSource="model_page"/>
    <Contact initialConfiguration={{model:model.name,source:'model_page'}}/>

    <section aria-labelledby="related-models-title" className="py-20 md:py-28 max-w-[1600px] mx-auto px-6 md:px-12"><div className="section-label text-navy-700/45 mb-4">SIGUE EXPLORANDO</div><h2 id="related-models-title" className="font-display text-4xl md:text-6xl tracking-tightest">Explora otros modelos.</h2><div className="mt-8 grid md:grid-cols-3 gap-6">{related.map(({model:house,relation})=><a key={house.id} href={`/modelos/${house.id}`} onClick={()=>track('select_model',{model:house.id,source:'model_page',placement:'related_models'})} className="group"><div className="aspect-[4/3] overflow-hidden"><img src={house.image} alt={`VORA ${house.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.03]"/></div><div className="mt-4 flex justify-between gap-4"><div><span className="section-label text-gold-500">{relation}</span><div className="font-display text-3xl mt-1">VORA {house.name}</div></div><span className="section-label text-navy-700/45">{house.bedrooms} hab · {house.bathrooms} baños</span></div></a>)}</div></section>
  </main><Footer/>{stickyVisible&&<a href="#configurator" onClick={configure} data-mobile-model-cta className="fixed md:hidden bottom-3 right-3 z-50 min-h-12 rounded-full bg-navy-800 text-cream-200 px-5 flex items-center gap-3 shadow-2xl"><strong className="text-xs uppercase tracking-[.12em]">Configurar VORA {model.name}</strong><span aria-hidden="true">→</span></a>}</>
}

function Spec({icon:Icon,label,value}){return <div className="min-h-[150px] md:min-h-[190px] border-r border-b border-cream-200/12 p-5 md:p-8 flex flex-col justify-between"><div className="flex justify-between"><div className="section-label text-cream-200/45">{label}</div><Icon size={18} className="text-gold-300"/></div><div className="font-display text-3xl md:text-5xl tracking-tightest break-words">{value}</div></div>}
