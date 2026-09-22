import { HOUSES } from '../src/data/houses.js'
import { EXTERIORS, INTERIORS, LEAD_SOURCES, PLOT_OPTIONS } from '../src/lib/configuration.js'
import { buildLeadRecord } from './lead-record.js'
import { deliverLeadToCrm } from './integrations/crm.js'
import { requiredResendVariables, sendLeadWithResend } from './integrations/resend.js'

const MAX_BODY_BYTES=16_384
const RATE_LIMIT_WINDOW=10*60*1000
const RATE_LIMIT_MAX=6
const SUBMISSION_TTL=30*60*1000
const MIN_FORM_TIME=1_200
const VALID_PLOT_OPTIONS=new Set(['',...PLOT_OPTIONS])
const MODEL_OPTIONS=new Set(['',...HOUSES.map(({name})=>name)])
const INTERIOR_OPTIONS=new Set(['',...INTERIORS.map(({id})=>id)])
const EXTERIOR_OPTIONS=new Set(['',...EXTERIORS.map(({id})=>id)])
const SOURCE_OPTIONS=new Set(LEAD_SOURCES)
const state=globalThis.__voraContactState||(globalThis.__voraContactState={rates:new Map(),submissions:new Map()})

const clean=(value,max=500)=>String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').replace(/\s+/g,' ').trim().slice(0,max)
const validEmail=(value)=>!value||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const validPhone=(value)=>/^[+\d\s().-]+$/.test(value)&&value.replace(/\D/g,'').length>=7&&value.replace(/\D/g,'').length<=15
const validSubmissionId=(value)=>!value||/^[a-zA-Z0-9-]{8,100}$/.test(value)

function parseBody(req){
  if(req.body&&typeof req.body==='object')return req.body
  if(typeof req.body==='string')return JSON.parse(req.body)
  return {}
}

function clientKey(req){
  const forwarded=req.headers?.['x-forwarded-for']
  return clean(Array.isArray(forwarded)?forwarded[0]:String(forwarded||'').split(',')[0]||req.socket?.remoteAddress||'unknown',100)
}

function prune(now){
  for(const [key,entry] of state.rates)if(now-entry.startedAt>RATE_LIMIT_WINDOW)state.rates.delete(key)
  for(const [key,entry] of state.submissions)if(now-entry.updatedAt>SUBMISSION_TTL)state.submissions.delete(key)
}

function rateLimited(req,now){
  const key=clientKey(req)
  const current=state.rates.get(key)
  if(!current){state.rates.set(key,{count:1,startedAt:now});return false}
  current.count+=1
  return current.count>RATE_LIMIT_MAX
}

function normalize(body){
  const configuration=body.configuration&&typeof body.configuration==='object'?body.configuration:{}
  const attribution=body.attribution&&typeof body.attribution==='object'?body.attribution:{}
  return {
    name:clean(body.name,120),
    phone:clean(body.phone,80),
    email:clean(body.email,160),
    province:clean(body.province,120),
    plot:clean(body.plot,80),
    model:clean(configuration.model??body.model,80),
    interior:clean(configuration.interior??body.interior,80),
    exterior:clean(configuration.exterior??body.exterior,80),
    source:clean(configuration.source??body.source,40)||'contact',
    page:clean(body.page,500),
    privacy:body.privacy===true,
    website:clean(body.website,200),
    formStartedAt:Number(body.formStartedAt)||0,
    submissionId:clean(body.submissionId,100),
    attribution:Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','landing_page','referrer_host','first_seen'].map(key=>[key,clean(attribution[key],key==='landing_page'?500:250)])),
  }
}

