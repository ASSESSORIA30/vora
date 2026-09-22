import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight, Check, Mail, MessageCircle, Phone } from 'lucide-react'
import { HOUSES } from '../data/houses'
import { BRAND } from '../config/brand'
import useMediaQuery from '../hooks/useMediaQuery'
import { CONFIGURATION_EVENT, EXTERIORS, INTERIORS, PLOT_OPTIONS, normalizeLeadSource, optionDescription, readConfiguration } from '../lib/configuration'
import { analyticsFunnelKey, getAttribution, track, trackOnce } from '../lib/analytics'

gsap.registerPlugin(ScrollTrigger)

const EMPTY_FORM={name:'',phone:'',email:'',province:'',plot:'',model:'',interior:'',exterior:'',source:'contact',privacy:false,website:''}
const createSubmissionId=()=>globalThis.crypto?.randomUUID?.()||`vora-${Date.now()}-${Math.random().toString(36).slice(2)}`
const plotAnalyticsValue=value=>({'Ya tengo parcela':'owned','La estoy buscando':'searching','Aún no tengo':'not_yet','No sé si es apta':'unknown_fit'})[value]||'unspecified'

function validate(form){
  const errors={}
  const name=form.name.trim(),phone=form.phone.trim(),email=form.email.trim(),province=form.province.trim()
  const digits=phone.replace(/\D/g,'')
  if(name.length<2)errors.name='Escribe tu nombre.'
  else if(name.length>120)errors.name='El nombre es demasiado largo.'
  if(!/^[+\d\s().-]+$/.test(phone)||digits.length<7||digits.length>15)errors.phone='Escribe un teléfono válido.'
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='Revisa el formato del email.'
  if(province.length<2)errors.province='Escribe una provincia.'
  else if(province.length>120)errors.province='La provincia es demasiado larga.'
  if(!form.privacy)errors.privacy='Debes aceptar la política de privacidad para enviar la solicitud.'
  return errors
}

function errorMessage(code){
  if(code==='rate_limited')return 'Hemos recibido varias solicitudes seguidas. Espera unos minutos antes de volver a intentarlo.'
  if(code==='lead_channel_not_configured')return 'El formulario no está disponible temporalmente. Tus datos siguen guardados en esta página.'
  if(code==='email_provider_error'||code==='email_provider_unavailable')return 'El canal de envío no responde ahora mismo. Tus datos siguen guardados; inténtalo de nuevo en unos instantes.'
  if(code==='duplicate_submission')return 'Esta solicitud ya se está procesando. Espera unos instantes antes de volver a intentarlo.'
  return 'No hemos podido enviar la solicitud. Tus datos siguen guardados; revísalos e inténtalo de nuevo.'
}

