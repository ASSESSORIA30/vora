const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid']
const GLOBAL_PARAMETERS = new Set(['page_type', 'page_path', 'device_context'])
const EVENT_PARAMETERS = {
  model_view: ['model', 'source', 'placement'],
  select_model: ['model', 'source', 'placement'],
  model_comparison_view: ['models_shown'],
  model_comparison_select: ['action', 'model', 'bedrooms'],
  configurator_start: ['model', 'source', 'placement'],
  configurator_change: ['field', 'value', 'model'],
  configurator_complete: ['model', 'source', 'interior', 'exterior', 'has_configuration'],
  configurator_share: ['model', 'source', 'method'],
  contact_start: ['model', 'source', 'placement', 'land_status', 'has_configuration'],
  contact_cta_click: ['cta', 'model', 'source', 'placement', 'land_status', 'has_configuration'],
  form_start: ['form', 'model', 'source', 'land_status', 'has_configuration'],
  generate_lead: ['model', 'source', 'land_status', 'has_configuration'],
  land_status_select: ['land_status', 'source', 'placement'],
  faq_open: ['faq_id', 'topic', 'placement'],
  process_view: ['steps'],
  plan_expand: ['model', 'view'],
  cta_click: ['cta', 'model', 'source', 'placement', 'landing_slug'],
  model_finder_start: ['source'],
  model_finder_complete: ['result_count', 'bedrooms', 'bathrooms', 'office', 'garage', 'pool'],
  model_finder_result_click: ['model', 'action'],
}
const sentOnce = new Set()

function pageType(pathname = '/') {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/modelos/')) return 'model_detail'
  if (pathname.startsWith('/legal/')) return 'legal'
  if (pathname.startsWith('/guias/')) return 'guide'
  if (pathname.startsWith('/zonas/')) return 'local_landing'
  if (/^\/casas-/.test(pathname)) return 'search_landing'
  return 'not_found'
}

function deviceContext(width = 1280) {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function cleanValue(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value !== 'string') return undefined
  const cleaned = value.trim().slice(0, 100)
  return cleaned || undefined
}

export function analyticsContext() {
  if (typeof window === 'undefined') return { page_type: 'server', page_path: '/', device_context: 'desktop' }
  return {
    page_type: pageType(window.location.pathname),
    page_path: window.location.pathname,
    device_context: deviceContext(window.innerWidth),
  }
}

export function sanitizeAnalyticsParams(event, params = {}) {
  const allowed = new Set([...(EVENT_PARAMETERS[event] || []), ...GLOBAL_PARAMETERS])
  return Object.fromEntries(
    Object.entries({ ...analyticsContext(), ...params })
      .filter(([key]) => allowed.has(key))
      .map(([key, value]) => [key, cleanValue(value)])
      .filter(([, value]) => value !== undefined),
  )
}

export function captureAttribution() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const found = {}
  ATTR_KEYS.forEach((key) => {
    const value = params.get(key)
    if (value) found[key] = value.slice(0, 160)
  })
  const existing = getAttribution()
  let referrerHost = existing.referrer_host || ''
  if (!referrerHost && typeof document !== 'undefined' && document.referrer) {
    try { referrerHost = new URL(document.referrer).hostname.slice(0, 160) } catch {}
  }
  const attribution = {
    landing_page: existing.landing_page || window.location.pathname,
    first_seen: existing.first_seen || new Date().toISOString(),
    ...(referrerHost ? { referrer_host: referrerHost } : {}),
    ...existing,
    ...found,
  }
  try { localStorage.setItem('vora_attribution', JSON.stringify(attribution)) } catch {}
  return attribution
}

export function getAttribution() {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('vora_attribution') || '{}') } catch { return {} }
}

export function track(event, params = {}) {
  if (typeof window === 'undefined') return false
  try { if (localStorage.getItem('vora_consent') !== 'analytics') return false } catch { return false }
  const safeParams = sanitizeAnalyticsParams(event, params)
  let sent = false
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, safeParams)
    sent = true
  }
  if (typeof window.fbq === 'function') {
    const map = { generate_lead: 'Lead', model_view: 'ViewContent', select_model: 'ViewContent' }
    if (map[event]) {
      window.fbq('track', map[event], safeParams)
      sent = true
    }
  }
  return sent
}

export function trackOnce(key, event, params = {}) {
  if (sentOnce.has(key)) return false
  const sent = track(event, params)
  if (sent) sentOnce.add(key)
  return sent
}

export function analyticsFunnelKey(event, source = 'direct', model = 'unspecified') {
  return `${event}:${source || 'direct'}:${model || 'unspecified'}`
}

export function resetAnalyticsStateForTests() {
  sentOnce.clear()
}
