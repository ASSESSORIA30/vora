import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Bath, BedDouble, Check, House } from 'lucide-react'
import { HOUSES } from '../data/houses'
import useMediaQuery from '../hooks/useMediaQuery'
import { navigateToJourneySection } from '../lib/configuration'
import { analyticsFunnelKey, track, trackOnce } from '../lib/analytics'

const BEDROOM_FILTERS = [3, 4, 5]

function featureLabel(feature) {
  return feature.replace(/^Piscina \+ garaje$/, 'Piscina · Garaje')
}

export default function ModelComparison() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef = useRef(null)
  const [bedrooms, setBedrooms] = useState('all')
  const models = useMemo(() => bedrooms === 'all' ? HOUSES : HOUSES.filter((model) => model.bedrooms === bedrooms), [bedrooms])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackOnce('model-comparison-view', 'model_comparison_view', { models_shown: HOUSES.length })
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const selectBedrooms = (value) => {
    setBedrooms(value)
    track('model_comparison_select', { action: 'filter', bedrooms: value === 'all' ? 'all' : value })
  }

  const configure = (event, model) => {
    event.preventDefault()
    track('model_comparison_select', { action: 'configure', model: model.id })
    trackOnce(analyticsFunnelKey('configurator-start', 'model-comparison', model.id), 'configurator_start', { source: 'model-comparison', model: model.id, placement: 'comparison' })
    navigateToJourneySection({ target: 'configurator', model: model.name, source: 'model-comparison', reducedMotion })
  }

  const contact = (event) => {
    event.preventDefault()
    track('contact_cta_click', { cta: 'comparison_help', source: 'model-comparison', placement: 'comparison', has_configuration: false })
    trackOnce(analyticsFunnelKey('contact-start', 'model-comparison'), 'contact_start', { source: 'model-comparison', placement: 'comparison', has_configuration: false })
    navigateToJourneySection({ target: 'contact', source: 'model-comparison', reducedMotion })
  }

  return <section id="compare" ref={sectionRef} aria-labelledby="comparison-title" className="bg-cream-100 text-navy-700 py-24 md:py-36">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-5 md:gap-8 items-end">
        <div className="col-span-12 md:col-span-4">
          <div className="section-label text-gold-500">COMPARA MODELOS</div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <h2 id="comparison-title" className="font-display text-display leading-[.92] tracking-tightest">Encuentra la escala<br/><em className="italic text-gold-400 font-light">que encaja contigo.</em></h2>
          <p className="mt-7 max-w-2xl text-lg text-navy-700/68">Compara capacidad y características reales de cada modelo. La denominación identifica cada VORA sin reinterpretar su superficie técnica.</p>
        </div>
      </div>

      <div className="mt-12 md:mt-16 flex flex-col gap-4 border-y border-navy-700/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="section-label text-navy-700/50">FILTRAR POR DORMITORIOS</div>
        <div role="group" aria-label="Filtrar modelos por número de dormitorios" className="grid grid-cols-4 gap-2 sm:flex">
          <FilterButton active={bedrooms === 'all'} onClick={() => selectBedrooms('all')}>Todos</FilterButton>
          {BEDROOM_FILTERS.map((value) => <FilterButton key={value} active={bedrooms === value} onClick={() => selectBedrooms(value)}>{value}</FilterButton>)}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{models.length} modelos visibles</p>
      <div className="mt-7 grid gap-3 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => <ComparisonCard key={model.id} model={model} onConfigure={configure}/>)}
      </div>

      <div className="mt-10 md:mt-14 bg-navy-800 text-cream-200 p-7 md:p-10 grid gap-7 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="section-label text-gold-300 mb-4">ORIENTACIÓN PERSONAL</div>
          <h3 className="font-display text-4xl md:text-6xl tracking-tightest leading-none">¿Necesitas ayuda para elegir?</h3>
          <p className="mt-5 max-w-2xl text-cream-200/68">Cuéntanos qué modelo te interesa y en qué punto está tu proyecto. Partiremos de la colección existente para orientar el siguiente paso.</p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <a href="/?source=model-comparison#contact" onClick={contact} className="btn-primary !bg-cream-200 !text-navy-700"><span>Hablar del proyecto</span><ArrowUpRight size={16}/></a>
        </div>
      </div>
    </div>
  </section>
}

