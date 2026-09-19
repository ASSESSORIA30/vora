import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BrandLogo from './BrandLogo'

const NAV_ITEMS = [
  { label: 'Concepto', href: '#about' },
  { label: 'Colección', href: '#models' },
  { label: 'Proceso', href: '#process' },
  { label: 'Materia', href: '#gallery' },
  { label: 'Contacto', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll(); window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault(); setMenuOpen(false)
    const target = document.querySelector(href); if (!target) return
    window.lenis ? window.lenis.scrollTo(target, { offset: -20, duration: 1.6 }) : target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-cream-200/88 backdrop-blur-xl border-b border-navy-700/10' : 'py-5 bg-transparent'}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#top" onClick={(e) => handleClick(e, '#top')}>
            <BrandLogo light={!scrolled} />
          </a>
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_ITEMS.map((item) => <a key={item.href} href={item.href} onClick={(e) => handleClick(e, item.href)} className={`text-sm link-underline transition-colors ${scrolled ? 'text-navy-700/80 hover:text-navy-700' : 'text-cream-200/85 hover:text-cream-200'}`}>{item.label}</a>)}
          </nav>
          <div className="flex items-center gap-4">
            <a href="#contact" onClick={(e) => handleClick(e, '#contact')} className={`hidden md:inline-flex items-center gap-2 text-sm font-medium ${scrolled ? 'text-navy-700' : 'text-cream-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-shimmer" /> Quiero una VORA
            </a>
            <button onClick={() => setMenuOpen(true)} className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border ${scrolled ? 'border-navy-700/20 text-navy-700' : 'border-cream-200/30 text-cream-200'}`} aria-label="Abrir menú"><Menu size={18} /></button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }} className="fixed inset-0 z-[60] bg-navy-800 text-cream-200 flex flex-col">
            <div className="flex items-center justify-between p-6"><BrandLogo light /><button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-200/20" aria-label="Cerrar menú"><X size={18} /></button></div>
            <div className="flex-1 flex flex-col justify-center px-6 gap-4">
              {NAV_ITEMS.map((item, i) => <motion.a key={item.href} href={item.href} onClick={(e) => handleClick(e, item.href)} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-display text-6xl tracking-tightest leading-none py-2">{item.label}</motion.a>)}
            </div>
            <div className="p-6 border-t border-cream-200/10 section-label text-cream-200/50">VORA · CONCRETE LIVING · CATALUNYA</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