export default function Contact({initialConfiguration:seedConfiguration={}}){
  const reducedMotion=useMediaQuery('(prefers-reduced-motion: reduce)')
  const initialConfiguration=useMemo(()=>{
    const query=readConfiguration()
    return {
      ...EMPTY_FORM,
      ...seedConfiguration,
      ...(query.model?{model:query.model}:{}),
      ...(query.interior?{interior:query.interior}:{}),
      ...(query.exterior?{exterior:query.exterior}:{}),
      ...(query.plot?{plot:query.plot}:{}),
      source:query.source||seedConfiguration.source||'contact',
    }
  },[])
  const sectionRef=useRef(null),headingRef=useRef(null),startedRef=useRef(false),sendingRef=useRef(false),successRef=useRef(null),startedAtRef=useRef(Date.now()),submissionIdRef=useRef(createSubmissionId())
  const [status,setStatus]=useState('idle'),[error,setError]=useState(''),[errors,setErrors]=useState({})
  const [form,setForm]=useState(()=>({...EMPTY_FORM,...initialConfiguration}))
  const analyticsModel=HOUSES.find(({name})=>name===form.model)?.id||'unspecified'
  const hasConfiguration=Boolean(form.interior||form.exterior)

  useEffect(()=>{
    const applyConfiguration=(event)=>{
      const next=event.detail||{}
      setForm(current=>({...current,model:next.model||current.model,interior:next.interior||'',exterior:next.exterior||'',plot:next.plot||current.plot,source:normalizeLeadSource(next.source)}))
      setErrors(current=>({...current,model:undefined}))
    }
    window.addEventListener(CONFIGURATION_EVENT,applyConfiguration)
    return()=>window.removeEventListener(CONFIGURATION_EVENT,applyConfiguration)
  },[])

  useEffect(()=>{
    if(!headingRef.current)return
    const splitCleanup=[]
    const ctx=gsap.context(()=>{
      if(reducedMotion)return
      const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'})
      splitCleanup.push(()=>split.revert())
      gsap.set(split.words,{yPercent:110})
      ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.2,ease:'expo.out',stagger:.035})})
    },sectionRef)
    return()=>{ctx.revert();splitCleanup.forEach(cleanup=>cleanup())}
  },[reducedMotion])

  useEffect(()=>{if(status==='sent')successRef.current?.focus()},[status])

  useEffect(()=>{
    if(!sectionRef.current)return
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting)trackOnce(analyticsFunnelKey('contact-start',form.source,analyticsModel),'contact_start',{source:form.source,model:analyticsModel,placement:'contact',land_status:plotAnalyticsValue(form.plot),has_configuration:hasConfiguration})
    },{threshold:.15})
    observer.observe(sectionRef.current)
    return()=>observer.disconnect()
  },[analyticsModel,form.plot,form.source,hasConfiguration])

  const start=()=>{
    if(startedRef.current)return
    startedRef.current=true
    track('form_start',{form:'lead',source:form.source,model:analyticsModel,land_status:plotAnalyticsValue(form.plot),has_configuration:hasConfiguration})
  }

  const setField=(name,value)=>{
    start()
    setForm(current=>({...current,[name]:value}))
    setErrors(current=>({...current,[name]:undefined}))
    if(status==='error'||status==='invalid'){setStatus('idle');setError('')}
  }

  const change=(event)=>{
    const {name,type,checked,value}=event.target
    setField(name,type==='checkbox'?checked:value)
  }

  const submit=async(event)=>{
    event.preventDefault()
    if(sendingRef.current)return
    start()
    const nextErrors=validate(form)
    if(Object.keys(nextErrors).length){
      setErrors(nextErrors)
      setStatus('invalid')
      setError('Revisa los campos indicados antes de enviar la solicitud.')
      requestAnimationFrame(()=>document.querySelector(`[data-contact-field="${Object.keys(nextErrors)[0]}"]`)?.focus())
      return
    }

    sendingRef.current=true
    setStatus('sending')
    setError('')
    setErrors({})
    const controller=new AbortController()
    const timeout=setTimeout(()=>controller.abort(),12000)
    try{
      const payload={
        ...form,
        configuration:{model:form.model,interior:form.interior,exterior:form.exterior,source:form.source},
        attribution:getAttribution(),
        page:window.location.href,
        formStartedAt:startedAtRef.current,
        submissionId:submissionIdRef.current,
      }
      const response=await fetch(BRAND.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal})
      const data=await response.json().catch(()=>({}))
      if(!response.ok||!data.ok){
        if(data.fields)setErrors(data.fields)
        throw Object.assign(new Error(data.error||'request_failed'),{code:data.error})
      }
      setStatus('sent')
      if(data.accepted){
        const plotMap={'Ya tengo parcela':'owned','La estoy buscando':'searching','Aún no tengo':'not_yet','No sé si es apta':'unknown_fit'}
        track('generate_lead',{model:analyticsModel,source:form.source,has_configuration:hasConfiguration,land_status:plotMap[form.plot]||'unspecified'})
      }
    }catch(requestError){
      setStatus('error')
      setError(requestError.name==='AbortError'?'El envío está tardando demasiado. Tus datos siguen guardados; vuelve a intentarlo.':errorMessage(requestError.code))
    }finally{
      clearTimeout(timeout)
      sendingRef.current=false
    }
  }

  const selectedModel=HOUSES.find(({name})=>name===form.model)
  const hasSelection=Boolean(form.model||form.interior||form.exterior||form.plot)

  if(status==='sent')return <section ref={successRef} tabIndex={-1} role="status" aria-live="polite" id="contact" className="py-28 md:py-40 bg-navy-800 text-cream-200"><div className="max-w-[1100px] mx-auto px-6 md:px-12"><div className="w-12 h-12 rounded-full border border-gold-300 flex items-center justify-center text-gold-300 mb-8"><Check/></div><div className="section-label text-gold-300 mb-4">SOLICITUD RECIBIDA</div><h2 className="font-display text-display leading-[.95] tracking-tightest">Gracias, {form.name.split(' ')[0]||'nos ponemos en marcha'}.</h2><p className="mt-7 text-lg text-cream-200/65 max-w-xl">Revisaremos tu selección y la información que nos has facilitado para orientar el siguiente paso.</p></div></section>

  return <section id="contact" ref={sectionRef} className="relative py-24 md:py-40 bg-navy-800 text-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12"><div className="grid grid-cols-12 gap-4 md:gap-8 mb-12 md:mb-20"><div className="col-span-12 md:col-span-4"><div className="section-label text-cream-200/50"><span className="text-gold-300">07</span> / 07 — SIGUIENTE PASO</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[.95] tracking-tightest">Hablemos<br/><em className="italic text-gold-300 font-light">de tu proyecto.</em></h2><p className="mt-8 max-w-2xl text-cream-200/70 text-lg">Cuéntanos qué VORA te interesa y en qué punto estás. Si ya tienes parcela, podremos valorar su encaje inicial.</p></div></div>
    <div className="grid grid-cols-12 gap-8 md:gap-12"><form noValidate onSubmit={submit} aria-busy={status==='sending'} className="col-span-12 md:col-span-8 border-t border-cream-200/10">
      {hasSelection&&<SelectionSummary model={selectedModel} selection={form}/>} 
      <Field label="Nombre" name="name" autoComplete="name" value={form.name} onChange={change} error={errors.name} required/>
      <Field label="Teléfono" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={change} error={errors.phone} required/>
      <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={change} error={errors.email}/>
      <Field label="Provincia" name="province" autoComplete="address-level1" value={form.province} onChange={change} error={errors.province} required/>
      <Selector label="Situación del terreno" options={PLOT_OPTIONS} value={form.plot} onSelect={value=>{track('land_status_select',{land_status:plotAnalyticsValue(value),source:form.source,placement:'contact'});setField('plot',value)}}/>
      <Selector label="Modelo" options={HOUSES.map(h=>h.name)} value={form.model} prefix="VORA " onSelect={value=>setField('model',value)}/>
      <input type="text" name="website" value={form.website} onChange={change} className="hidden" tabIndex="-1" autoComplete="off" aria-hidden="true"/>
      <div className="mt-7">
        <label className="flex gap-3 text-sm text-cream-200/75 max-w-xl"><input data-contact-field="privacy" type="checkbox" name="privacy" checked={form.privacy} onChange={change} required aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy?'privacy-error':undefined} className="mt-1 accent-[#9A8978]"/><span>Acepto la <a href="/legal/privacidad" className="underline hover:text-cream-200">política de privacidad</a> y el tratamiento de mis datos para atender la solicitud.</span></label>
        {errors.privacy&&<p id="privacy-error" className="mt-2 text-sm text-red-200">{errors.privacy}</p>}
      </div>
      <div className="pt-8"><button disabled={status==='sending'} type="submit" className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gold-400 text-navy-900 font-medium text-sm uppercase tracking-widest hover:bg-cream-200 hover:text-navy-700 transition-colors disabled:cursor-wait disabled:opacity-60"><span>{status==='sending'?'Enviando…':'Enviar mi consulta'}</span><ArrowUpRight size={16}/></button></div>
      <div id="contact-status" role={status==='error'||status==='invalid'?'alert':'status'} aria-live={status==='error'||status==='invalid'?'assertive':'polite'} aria-atomic="true" className={error?'mt-5 max-w-xl border border-red-200/30 bg-red-950/20 p-4 text-sm text-red-100':'sr-only'}>{status==='sending'?'Enviando solicitud…':error}</div>
      {status==='error'&&<ContactFallback/>}
    </form><aside className="col-span-12 md:col-span-4 md:pl-10 border-t md:border-t-0 md:border-l border-cream-200/10 pt-8 md:pt-0"><div className="section-label text-gold-300 mb-4">VORA · CONCRETE LIVING</div><p className="font-display text-3xl md:text-4xl leading-tight">Empieza con la información que ya tienes.</p><p className="mt-6 text-cream-200/60 leading-relaxed">Partimos del modelo elegido y de tu situación actual. Si ya tienes parcela, se puede estudiar su adaptación técnica, urbanística y estructural.</p><div className="mt-10 pt-6 border-t border-cream-200/10 section-label text-cream-200/45">{BRAND.location}</div></aside></div>
  </div></section>
}

