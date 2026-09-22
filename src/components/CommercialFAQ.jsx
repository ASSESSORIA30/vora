import { ChevronDown } from 'lucide-react'
import { COMMERCIAL_FAQS } from '../data/businessContent'
import { track } from '../lib/analytics'

export default function CommercialFAQ(){
  const toggle=(event,faq)=>{
    if(event.currentTarget.open)track('faq_open',{faq_id:faq.id,topic:faq.topic,placement:'home'})
  }

  return <section id="faq" aria-labelledby="commercial-faq-title" className="bg-cream-200 py-24 md:py-36 text-navy-700">
    <div className="max-w-[1300px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 gap-5 md:gap-8">
        <div className="col-span-12 md:col-span-4"><div className="section-label text-gold-500">PREGUNTAS CLAVE</div></div>
        <div className="col-span-12 md:col-span-8"><h2 id="commercial-faq-title" className="font-display text-display leading-[.95] tracking-tightest">Antes de dar<br/><em className="italic text-gold-400 font-light">el siguiente paso.</em></h2><p className="mt-7 max-w-xl text-lg text-navy-700/68">Respuestas basadas en la información que VORA puede confirmar hoy.</p></div>
      </div>
      <div className="mt-12 md:mt-16 border-t border-navy-700/12">
        {COMMERCIAL_FAQS.map((faq,index)=><details key={faq.id} onToggle={(event)=>toggle(event,faq)} className="group border-b border-navy-700/12"><summary className="min-h-20 cursor-pointer list-none py-5 flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"><span className="section-label text-gold-500">{String(index+1).padStart(2,'0')}</span><span className="flex-1"><span className="block text-[10px] uppercase tracking-[.16em] text-navy-700/45">{faq.topic}</span><span className="mt-1 block font-display text-2xl md:text-3xl tracking-tightest">{faq.question}</span></span><ChevronDown size={18} className="flex-none transition-transform duration-300 motion-reduce:transition-none group-open:rotate-180" aria-hidden="true"/></summary><div className="pb-7 pl-10 pr-9 md:pl-14"><p className="max-w-3xl leading-relaxed text-navy-700/68">{faq.answer}</p></div></details>)}
      </div>
      <div className="mt-10"><a href="/#contact" className="btn-primary"><span>Hablar de mi proyecto</span></a></div>
    </div>
  </section>
}