function validate(lead){
  const fields={}
  if(lead.name.length<2)fields.name='Escribe tu nombre.'
  if(!validPhone(lead.phone))fields.phone='Escribe un teléfono válido.'
  if(!validEmail(lead.email))fields.email='Revisa el formato del email.'
  if(lead.province.length<2)fields.province='Escribe una provincia.'
  if(!lead.privacy)fields.privacy='Debes aceptar la política de privacidad.'
  if(!VALID_PLOT_OPTIONS.has(lead.plot))fields.plot='invalid_selection'
  if(!MODEL_OPTIONS.has(lead.model))fields.model='invalid_selection'
  if(!INTERIOR_OPTIONS.has(lead.interior))fields.interior='invalid_selection'
  if(!EXTERIOR_OPTIONS.has(lead.exterior))fields.exterior='invalid_selection'
  if(!SOURCE_OPTIONS.has(lead.source))fields.source='invalid_source'
  if(lead.source==='configurator'&&(!lead.model||!lead.interior||!lead.exterior))fields.configuration='incomplete_configuration'
  if(lead.exterior==='Pool'&&lead.model!=='Signature'&&Number(lead.model)<130)fields.exterior='invalid_selection'
  if(!validSubmissionId(lead.submissionId))fields.submissionId='invalid_submission_id'
  if(lead.page){try{const url=new URL(lead.page);if(!['http:','https:'].includes(url.protocol))fields.page='invalid_url'}catch{fields.page='invalid_url'}}
  return fields
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0')
  res.setHeader('X-Content-Type-Options','nosniff')
  if(req.method!=='POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ok:false,error:'method_not_allowed'})
  }
  if(!String(req.headers?.['content-type']||'').toLowerCase().includes('application/json'))return res.status(415).json({ok:false,error:'unsupported_media_type'})
  const declaredSize=Number(req.headers?.['content-length'])||0
  if(declaredSize>MAX_BODY_BYTES)return res.status(413).json({ok:false,error:'payload_too_large'})

  let body
  try{body=parseBody(req)}catch{return res.status(400).json({ok:false,error:'invalid_json'})}
  try{if(Buffer.byteLength(JSON.stringify(body),'utf8')>MAX_BODY_BYTES)return res.status(413).json({ok:false,error:'payload_too_large'})}catch{return res.status(400).json({ok:false,error:'invalid_json'})}
  const lead=normalize(body)
  if(lead.website)return res.status(200).json({ok:true,accepted:false})

  const now=Date.now()
  if(lead.formStartedAt&&(lead.formStartedAt>now+60_000||now-lead.formStartedAt<MIN_FORM_TIME))return res.status(200).json({ok:true,accepted:false})
  prune(now)
  if(rateLimited(req,now)){
    res.setHeader('Retry-After',String(Math.ceil(RATE_LIMIT_WINDOW/1000)))
    return res.status(429).json({ok:false,error:'rate_limited'})
  }

  const fields=validate(lead)
  if(Object.keys(fields).length)return res.status(400).json({ok:false,error:'invalid_request',fields})

  if(lead.submissionId){
    const previous=state.submissions.get(lead.submissionId)
    if(previous?.status==='sent')return res.status(200).json({ok:true,accepted:false,duplicate:true})
    if(previous?.status==='pending')return res.status(409).json({ok:false,error:'duplicate_submission'})
    state.submissions.set(lead.submissionId,{status:'pending',updatedAt:now})
  }

  const missing=requiredResendVariables()
  if(missing.length){
    if(lead.submissionId)state.submissions.delete(lead.submissionId)
    return res.status(503).json({ok:false,error:'lead_channel_not_configured',required:missing})
  }

  const record=buildLeadRecord(lead,{now:new Date(now)})
  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),10_000)
  try{
    await sendLeadWithResend(record,{signal:controller.signal})
    try{
      const crm=await deliverLeadToCrm(record)
      if(crm.configured&&!crm.delivered)console.error('VORA CRM delivery failed',{provider:crm.provider||'unknown'})
    }catch(error){
      console.error('VORA CRM adapter unavailable',{name:error?.name||'Error'})
    }
    if(lead.submissionId)state.submissions.set(lead.submissionId,{status:'sent',updatedAt:Date.now()})
    return res.status(200).json({ok:true,accepted:true})
  }catch(error){
    const code=error?.code==='email_provider_error'?'email_provider_error':'email_provider_unavailable'
    console.error('VORA contact provider failure',{code,status:error?.details?.status,name:error?.details?.name})
    if(lead.submissionId)state.submissions.delete(lead.submissionId)
    return res.status(502).json({ok:false,error:code})
  }finally{
    clearTimeout(timeout)
  }
}