function FilterButton({active, onClick, children}) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 rounded-full border px-4 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${active ? 'border-navy-700 bg-navy-700 text-cream-200' : 'border-navy-700/20 hover:border-gold-400'}`}>{children}</button>
}

function ComparisonCard({model, onConfigure}) {
  const differentiators = model.features.filter((feature) => !/^\d+ (dormitorios|baños)$/.test(feature) && !/porche/i.test(feature))
  return <article data-model-comparison-card={model.id} className="flex min-h-full flex-col border border-navy-700/12 bg-cream-200">
    <a href={`/modelos/${model.id}`} onClick={() => track('model_comparison_select', { action: 'view', model: model.id })} className="group block overflow-hidden" aria-label={`Ver ficha de VORA ${model.name}`}>
      <div className="relative h-36 md:h-auto md:aspect-[16/9] overflow-hidden bg-navy-500">
        <img src={model.image} alt={`Exterior VORA ${model.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.025]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/65 via-transparent to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5 text-cream-200">
          <div><span className="section-label text-cream-200/60">VORA</span><h3 className="font-display text-4xl md:text-5xl leading-none tracking-tightest">{model.name}</h3></div>
          <span className="section-label text-gold-200">{model.tag}</span>
        </div>
      </div>
    </a>

    <div className="flex flex-1 flex-col p-4 md:p-6">
      <dl className="grid grid-cols-3 border-l border-t border-navy-700/10">
        <Fact icon={BedDouble} label="Dormitorios" value={model.bedrooms}/>
        <Fact icon={Bath} label="Baños" value={model.bathrooms}/>
        <Fact icon={House} label="Porche" value={model.surfaces.porch === null ? '—' : model.validationStatus==='verified' ? `${model.surfaces.porch} m²` : 'Sí'}/>
      </dl>

      <ul aria-label={`Características de VORA ${model.name}`} className="mt-4 flex flex-wrap gap-1.5 md:mt-5 md:gap-2">
        {differentiators.map((feature) => <li key={feature} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-navy-700/12 px-2.5 py-1.5 text-[11px] md:min-h-9 md:gap-2 md:px-3 md:py-2 md:text-xs"><Check size={12} aria-hidden="true"/><span>{featureLabel(feature)}</span></li>)}
      </ul>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-5 md:pt-7">
        <a href={`/modelos/${model.id}`} onClick={() => track('model_comparison_select', { action: 'view', model: model.id })} className="min-h-11 md:min-h-12 rounded-full border border-navy-700/20 px-3 md:px-4 inline-flex items-center justify-center gap-2 text-xs md:text-sm font-medium hover:border-gold-400">Ver modelo <ArrowUpRight size={14}/></a>
        <a href={`/?model=${encodeURIComponent(model.name)}&source=model-comparison#configurator`} onClick={(event) => onConfigure(event, model)} className="min-h-11 md:min-h-12 rounded-full bg-navy-700 px-3 md:px-4 inline-flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-cream-200 hover:bg-gold-500">Configurar <ArrowUpRight size={14}/></a>
      </div>
    </div>
  </article>
}

function Fact({icon:Icon, label, value}) {
  return <div className="min-w-0 border-b border-r border-navy-700/10 p-2.5 md:p-4"><div className="flex items-center justify-between gap-1 text-gold-500"><dt className="text-[9px] md:text-[10px] uppercase tracking-[.08em] md:tracking-[.1em] text-navy-700/50">{label}</dt><Icon size={13} aria-hidden="true"/></div><dd className="mt-2 md:mt-3 font-display text-lg md:text-2xl leading-none">{value}</dd></div>
}
