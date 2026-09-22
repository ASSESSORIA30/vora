import { useState } from 'react'
import { ArrowUpRight, Bath, BedDouble, BriefcaseBusiness, CarFront, Check, Waves } from 'lucide-react'
import useMediaQuery from '../hooks/useMediaQuery'
import { analyticsFunnelKey, track, trackOnce } from '../lib/analytics'
import { navigateToJourneySection } from '../lib/configuration'
import { findCompatibleModels, modelCapabilities } from '../lib/modelFinder'

const INITIAL = { bedrooms: 3, bathrooms: 2, office: false, garage: false, pool: false }

export default function ModelFinder() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [criteria, setCriteria] = useState(INITIAL)
  const [results, setResults] = useState(null)

  const update = (field, value) => {
    trackOnce('model-finder-start', 'model_finder_start', { source: 'home' })
    setCriteria((current) => ({ ...current, [field]: value }))
    setResults(null)
  }

  const submit = (event) => {
    event.preventDefault()
    trackOnce('model-finder-start', 'model_finder_start', { source: 'home' })
    const matches = findCompatibleModels(criteria)
    setResults(matches)
    track('model_finder_complete', { ...criteria, result_count: matches.length })
  }

  const configure = (event, model) => {
    event.preventDefault()
    track('model_finder_result_click', { model: model.id, action: 'configure' })
    trackOnce(analyticsFunnelKey('configurator-start', 'model-finder', model.id), 'configurator_start', { source: 'model-finder', model: model.id, placement: 'model_finder' })
    navigateToJourneySection({ target: 'configurator', model: model.name, source: 'model-finder', reducedMotion })
  }

  const contact = (event) => {
    event.preventDefault()
    track('contact_cta_click', { cta: 'model_finder_help', source: 'model-finder', placement: 'model_finder', has_configuration: false })
    navigateToJourneySection({ target: 'contact', source: 'model-finder', reducedMotion })
  }

  return <section id="model-finder" aria-labelledby="model-finder-title" className="bg-navy-800 py-24 text-cream-200 md:py-36">
    <div className="max-w-[1500px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-6 md:gap-8"><div className="col-span-12 md:col-span-4"><div className="section-label text-gold-300">ENCUENTRA TU ESCALA</div></div><div className="col-span-12 md:col-span-8"><h2 id="model-finder-title" className="font-display text-display leading-[.94] tracking-tightest">¿Qué necesitas<br/><em className="italic text-gold-300 font-light">de tu VORA?</em></h2><p className="mt-7 max-w-2xl text-lg text-cream-200/70">Selecciona criterios objetivos. Mostraremos hasta tres modelos que cumplen todos, ordenados por la capacidad más próxima.</p></div></div>

      <form onSubmit={submit} className="mt-12 border border-cream-200/15 md:mt-16">
        <FinderChoice label="Dormitorios mínimos" values={[3, 4, 5]} value={criteria.bedrooms} onSelect={(value) => update('bedrooms', value)}/>
        <FinderChoice label="Baños mínimos" values={[2, 3, 4]} value={criteria.bathrooms} onSelect={(value) => update('bathrooms', value)}/>
        <div className="grid gap-4 border-b border-cream-200/12 p-5 md:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] md:p-7"><div className="section-label text-cream-200/55">CARACTERÍSTICAS NECESARIAS</div><div className="grid gap-2 sm:grid-cols-3"><FeatureToggle active={criteria.office} icon={BriefcaseBusiness} label="Despacho" onClick={() => update('office', !criteria.office)}/><FeatureToggle active={criteria.garage} icon={CarFront} label="Garaje" onClick={() => update('garage', !criteria.garage)}/><FeatureToggle active={criteria.pool} icon={Waves} label="Piscina" onClick={() => update('pool', !criteria.pool)}/></div></div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-7"><p className="max-w-2xl text-sm text-cream-200/55">Una característica solo cuenta cuando está indicada explícitamente en el modelo. “Preparada para piscina” no se interpreta como piscina incluida.</p><button type="submit" className="btn-primary !bg-cream-200 !text-navy-700 justify-center"><span>Ver modelos compatibles</span><ArrowUpRight size={16}/></button></div>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {results && <section aria-labelledby="finder-results-title" className="mt-10 md:mt-14"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="section-label text-gold-300">RESULTADO</div><h3 id="finder-results-title" className="mt-3 font-display text-4xl md:text-6xl tracking-tightest">{results.length ? 'Modelos que cumplen tus criterios.' : 'No hay una coincidencia exacta.'}</h3></div>{results.length > 0 && <a href="#compare" onClick={() => track('model_finder_result_click', { action: 'compare' })} className="min-h-11 inline-flex items-center gap-2 text-sm link-underline">Comparar toda la colección <ArrowUpRight size={14}/></a>}</div>
          {results.length > 0 ? <div className="mt-8 grid gap-4 lg:grid-cols-3">{results.map((model) => <ResultCard key={model.id} model={model} onConfigure={configure}/>)}</div> : <div className="mt-7 border border-cream-200/15 p-6"><p className="max-w-xl text-cream-200/70">Puedes revisar los criterios o compartir tus necesidades para valorar el punto de partida.</p><a href="/?source=model-finder#contact" onClick={contact} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm link-underline">Hablar del proyecto <ArrowUpRight size={14}/></a></div>}
        </section>}
      </div>
    </div>
  </section>
}