function SelectionSummary({model,selection}){
  const configuredSources=['configurator','model-collection','model-finder','seo-landing','seo-guide']
  const title=selection.source==='model-comparison'?'TU SELECCIÓN DEL COMPARADOR':configuredSources.includes(selection.source)?'TU SELECCIÓN DEL CONFIGURADOR':selection.source==='land-journey'?'TU PUNTO DE PARTIDA':'MODELO SELECCIONADO'
  return <section aria-labelledby="configuration-summary-title" className="my-7 border border-cream-200/15 bg-cream-200/[.04] p-5 md:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><div id="configuration-summary-title" className="section-label text-gold-300">{title}</div>{model&&<p className="mt-2 text-sm text-cream-200/60">{model.bedrooms} dormitorios · {model.bathrooms} baños</p>}</div>{selection.model&&<strong className="font-display text-3xl font-normal">VORA {selection.model}</strong>}</div>
    {(selection.interior||selection.exterior)&&<dl className="mt-5 grid gap-4 border-t border-cream-200/10 pt-5 sm:grid-cols-2">{selection.interior&&<div><dt className="section-label text-cream-200/50">AMBIENTE INTERIOR</dt><dd className="mt-2"><strong className="font-medium">{selection.interior}</strong><span className="mt-1 block text-sm text-cream-200/60">{optionDescription(INTERIORS,selection.interior)}</span></dd></div>}{selection.exterior&&<div><dt className="section-label text-cream-200/50">PAQUETE EXTERIOR</dt><dd className="mt-2"><strong className="font-medium">{selection.exterior}</strong><span className="mt-1 block text-sm text-cream-200/60">{optionDescription(EXTERIORS,selection.exterior)}</span></dd></div>}</dl>}
    {selection.plot&&<dl className="mt-5 border-t border-cream-200/10 pt-5"><div><dt className="section-label text-cream-200/50">SITUACIÓN DEL TERRENO</dt><dd className="mt-2 font-medium">{selection.plot}</dd></div></dl>}
  </section>
}

