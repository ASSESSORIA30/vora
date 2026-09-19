import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instagram, Linkedin } from 'lucide-react'
import { BRAND } from '../config/brand'

gsap.registerPlugin(ScrollTrigger)

export default function Footer(){
  const footerRef=useRef(null),megaRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{gsap.fromTo(megaRef.current,{yPercent:30,opacity:0},{yPercent:0,opacity:1,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:megaRef.current,start:'top 85%'}})},footerRef);return()=>ctx.revert()},[])
  return <footer ref={footerRef} className="relative bg-navy-900 text-cream-200 pt-20 md:pt-32 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div ref={megaRef} className="pb-8 md:pb-12 border-b border-cream-200/10"><div className="font-display uppercase text-[28vw] md:text-[22vw] leading-[0.72] tracking-[-0.075em]">VORA</div><div className="mt-5 section-label text-gold-300">CONCRETE LIVING</div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 md:py-16">
        <div><div className="section-label text-gold-300 mb-4">NAVEGACIÓN</div><ul className="space-y-2 text-cream-200/75 text-sm"><li><a href="#about" className="link-underline">Concepto</a></li><li><a href="#models" className="link-underline">Colección</a></li><li><a href="#process" className="link-underline">Proceso</a></li><li><a href="#gallery" className="link-underline">Materia</a></li><li><a href="#contact" className="link-underline">Contacto</a></li></ul></div>
        <div><div className="section-label text-gold-300 mb-4">MARCA</div><p className="text-cream-200/75 text-sm leading-relaxed">Viviendas industrializadas<br/>de hormigón.<br/>Completamente equipadas.</p></div>
        <div><div className="section-label text-gold-300 mb-4">ÁMBITO</div><p className="text-cream-200/75 text-sm leading-relaxed">{BRAND.location}<br/>Información comercial<br/>pendiente de publicación.</p></div>
        <div><div className="section-label text-gold-300 mb-4">SÍGUENOS</div><div className="flex gap-3"><a href="#" className="w-10 h-10 rounded-full border border-cream-200/20 flex items-center justify-center hover:border-gold-300 hover:text-gold-300 transition-colors" aria-label="Instagram"><Instagram size={16}/></a><a href="#" className="w-10 h-10 rounded-full border border-cream-200/20 flex items-center justify-center hover:border-gold-300 hover:text-gold-300 transition-colors" aria-label="LinkedIn"><Linkedin size={16}/></a></div></div>
      </div>
      <div className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-cream-200/10 text-xs text-cream-200/40 section-label"><span>© 2026 VORA · CONCRETE LIVING</span><div className="flex gap-6"><a href="#" className="hover:text-gold-300">LEGAL</a><a href="#" className="hover:text-gold-300">PRIVACIDAD</a><a href="#" className="hover:text-gold-300">COOKIES</a></div></div>
    </div>
  </footer>
}
