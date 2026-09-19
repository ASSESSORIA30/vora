const clean = (value, max=500) => String(value || '').trim().slice(0,max)
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'})
  const body=req.body||{}; if(body.website) return res.status(200).json({ok:true})
  const name=clean(body.name,120), phone=clean(body.phone,80), province=clean(body.province,120), email=clean(body.email,160)
  if(!name||!phone||!province||body.privacy!==true) return res.status(400).json({error:'invalid_request'})
  const apiKey=process.env.RESEND_API_KEY, to=process.env.LEADS_EMAIL, from=process.env.RESEND_FROM_EMAIL
  if(!apiKey||!to||!from) return res.status(503).json({error:'lead_channel_not_configured'})
  const attr=body.attribution||{}
  const rows=[['Nombre',name],['Teléfono',phone],['Email',email||'—'],['Provincia',province],['Parcela',clean(body.plot,80)||'—'],['Modelo',clean(body.model,80)||'—'],['Interior',clean(body.interior,80)||'—'],['Exterior',clean(body.exterior,80)||'—'],['Página',clean(body.page,500)||'—'],['UTM source',clean(attr.utm_source,120)||'—'],['UTM medium',clean(attr.utm_medium,120)||'—'],['UTM campaign',clean(attr.utm_campaign,180)||'—'],['UTM term',clean(attr.utm_term,180)||'—'],['gclid',clean(attr.gclid,250)||'—']]
  const html=`<h2>Nuevo lead VORA</h2><table>${rows.map(([k,v])=>`<tr><td style="padding:6px 12px 6px 0"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>`
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email||undefined,subject:`Nuevo lead VORA${body.model?` · ${clean(body.model,80)}`:''}`,html})})
  if(!r.ok) return res.status(502).json({error:'email_provider_error'})
  return res.status(200).json({ok:true})
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
