import { ArrowUpRight, Check } from 'lucide-react'
import useMediaQuery from '../hooks/useMediaQuery'
import { navigateToJourneySection, PLOT_OPTIONS } from '../lib/configuration'
import { track, trackOnce } from '../lib/analytics'

const OPTIONS={
  'Ya tengo parcela':'Comparte su ubicación y revisaremos el encaje inicial del modelo.',
  'La estoy buscando':'Cuéntanos el modelo que estás valorando y en qué punto estás.',
  'Aún no tengo':'Puedes empezar por comparar y configurar una VORA antes de disponer de terreno.',
  'No sé si es apta':'Indica qué parcela tienes para que VORA pueda valorar el encaje inicial.',
}

function analyticsStatus(value){
  return ({'Ya tengo parcela':'owned','La estoy buscando':'searching','Aún no tengo':'not_yet','No sé si es apta':'unknown_fit'})[value]
}

export default function LandStatus(){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')

  const choose=(event,plot)=>{
    event.preventDefault()
    const status=analyticsStatus(plot)
    track('land_status_select',{land_status:status,source:'land-journey',placement:'land_status'})
    trackOnce(`contact-cta:land-journey:${status}`,'contact_cta_click',{source:'land-journey',placement:'land_status',land_status:status})
    navigateToJourneySection({target:'contact',plot,source:'land-journey',reducedMotion})
  }

  return <section id="land" aria-labelledby="land-title" className="bg-cream-100 py-24 md:py-32 text-navy-700">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-5 md:gap-8">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-gold-500">TU PUNTO DE PARTIDA</div></div>
        <div className="col-span-12 md:col-span-8"><h2 id="land-title" className="font-display text-display leading-[.95] tracking-tightest">El terreno no tiene<br/><em className="italic text-gold-400 font-light">por qué frenarte.</em></h2><p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy-700/68">Puedes hablar con VORA aunque todavía no tengas parcela. Elige la situación que mejor describe tu proyecto y el formulario quedará preparado.</p></div>
      </div>
      <div className="mt-10 md:mt-14 grid gap-3 md:grid-cols-2">
        {PLOT_OPTIONS.map((option,index)=><a key={option} href={`/?plot=${encodeURIComponent(option)}&source=land-journey#contact`} onClick={(event)=>choose(event,option)} className="group min-h-44 border border-navy-700/12 bg-cream-200 p-6 md:p-8 flex flex-col justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"><div className="flex items-center justify-between"><span className="section-label text-gold-500">{String(index+1).padStart(2,'0')}</span><span className="w-9 h-9 rounded-full border border-navy-700/15 flex items-center justify-center transition-colors group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-cream-200"><ArrowUpRight size={15} aria-hidden="true"/></span></div><div><h3 className="font-display text-3xl tracking-tightest">{option}</h3><p className="mt-3 max-w-xl text-sm leading-relaxed text-navy-700/60">{OPTIONS[option]}</p></div></a>)}
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-navy-700/55"><Check size={15} className="mt-0.5 flex-none text-gold-500" aria-hidden="true"/>Seleccionar una opción solo la añade a tu consulta; no implica contratar ningún servicio.</p>
    </div>
  </section>
}
