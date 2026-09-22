import { useEffect, useMemo } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Models from './components/Models'
import ModelComparison from './components/ModelComparison'
import ModelFinder from './components/ModelFinder'
import Benefits from './components/Benefits'
import Configurator from './components/Configurator'
import Process from './components/Process'
import LandStatus from './components/LandStatus'
import CommercialFAQ from './components/CommercialFAQ'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Analytics from './components/Analytics'
import CookieConsent from './components/CookieConsent'
import ModelPage from './pages/ModelPage'
import SearchLanding from './pages/SearchLanding'
import LegalPage from './pages/LegalPage'
import GuidePage, { GuideIndexPage } from './pages/GuidePage'
import { getHouseById } from './data/houses'
import { GUIDE_PAGES } from './data/siteContent'

const LANDINGS=new Set(['casas-industrializadas-hormigon','casas-hormigon-llave-en-mano','casas-modulares-premium'])
function route(){const path=window.location.pathname.replace(/\/+$/,'')||'/';if(path==='/')return {type:'home'};const m=path.match(/^\/modelos\/(vora-[a-z0-9-]+)$/);if(m)return {type:'model',id:m[1]};const landing=path.slice(1);if(LANDINGS.has(landing))return {type:'landing',slug:landing};if(path==='/guias')return {type:'guide-index'};const guide=path.match(/^\/guias\/([a-z0-9-]+)$/);if(guide&&GUIDE_PAGES[guide[1]])return {type:'guide',slug:guide[1]};const legal=path.match(/^\/legal\/(aviso-legal|privacidad|cookies)$/);if(legal)return {type:'legal',legalType:legal[1]};return {type:'not-found'}}

export function HomePage(){return <><Navbar/><main><Hero/><Marquee/><About/><Models/><ModelFinder/><ModelComparison/><Benefits/><Configurator/><Process/><LandStatus/><Gallery/><CommercialFAQ/><Contact/></main><Footer/></>}

export default function App(){const current=useMemo(route,[]);useEffect(()=>{if(current.type!=='home'||!window.location.hash)return;const timer=setTimeout(()=>document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({behavior:'instant'}),120);return()=>clearTimeout(timer)},[current.type]);if(current.type==='model'){const model=getHouseById(current.id);return model?<><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><ModelPage model={model}/></SmoothScroll></>:<><Analytics/><CookieConsent/><NotFound/></>}if(current.type==='landing')return <><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><SearchLanding slug={current.slug}/></SmoothScroll></>;if(current.type==='guide-index')return <><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><GuideIndexPage/></SmoothScroll></>;if(current.type==='guide')return <><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><GuidePage slug={current.slug}/></SmoothScroll></>;if(current.type==='legal')return <><Analytics/><CookieConsent/><SmoothScroll><LegalPage type={current.legalType}/></SmoothScroll></>;if(current.type==='not-found')return <><Analytics/><CookieConsent/><NotFound/></>;return <><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><HomePage/></SmoothScroll></>}

export function NotFound(){return <><Navbar forceLight/><main className="min-h-screen bg-cream-200 flex items-center justify-center p-8"><div><div className="section-label text-gold-400 mb-4">ERROR 404</div><h1 className="font-display text-6xl md:text-8xl tracking-tightest">Esta página no existe.</h1><p className="mt-6 max-w-xl text-lg text-navy-700/65">Puedes volver a la colección VORA o comparar los modelos disponibles.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/#models" className="btn-primary"><span>Ver la colección</span></a><a href="/#compare" className="inline-flex min-h-12 items-center rounded-full border border-navy-700/20 px-6 text-sm font-medium">Comparar modelos</a></div></div></main><Footer/></>}