function FinderChoice({ label, values, value, onSelect }) {
  return <div className="grid gap-4 border-b border-cream-200/12 p-5 md:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] md:p-7"><div className="section-label text-cream-200/55">{label}</div><div role="group" aria-label={label} className="grid grid-cols-3 gap-2">{values.map((option) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onSelect(option)} className={`min-h-12 rounded-full border px-4 text-sm transition-colors ${value === option ? 'border-cream-200 bg-cream-200 text-navy-800' : 'border-cream-200/20 hover:border-gold-300'}`}>{option}</button>)}</div></div>
}

function FeatureToggle({ active, icon: Icon, label, onClick }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-14 border px-4 flex items-center justify-between gap-3 text-sm transition-colors ${active ? 'border-gold-300 bg-gold-300 text-navy-900' : 'border-cream-200/20 hover:border-gold-300'}`}><span className="inline-flex items-center gap-2"><Icon size={16}/>{label}</span>{active && <Check size={15}/>}</button>
}

function ResultCard({ model, onConfigure }) {
  const capabilities = modelCapabilities(model)
  const badges = [capabilities.office && 'Despacho', capabilities.dressingRoom && 'Vestidor', capabilities.garage && 'Garaje', capabilities.pool && 'Piscina'].filter(Boolean)
  return <article data-model-finder-result={model.id} className="flex min-h-full flex-col border border-cream-200/15 bg-navy-700"><a href={`/modelos/${model.id}`} onClick={() => track('model_finder_result_click', { model: model.id, action: 'view' })} className="group block"><div className="aspect-[16/9] overflow-hidden"><img src={model.image} alt={`Exterior VORA ${model.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.025]"/></div></a><div className="flex flex-1 flex-col p-5"><div className="section-label text-gold-300">MODELO COMPATIBLE</div><h4 className="mt-2 font-display text-5xl tracking-tightest">VORA {model.name}</h4><div className="mt-4 flex gap-5 text-sm text-cream-200/70"><span className="inline-flex items-center gap-2"><BedDouble size={15}/>{model.bedrooms} dormitorios</span><span className="inline-flex items-center gap-2"><Bath size={15}/>{model.bathrooms} baños</span></div>{badges.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{badges.map((badge) => <li key={badge} className="rounded-full border border-cream-200/15 px-3 py-1.5 text-xs">{badge}</li>)}</ul>}<div className="mt-auto grid grid-cols-2 gap-2 pt-6"><a href={`/modelos/${model.id}`} onClick={() => track('model_finder_result_click', { model: model.id, action: 'view' })} className="min-h-11 rounded-full border border-cream-200/20 px-3 inline-flex items-center justify-center text-sm">Ver modelo</a><a href={`/?model=${encodeURIComponent(model.name)}&source=model-finder#configurator`} onClick={(event) => onConfigure(event, model)} className="min-h-11 rounded-full bg-cream-200 px-3 inline-flex items-center justify-center text-sm text-navy-800">Configurar</a></div></div></article>
}
