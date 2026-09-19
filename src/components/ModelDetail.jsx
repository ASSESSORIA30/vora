import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, X } from 'lucide-react'

const INCLUDED = [
  'Cocina equipada', 'Electrodomésticos', 'Mobiliario', 'Iluminación',
  'Baños terminados', 'Climatización', 'Armarios', 'Acabados interiores',
]

export default function ModelDetail({ model, onClose }) {
  useEffect(() => {
    if (!model) return
    window.lenis?.stop?.()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.lenis?.start?.()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [model, onClose])

  return (
    <AnimatePresence>
      {model && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .45 }}
          className="fixed inset-0 z-[90] bg-cream-200 text-navy-700 overflow-y-auto"
          data-lenis-prevent
        >
          <button onClick={onClose} className="fixed top-5 right-5 md:top-7 md:right-8 z-[100] w-12 h-12 rounded-full bg-cream-200/90 backdrop-blur-xl border border-navy-700/10 flex items-center justify-center hover:bg-navy-700 hover:text-cream-200 transition-colors" aria-label="Cerrar ficha">
            <X size={18}/>
          </button>

          <section className="relative min-h-[88svh] md:min-h-screen overflow-hidden bg-navy-800 text-cream-200">
            <motion.img initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: [0.16,1,0.3,1] }} src={model.image} alt={`VORA ${model.name}`} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/12 to-navy-900/18" />
            <div className="relative z-10 min-h-[88svh] md:min-h-screen max-w-[1600px] mx-auto px-6 md:px-12 py-8 flex flex-col justify-between">
              <div className="section-label text-cream-200/70">{model.code} · {model.tag}</div>
              <div className="pb-8 md:pb-12 grid grid-cols-12 gap-5 md:gap-8 items-end">
                <div className="col-span-12 lg:col-span-8">
                  <div className="section-label text-gold-200 mb-4">VORA COLLECTION</div>
                  <h2 className="font-display text-[clamp(5.5rem,14vw,14rem)] leading-[.72] tracking-[-.07em]">{model.name}</h2>
                  <p className="mt-7 font-display text-2xl md:text-4xl leading-tight max-w-2xl">{model.statement}</p>
                </div>
                <div className="col-span-12 lg:col-span-4 lg:text-right">
                  <div className="section-label text-cream-200/55">{model.size} · {model.bedrooms} dormitorios · {model.bathrooms} baños</div>
                  <div className="mt-6 inline-flex items-center gap-3 text-sm">Descubrir la casa <ArrowDown size={14}/></div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 md:py-36 max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              <div className="col-span-12 md:col-span-4 section-label text-navy-700/45">ARQUITECTURA / {model.code}</div>
              <div className="col-span-12 md:col-span-8">
                <h3 className="font-display text-[clamp(2.8rem,6vw,7rem)] leading-[.95] tracking-tightest max-w-5xl">Diseñada para que <em className="italic text-gold-400 font-light">todo encaje</em> desde el principio.</h3>
                <p className="mt-8 md:mt-12 text-lg md:text-2xl leading-relaxed text-navy-700/72 max-w-3xl">{model.narrative}</p>
              </div>
            </div>
          </section>

          <section className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="grid grid-cols-12 gap-3 md:gap-6 max-w-[1800px] mx-auto">
              <figure className="col-span-12 lg:col-span-7 aspect-[4/3] lg:aspect-[16/11] overflow-hidden bg-navy-500"><img src={model.image} alt={`Exterior VORA ${model.name}`} className="w-full h-full object-cover" /></figure>
              <figure className="col-span-12 lg:col-span-5 aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-navy-500"><img src={model.interior} alt={`Interior VORA ${model.name}`} className="w-full h-full object-cover" /></figure>
            </div>
          </section>

          <section className="py-20 md:py-32 bg-navy-800 text-cream-200">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-12 gap-7 md:gap-10 mb-16">
                <div className="col-span-12 md:col-span-4"><div className="section-label text-gold-300">LA CASA</div></div>
                <div className="col-span-12 md:col-span-8"><h3 className="font-display text-display leading-[.95] tracking-tightest">Un modelo cerrado.<br/><em className="italic text-gold-300 font-light">Una vida abierta.</em></h3></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-cream-200/12">
                <Spec label="Superficie" value={model.size}/><Spec label="Dormitorios" value={String(model.bedrooms).padStart(2,'0')}/><Spec label="Baños" value={String(model.bathrooms).padStart(2,'0')}/><Spec label="Plantas" value={String(model.floors).padStart(2,'0')}/>
              </div>
              <div className="grid grid-cols-12 gap-8 mt-14 md:mt-20">
                <div className="col-span-12 md:col-span-5"><p className="text-cream-200/55 section-label mb-4">PENSADA PARA</p><p className="font-display text-3xl md:text-4xl leading-tight">{model.idealFor}</p></div>
                <div className="col-span-12 md:col-start-7 md:col-span-6 grid grid-cols-2 gap-x-8 gap-y-4">{model.features.map((f,i)=><div key={f} className="py-3 border-b border-cream-200/12 flex items-center gap-3 text-sm md:text-base"><span className="text-gold-300 section-label">0{i+1}</span>{f}</div>)}</div>
              </div>
            </div>
          </section>

          <section className="py-20 md:py-36 max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              <div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/45">READY TO LIVE</div></div>
              <div className="col-span-12 md:col-span-8">
                <h3 className="font-display text-display leading-[.95] tracking-tightest">No entregamos metros.<br/><em className="italic text-gold-400 font-light">Entregamos la casa.</em></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-7 mt-12 md:mt-16">{INCLUDED.map((item,i)=><div key={item} className="py-5 border-t border-navy-700/15"><div className="section-label text-gold-400 mb-2">{String(i+1).padStart(2,'0')}</div><div className="text-sm md:text-base">{item}</div></div>)}</div>
              </div>
            </div>
          </section>

          <section className="concrete-surface py-24 md:py-36 overflow-hidden">
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 lg:col-span-8"><div className="section-label text-navy-700/50 mb-5">VORA {model.name}</div><h3 className="font-display text-display leading-[.9] tracking-tightest">Esta puede ser<br/>tu próxima casa.</h3></div>
              <div className="col-span-12 lg:col-span-4 lg:text-right mt-8 lg:mt-0"><button onClick={()=>{onClose();setTimeout(()=>window.lenis?.scrollTo(document.querySelector('#contact'),{offset:-20,duration:1.4}),350)}} className="btn-primary"><span>Quiero esta VORA</span><ArrowUpRight size={16}/></button><p className="mt-5 text-sm text-navy-700/55">Distribución conceptual sujeta a adaptación técnica, urbanística y estructural.</p></div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Spec({label,value}){
  return <div className="min-h-[170px] md:min-h-[210px] border-r border-b border-cream-200/12 p-5 md:p-8 flex flex-col justify-between"><div className="section-label text-cream-200/45">{label}</div><div className="font-display text-5xl md:text-7xl tracking-tightest">{value}</div></div>
}
