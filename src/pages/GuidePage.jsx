import { ArrowUpRight, Bath, BedDouble, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { HOUSES } from '../data/houses'
import { GUIDE_INDEX_SEO, GUIDE_PAGES } from '../data/siteContent'
import { track } from '../lib/analytics'

export function GuideIndexPage() {
  return <><Navbar forceLight/><main className="bg-cream-200 text-navy-700">
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <nav aria-label="Migas de pan" className="mb-8 text-sm text-navy-700/60"><ol className="flex items-center gap-2"><li><a href="/" className="link-underline">Inicio</a></li><li aria-hidden="true">/</li><li aria-current="page">Guías</li></ol></nav>
        <div className="grid grid-cols-12 gap-7"><div className="col-span-12 md:col-span-4"><div className="section-label text-gold-500">RECURSOS VORA</div></div><div className="col-span-12 md:col-span-8"><h1 className="font-display text-display leading-[.94] tracking-tightest">Guías para decidir<br/><em className="italic text-gold-400 font-light">con información concreta.</em></h1><p className="mt-7 max-w-2xl text-lg text-navy-700/68">{GUIDE_INDEX_SEO.description}</p></div></div>
      </div>
    </section>
    <section className="pb-24 md:pb-36"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid gap-6 md:grid-cols-2">
      {Object.entries(GUIDE_PAGES).map(([slug, guide]) => <article key={slug} className="border border-navy-700/12 bg-cream-100">
        <a href={`/guias/${slug}`} className="group block"><div className="aspect-[16/9] overflow-hidden bg-navy-500"><img src={guide.image} alt={guide.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.025]"/></div><div className="p-6 md:p-8"><div className="section-label text-gold-500">{guide.eyebrow}</div><h2 className="mt-4 font-display text-4xl md:text-5xl leading-none tracking-tightest">{guide.title}</h2><p className="mt-5 max-w-xl text-navy-700/65">{guide.lead}</p><span className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium link-underline">Leer la guía <ArrowUpRight size={14}/></span></div></a>
      </article>)}
    </div></div></section>
  </main><Footer/></>
}

export default function GuidePage({ slug }) {
  const guide = GUIDE_PAGES[slug]
  const models = guide.relatedModelIds.map((id) => HOUSES.find((house) => house.id === id)).filter(Boolean)
  const contactCta = guide.primaryCta.href.includes('#contact')
  return <><Navbar forceLight/><main className="bg-cream-200 text-navy-700">
    <article>
      <header className="pt-32 pb-16 md:pt-40 md:pb-24"><div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <nav aria-label="Migas de pan" className="mb-8 text-sm text-navy-700/60"><ol className="flex flex-wrap items-center gap-2"><li><a href="/" className="link-underline">Inicio</a></li><li aria-hidden="true">/</li><li><a href="/guias" className="link-underline">Guías</a></li><li aria-hidden="true">/</li><li aria-current="page">{guide.eyebrow}</li></ol></nav>
        <div className="section-label text-gold-500">{guide.eyebrow}</div>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.3rem,7vw,7.5rem)] leading-[.92] tracking-tightest">{guide.title}</h1>
        <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed text-navy-700/68">{guide.lead}</p>
      </div></header>
      <figure className="px-3 md:px-6"><div className="max-w-[1800px] mx-auto aspect-[16/9] md:aspect-[21/8] overflow-hidden bg-navy-500"><img src={guide.image} alt={guide.imageAlt} decoding="async" className="h-full w-full object-cover"/></div></figure>
      <div className="max-w-[1200px] mx-auto px-6 py-20 md:px-12 md:py-32">
        {guide.sections.map((section, index) => <section key={section.title} className="grid grid-cols-12 gap-6 border-t border-navy-700/12 py-10 md:py-14">
          <div className="col-span-12 md:col-span-2 section-label text-gold-500">{String(index + 1).padStart(2, '0')}</div>
          <div className="col-span-12 md:col-span-10"><h2 className="font-display text-3xl md:text-5xl tracking-tightest">{section.title}</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-relaxed text-navy-700/68">{paragraph}</p>)}</div></div>
        </section>)}
      </div>
    </article>
    <section aria-labelledby="guide-models-title" className="bg-navy-700 py-20 text-cream-200 md:py-28"><div className="max-w-[1400px] mx-auto px-6 md:px-12"><div className="section-label text-gold-300">MODELOS PARA COMPARAR</div><h2 id="guide-models-title" className="mt-4 font-display text-4xl md:text-6xl tracking-tightest">Continúa con datos reales.</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{models.map((model) => <a key={model.id} href={`/modelos/${model.id}`} onClick={() => track('select_model', { model: model.id, source: 'seo-guide', placement: slug })} className="border border-cream-200/15 p-5 hover:border-gold-300"><div className="section-label text-gold-300">VORA</div><h3 className="mt-2 font-display text-4xl">{model.name}</h3><div className="mt-5 flex gap-5 text-sm text-cream-200/70"><span className="inline-flex items-center gap-2"><BedDouble size={15}/> {model.bedrooms} dormitorios</span><span className="inline-flex items-center gap-2"><Bath size={15}/> {model.bathrooms} baños</span></div><span className="mt-6 inline-flex items-center gap-2 text-sm link-underline">Ver modelo <ArrowUpRight size={14}/></span></a>)}</div></div></section>
    <section className="py-20 md:py-28"><div className="max-w-[1200px] mx-auto px-6 md:px-12"><div className="border border-navy-700/12 p-7 md:p-10"><div className="flex items-start gap-3"><Check className="mt-1 text-gold-500" size={18}/><div><div className="section-label text-gold-500">SIGUIENTE PASO</div><h2 className="mt-4 font-display text-4xl md:text-6xl tracking-tightest">Avanza sin repetir decisiones.</h2><p className="mt-5 max-w-2xl text-navy-700/65">La selección de modelo, configuración y situación del terreno puede acompañarte hasta el formulario.</p><div className="mt-8 flex flex-wrap gap-3"><a href={guide.primaryCta.href} onClick={() => contactCta && track('contact_cta_click', { cta: 'guide_contact', source: 'seo-guide', placement: slug, has_configuration: false })} className="btn-primary"><span>{guide.primaryCta.label}</span><ArrowUpRight size={16}/></a><a href={guide.secondaryCta.href} className="inline-flex min-h-12 items-center rounded-full border border-navy-700/20 px-6 text-sm font-medium">{guide.secondaryCta.label}</a></div></div></div></div></div></section>
  </main><Footer/></>
}
