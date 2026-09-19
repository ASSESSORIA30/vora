import { useEffect, useState } from 'react'
export default function CookieConsent(){
  const [choice,setChoice]=useState(()=>{try{return localStorage.getItem('vora_consent')||''}catch{return ''}})
  useEffect(()=>{if(choice){try{localStorage.setItem('vora_consent',choice)}catch{}window.dispatchEvent(new CustomEvent('vora-consent-change',{detail:choice}))}},[choice])
  if(choice) return null
  return <div className="fixed z-[120] bottom-3 left-3 right-3 md:left-auto md:right-5 md:bottom-5 md:w-[470px] bg-cream-50 text-navy-700 border border-navy-700/10 shadow-2xl p-5 md:p-6"><div className="section-label text-gold-400 mb-3">PRIVACIDAD</div><p className="text-sm leading-relaxed text-navy-700/70">Usamos cookies necesarias para el funcionamiento y, solo con tu permiso, medición para entender qué campañas generan solicitudes.</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>setChoice('necessary')} className="px-4 py-2 rounded-full border border-navy-700/20 text-xs uppercase tracking-[.12em]">Solo necesarias</button><button onClick={()=>setChoice('analytics')} className="px-4 py-2 rounded-full bg-navy-700 text-cream-200 text-xs uppercase tracking-[.12em]">Aceptar medición</button><a href="/legal/cookies" className="px-2 py-2 text-xs underline">Más información</a></div></div>
}
