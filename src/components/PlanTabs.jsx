import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minus, Plus, X } from 'lucide-react'
import PlanView from './PlanView'
import { track } from '../lib/analytics'

export default function PlanTabs({model,showMeasurements=true}){
  const [furnished,setFurnished]=useState(true)
  const [expanded,setExpanded]=useState(false)
  const [zoom,setZoom]=useState(1.25)
  const expandButtonRef=useRef(null),closeButtonRef=useRef(null),dialogRef=useRef(null)

  useEffect(()=>{
    if(!expanded)return
    const previousOverflow=document.body.style.overflow
    const lenis=window.lenis
    const wasStopped=lenis?.isStopped
    lenis?.stop()
    document.body.style.overflow='hidden'
    closeButtonRef.current?.focus()
    const onKey=(event)=>{
      if(event.key==='Escape')setExpanded(false)
      if(event.key==='Tab'){
        const items=Array.from(dialogRef.current?.querySelectorAll('button:not([disabled])')||[])
        const first=items[0],last=items.at(-1)
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
      }
    }
    document.addEventListener('keydown',onKey)
    return()=>{
      document.removeEventListener('keydown',onKey)
      document.body.style.overflow=previousOverflow
      if(!wasStopped)lenis?.start()
      expandButtonRef.current?.focus({preventScroll:true})
    }
  },[expanded])

  const openPlan=()=>{
    setZoom(1.25)
    setExpanded(true)
    track('plan_expand',{model:model.id,view:furnished?'furnished':'clean'})
  }

  return <div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Vista del plano" className="flex gap-2"><PlanButton active={!furnished} onClick={()=>setFurnished(false)}>Plano limpio</PlanButton><PlanButton active={furnished} onClick={()=>setFurnished(true)}>Amueblado</PlanButton></div>
      <button ref={expandButtonRef} type="button" onClick={openPlan} className="min-h-11 inline-flex items-center gap-2 rounded-full border border-navy-700/20 px-4 text-xs uppercase tracking-[.1em] hover:border-gold-400"><Maximize2 size={15} aria-hidden="true"/> Ampliar plano</button>
    </div>
    <PlanView model={model} furnished={furnished} showMeasurements={showMeasurements}/>
    {expanded&&<div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="expanded-plan-title" className="fixed inset-0 z-[140] flex flex-col bg-cream-100 text-navy-700">
      <div className="flex min-h-16 items-center justify-between gap-4 border-b border-navy-700/12 bg-cream-200 px-4 md:px-6"><div><div className="section-label text-gold-500">PLANO AMPLIADO</div><h2 id="expanded-plan-title" className="font-display text-xl md:text-2xl">VORA {model.name}</h2></div><button ref={closeButtonRef} type="button" onClick={()=>setExpanded(false)} aria-label="Cerrar plano ampliado" className="w-11 h-11 rounded-full border border-navy-700/20 flex items-center justify-center"><X size={18}/></button></div>
      <div data-lenis-prevent className="flex-1 overflow-auto overscroll-contain bg-[#c8c5be] p-4 touch-pan-x touch-pan-y">
        <div className="mx-auto origin-top-left" style={{width:`${Math.round(900*zoom)}px`}}><PlanView model={model} furnished={furnished} showMeasurements={showMeasurements}/></div>
      </div>
      <div className="flex min-h-16 items-center justify-between gap-4 border-t border-navy-700/12 bg-cream-200 px-4 md:px-6"><p className="hidden sm:block text-sm text-navy-700/60">Desplázate por el plano para leer cada estancia.</p><div role="group" aria-label="Zoom del plano" className="ml-auto flex items-center gap-2"><button type="button" onClick={()=>setZoom(value=>Math.max(1,value-.25))} disabled={zoom<=1} aria-label="Reducir plano" className="w-11 h-11 rounded-full border border-navy-700/20 flex items-center justify-center disabled:opacity-35"><Minus size={17}/></button><output aria-live="polite" className="min-w-14 text-center text-sm">{Math.round(zoom*100)}%</output><button type="button" onClick={()=>setZoom(value=>Math.min(2,value+.25))} disabled={zoom>=2} aria-label="Ampliar plano" className="w-11 h-11 rounded-full border border-navy-700/20 flex items-center justify-center disabled:opacity-35"><Plus size={17}/></button></div></div>
    </div>}
  </div>
}

function PlanButton({active,onClick,children}){
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 px-4 py-2 rounded-full border text-xs uppercase tracking-[.1em] ${active?'bg-navy-700 text-cream-200 border-navy-700':'border-navy-700/20'}`}>{children}</button>
}
