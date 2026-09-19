import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { HOUSES } from '../data/houses'
import { track } from '../lib/analytics'

const INTERIORS=[
  {id:'PURE',desc:'Roble claro · piedra beige · lino'},
  {id:'EARTH',desc:'Nogal · piedra cálida · arena'},
  {id:'GRAPHITE',desc:'Nogal oscuro · gris mineral · negro'},
]
const EXTERIORS=[
  {id:'Essential',desc:'Arquitectura + porche'},
  {id:'Terrace',desc:'Terraza exterior ampliada'},
  {id:'Pool',desc:'Piscina integrada donde el modelo lo permite'},
]
export default function Configurator(){
  const [modelId,setModelId]=useState('vora-130'),[interior,setInterior]=useState('EARTH'),[exterior,setExterior]=useState('Terrace')
  const model=useMemo(()=>HOUSES.find(h=>h.id===modelId)||HOUSES[2],[modelId])
  const poolEligible=model.name==='Signature'||Number(model.name)>=130
  useEffect(()=>{if(!poolEligible&&exterior==='Pool')setExterior('Terrace')},[poolEligible,exterior])
  const contactHref=`/?model=${encodeURIComponent(model.name)}&interior=${interior}&exterior=${exterior}#contact`
  return <section id="configurator" className="py-24 md:py-40 bg-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-5 md:gap-8 mb-14 md:mb-20"><div className="col-span-12 md:col-span-4 section-label text-navy-700/50"><span className="text-gold-400">04</span> / 07 — CONFIGURA</div><div className="col-span-12 md:col-span-8"><h2 className="font-display text-display leading-[.95] tracking-tightest">Tres decisiones.<br/><em className="italic text-gold-400 font-light">Sin diseñar desde cero.</em></h2><p className="mt-8 max-w-xl text-lg text-navy-700/68">Elige el modelo, el ambiente interior y el paquete exterior. El resto mantiene el lenguaje VORA.</p></div></div>
    <div className="grid lg:grid-cols-12 border border-navy-700/10"><div className="lg:col-span-7 p-6 md:p-10 space-y-10"><Choice title="01 · MODELO">{HOUSES.map(h=><button key={h.id} onClick={()=>{setModelId(h.id);track('configurator_change',{field:'model',value:h.id})}} className={`px-4 py-2 rounded-full border text-sm ${modelId===h.id?'bg-navy-700 text-cream-200 border-navy-700':'border-navy-700/20 hover:border-gold-400'}`}>{h.name==='Signature'?'Signature':h.name}</button>)}</Choice><Choice title="02 · INTERIOR">{INTERIORS.map(x=><button key={x.id} onClick={()=>setInterior(x.id)} className={`text-left p-4 border ${interior===x.id?'border-gold-400 bg-gold-50':'border-navy-700/10'}`}><strong className="block section-label mb-2">{x.id}</strong><span className="text-sm text-navy-700/60">{x.desc}</span></button>)}</Choice><Choice title="03 · EXTERIOR">{EXTERIORS.filter(x=>x.id!=='Pool'||poolEligible).map(x=><button key={x.id} onClick={()=>setExterior(x.id)} className={`text-left p-4 border ${exterior===x.id?'border-gold-400 bg-gold-50':'border-navy-700/10'}`}><strong className="block section-label mb-2">{x.id}</strong><span className="text-sm text-navy-700/60">{x.desc}</span></button>)}</Choice></div>
      <div className="lg:col-span-5 bg-navy-800 text-cream-200 p-6 md:p-10 flex flex-col justify-between min-h-[560px]"><div><div className="section-label text-gold-300 mb-5">TU SELECCIÓN</div><h3 className="font-display text-7xl md:text-8xl tracking-tightest">VORA {model.name}</h3><p className="mt-5 text-cream-200/60">{model.size} · {model.bedrooms} dormitorios · {model.bathrooms} baños</p></div><div className="space-y-4"><div className="grid grid-cols-2 gap-3 border-t border-cream-200/10 pt-5"><div><div className="section-label text-cream-200/40">INTERIOR</div><div className="mt-2">{interior}</div></div><div><div className="section-label text-cream-200/40">EXTERIOR</div><div className="mt-2">{exterior}</div></div></div><a href={contactHref} onClick={()=>track('cta_click',{cta:'configurator_proposal',model:model.id,interior,exterior})} className="w-full justify-center btn-primary bg-cream-200 !text-navy-700"><span>Solicitar propuesta</span><ArrowUpRight size={16}/></a></div></div>
    </div></div></section>
}
function Choice({title,children}){return <div><div className="section-label text-navy-700/45 mb-4">{title}</div><div className="flex flex-wrap gap-2 md:gap-3">{children}</div></div>}
