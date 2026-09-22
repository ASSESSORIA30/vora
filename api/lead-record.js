import { randomUUID } from 'node:crypto'

function pageParts(value){
  if(!value)return {origin:'',path:''}
  try{
    const url=new URL(value)
    return {origin:url.origin,path:`${url.pathname}${url.hash}`}
  }catch{return {origin:'',path:''}}
}

export function buildLeadRecord(lead,{now=new Date(),idFactory=randomUUID}={}){
  const timestamp=now.toISOString()
  const page=pageParts(lead.page)
  return {
    id:lead.submissionId||idFactory(),
    timestamp,
    source:lead.source,
    utm:{
      source:lead.attribution.utm_source,
      medium:lead.attribution.utm_medium,
      campaign:lead.attribution.utm_campaign,
      term:lead.attribution.utm_term,
      content:lead.attribution.utm_content,
    },
    attribution:{
      gclid:lead.attribution.gclid,
      gbraid:lead.attribution.gbraid,
      wbraid:lead.attribution.wbraid,
      fbclid:lead.attribution.fbclid,
      landing_page:lead.attribution.landing_page,
      referrer_host:lead.attribution.referrer_host,
      first_seen:lead.attribution.first_seen,
    },
    model:lead.model,
    configuration:{model:lead.model,interior:lead.interior,exterior:lead.exterior},
    land_status:lead.plot,
    page_origin:page.origin,
    page_path:page.path,
    contact:{name:lead.name,phone:lead.phone,email:lead.email,province:lead.province},
    consent:{privacy:lead.privacy,captured_at:timestamp},
  }
}
