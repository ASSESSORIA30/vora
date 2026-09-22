export class LeadDeliveryError extends Error{
  constructor(code,details={}){
    super(code)
    this.name='LeadDeliveryError'
    this.code=code
    this.details=details
  }
}

export function requiredResendVariables(env=process.env){
  return [!env.RESEND_API_KEY&&'RESEND_API_KEY',!env.LEADS_EMAIL&&'LEADS_EMAIL',!env.RESEND_FROM_EMAIL&&'RESEND_FROM_EMAIL'].filter(Boolean)
}

export async function sendLeadWithResend(record,{env=process.env,signal,fetchImpl=fetch}={}){
  const rows=[
    ['Lead ID',record.id],['Fecha',record.timestamp],['Nombre',record.contact.name],['Teléfono',record.contact.phone],['Email',record.contact.email||'—'],['Provincia',record.contact.province],
    ['Parcela',record.land_status||'—'],['Modelo',record.model||'—'],['Interior',record.configuration.interior||'—'],['Exterior',record.configuration.exterior||'—'],['Origen',record.source],
    ['Página origen',record.page_origin||'—'],['Ruta',record.page_path||'—'],['UTM source',record.utm.source||'—'],['UTM medium',record.utm.medium||'—'],['UTM campaign',record.utm.campaign||'—'],['UTM term',record.utm.term||'—'],
    ['gclid',record.attribution.gclid||'—'],['Landing inicial',record.attribution.landing_page||'—'],['Referente',record.attribution.referrer_host||'—'],
  ]
  const html=`<h2>Nuevo lead VORA</h2><table>${rows.map(([key,value])=>`<tr><td style="padding:6px 12px 6px 0"><strong>${escapeHtml(key)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}</table>`
  let response
  try{
    response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.RESEND_FROM_EMAIL,to:[env.LEADS_EMAIL],reply_to:record.contact.email||undefined,subject:`Nuevo lead VORA${record.model?` · ${record.model}`:''}`,html}),signal})
  }catch(error){
    throw new LeadDeliveryError('email_provider_unavailable',{name:error?.name||'Error'})
  }
  if(!response.ok){
    const provider=await response.json().catch(()=>({}))
    throw new LeadDeliveryError('email_provider_error',{status:response.status,providerCode:cleanCode(provider.name||provider.code)})
  }
  return {delivered:true,provider:'resend'}
}

const cleanCode=(value)=>String(value||'unknown').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80)||'unknown'
const escapeHtml=(value)=>String(value).replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]))
