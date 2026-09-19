const ITEMS = ['Concrete living','Arquitectura resuelta','Materialidad honesta','Completamente equipada','Menos decisiones','Lista para vivir']
export default function Marquee() {
  return <section className="py-9 md:py-12 bg-navy-700 text-cream-200 overflow-hidden relative border-y border-cream-200/10"><div className="marquee-track animate-marquee">{[...ITEMS,...ITEMS,...ITEMS].map((item,i)=><div key={i} className="flex items-center gap-10 px-10"><span className="font-display text-3xl md:text-5xl tracking-tighter-2">{item}</span><span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" /></div>)}</div></section>
}