function Field({label,name,type='text',value,onChange,error,required,...inputProps}){
  const errorId=`${name}-error`
  return <div className="py-6 border-b border-cream-200/10 grid grid-cols-12 gap-4 items-start"><label htmlFor={name} className="col-span-12 md:col-span-4 section-label text-cream-200/50 pt-2">{label}{required&&<span className="text-gold-300"> *</span>}</label><div className="col-span-12 md:col-span-8"><input data-contact-field={name} id={name} name={name} type={type} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} maxLength={name==='email'?160:120} className="w-full bg-transparent text-cream-200 text-lg" {...inputProps}/>{error&&<p id={errorId} className="mt-2 text-sm text-red-200">{error}</p>}</div></div>
}

function Selector({label,options,value,onSelect,prefix=''}){
  return <div role="group" aria-label={label} className="py-6 border-b border-cream-200/10 grid grid-cols-12 gap-4 items-start"><div className="col-span-12 md:col-span-4 section-label text-cream-200/50 pt-2">{label}</div><div className="col-span-12 md:col-span-8 flex flex-wrap gap-2">{options.map(option=><button key={option} type="button" aria-pressed={value===option} onClick={()=>onSelect(option)} className={`min-h-11 px-4 py-2 rounded-full border text-sm transition-all ${value===option?'bg-gold-400 border-gold-400 text-navy-900':'border-cream-200/20 hover:border-gold-400/60'}`}>{prefix}{option}</button>)}</div></div>
}

function ContactFallback(){
  const channels=[
    BRAND.contact.email&&{href:`mailto:${BRAND.contact.email}`,label:BRAND.contact.email,Icon:Mail},
    BRAND.contact.phone&&{href:`tel:${BRAND.contact.phone.replace(/[^+\d]/g,'')}`,label:BRAND.contact.phone,Icon:Phone},
    BRAND.contact.whatsappUrl&&{href:BRAND.contact.whatsappUrl,label:'WhatsApp',Icon:MessageCircle},
  ].filter(Boolean)
  if(!channels.length)return null
  return <div className="mt-5 max-w-xl border-t border-cream-200/10 pt-5"><p className="text-sm text-cream-200/70">También puedes contactarnos por:</p><div className="mt-3 flex flex-wrap gap-3">{channels.map(({href,label,Icon})=><a key={href} href={href} className="inline-flex items-center gap-2 rounded-full border border-cream-200/20 px-4 py-2 text-sm hover:border-gold-300"><Icon size={15}/>{label}</a>)}</div></div>
}
