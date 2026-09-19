const ATTR_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid']

export function captureAttribution(){
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const found = {}
  ATTR_KEYS.forEach((key)=>{ const value=params.get(key); if(value) found[key]=value })
  if(Object.keys(found).length){
    try { localStorage.setItem('vora_attribution', JSON.stringify({...getAttribution(),...found,landing_page:window.location.pathname,first_seen:new Date().toISOString()})) } catch {}
  }
  return getAttribution()
}

export function getAttribution(){
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('vora_attribution') || '{}') } catch { return {} }
}

export function track(event, params={}){
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({event, ...params})
  if (typeof window.fbq === 'function') {
    const map = { generate_lead:'Lead', view_model:'ViewContent', select_model:'ViewContent' }
    if (map[event]) window.fbq('track', map[event], params)
  }
}
