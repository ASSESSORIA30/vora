import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import BrandLogo from './BrandLogo'

const NAV = [['Colección', '/#models'], ['Compara', '/#compare'], ['Configura', '/#configurator'], ['Proceso', '/#process'], ['Preguntas', '/#faq'], ['Contacto', '/#contact']]

export default function Navbar({ forceLight = false }) {
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const [scrolled, setScrolled] = useState(forceLight)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (forceLight) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [forceLight])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const lenis = window.lenis
    const wasStopped = lenis?.isStopped
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    const focusable = () => Array.from(menuRef.current?.querySelectorAll('a[href],button:not([disabled])') || [])
    focusable()[0]?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
      if (event.key === 'Tab') {
        const items = focusable()
        const first = items[0]
        const last = items.at(-1)
        if (event.shiftKey && (document.activeElement === first || !menuRef.current?.contains(document.activeElement))) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && (document.activeElement === last || !menuRef.current?.contains(document.activeElement))) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    const desktop = window.matchMedia('(min-width:1024px)')
    const onResize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
      document.body.style.overflow = previousOverflow
      if (!wasStopped) lenis?.start()
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return <>
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-cream-200/90 backdrop-blur-xl border-b border-navy-700/10' : 'py-5 bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" aria-label="VORA inicio"><BrandLogo light={!scrolled}/></a>
        <nav className="hidden lg:flex items-center gap-9">{NAV.map(([label, href]) => <a key={href} href={href} className={`text-sm link-underline ${scrolled ? 'text-navy-700/80' : 'text-cream-200/85'}`}>{label}</a>)}</nav>
        <div className="flex items-center gap-4">
          <a href="/#contact" className={`hidden md:inline-flex items-center gap-2 text-sm font-medium ${scrolled ? 'text-navy-700' : 'text-cream-200'}`}><span className="w-1.5 h-1.5 rounded-full bg-gold-400"/> Hablar del proyecto</a>
          <button ref={triggerRef} type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)} className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-full border ${scrolled ? 'border-navy-700/20 text-navy-700' : 'border-cream-200/30 text-cream-200'}`} aria-label="Abrir menú"><Menu size={18}/></button>
        </div>
      </div>
    </header>
    {open && <div ref={menuRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navegación principal" data-lenis-prevent className="mobile-navigation fixed inset-0 z-[60] bg-navy-800 text-cream-200 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between p-6"><BrandLogo light/><button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="w-11 h-11 rounded-full border border-cream-200/20 flex items-center justify-center"><X size={18}/></button></div>
      <div className="flex-1 flex flex-col justify-center px-6 gap-3">{NAV.map(([label, href], index) => <a key={href} href={href} onClick={() => setOpen(false)} style={{ '--menu-index': index }} className="mobile-navigation-link min-h-12 flex items-center font-display text-4xl sm:text-5xl tracking-tightest">{label}</a>)}</div>
      <div className="p-6 border-t border-cream-200/10 section-label text-cream-200/50">VORA · CONCRETE LIVING</div>
    </div>}
  </>
}
