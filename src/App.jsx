import { useEffect, useMemo, useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Models from './components/Models'
import Benefits from './components/Benefits'
import Configurator from './components/Configurator'
import Process from './components/Process'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Analytics from './components/Analytics'
import CookieConsent from './components/CookieConsent'
import ModelPage from './pages/ModelPage'
import SearchLanding from './pages/SearchLanding'
import LegalPage from './pages/LegalPage'
import { getHouseById } from './data/houses'

const LANDINGS=new Set(['casas-industrializadas-hormigon','casas-hormigon-llave-en-mano','casas-modulares-premium'])
function route(){const path=window.location.pathname.replace(/\/+$/,'')||'/';if(path==='/')return {type:'home'};const m=path.match(/^\/modelos\/(vora-[a-z0-9-]+)$/);if(m)return {type:'model',id:m[1]};const landing=path.slice(1);if(LANDINGS.has(landing))return {type:'landing',slug:landing};const legal=path.match(/^\/legal\/(aviso-legal|privacidad|cookies)$/);if(legal)return {type:'legal',legalType:legal[1]};return {type:'home'}}

export default function App(){const current=useMemo(route,[]);const [loaded,setLoaded]=useState(current.type!=='home');useEffect(()=>{document.body.style.overflow=loaded?'':'hidden';if(loaded&&current.type==='home'&&window.location.hash){setTimeout(()=>document.querySelector(window.location.hash)?.scrollIntoView({behavior:'smooth'}),120)}return()=>{document.body.style.overflow=''}},[loaded,current.type]);if(current.type==='model'){const model=getHouseById(current.id);return model?<><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><ModelPage model={model}/></SmoothScroll></>:<NotFound/>}if(current.type==='landing')return <><Analytics/><CookieConsent/><CustomCursor/><SmoothScroll><SearchLanding slug={current.slug}/></SmoothScroll></>;if(current.type==='legal')return <><Analytics/><CookieConsent/><SmoothScroll><LegalPage type={current.legalType}/></SmoothScroll></>;return <><Analytics/><CookieConsent/><Preloader onComplete={()=>setLoaded(true)}/><CustomCursor/>{loaded&&<SmoothScroll><Navbar/><main><Hero/><Marquee/><About/><Models/><Benefits/><Configurator/><Process/><Gallery/><Contact/></main><Footer/></SmoothScroll>}</>}
function NotFound(){return <main className="min-h-screen bg-cream-200 flex items-center justify-center p-8"><div><div className="section-label text-gold-400 mb-4">404</div><h1 className="font-display text-6xl">Esta VORA no existe.</h1><a href="/" className="btn-primary mt-8"><span>Volver al inicio</span></a></div></main>}
