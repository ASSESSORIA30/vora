export const INTERIORS = [
  { id: 'PURE', desc: 'Roble claro · piedra beige · lino' },
  { id: 'EARTH', desc: 'Nogal · piedra cálida · arena' },
  { id: 'GRAPHITE', desc: 'Nogal oscuro · gris mineral · negro' },
]

export const EXTERIORS = [
  { id: 'Essential', desc: 'Arquitectura + porche' },
  { id: 'Terrace', desc: 'Terraza exterior ampliada' },
  { id: 'Pool', desc: 'Piscina integrada donde el modelo lo permite' },
]

export const CONFIGURATION_EVENT = 'vora:configuration-selected'

export const PLOT_OPTIONS = ['Ya tengo parcela', 'La estoy buscando', 'Aún no tengo', 'No sé si es apta']

export const LEAD_SOURCES = ['contact', 'configurator', 'model_page', 'model-comparison', 'model-collection', 'model-finder', 'seo-landing', 'seo-guide', 'land-journey']

export function normalizeLeadSource(source) {
  return LEAD_SOURCES.includes(source) ? source : 'contact'
}

export function readConfiguration(search = typeof window === 'undefined' ? '' : window.location.search) {
  const params = new URLSearchParams(search)
  const source = params.get('source')
  return {
    model: params.get('model') || '',
    interior: INTERIORS.some(({ id }) => id === params.get('interior')) ? params.get('interior') : '',
    exterior: EXTERIORS.some(({ id }) => id === params.get('exterior')) ? params.get('exterior') : '',
    plot: PLOT_OPTIONS.includes(params.get('plot')) ? params.get('plot') : '',
    source: source ? normalizeLeadSource(source) : '',
  }
}

export function navigateToJourneySection({ target, model = '', source, interior = '', exterior = '', plot = '', reducedMotion = false }) {
  if (typeof window === 'undefined') return
  const selection = { model, interior, exterior, plot, source: normalizeLeadSource(source), target }
  const url = new URL(window.location.href)
  if (model) url.searchParams.set('model', model)
  else url.searchParams.delete('model')
  if (interior) url.searchParams.set('interior', interior)
  else url.searchParams.delete('interior')
  if (exterior) url.searchParams.set('exterior', exterior)
  else url.searchParams.delete('exterior')
  if (plot) url.searchParams.set('plot', plot)
  else url.searchParams.delete('plot')
  url.searchParams.set('source', selection.source)
  url.hash = target
  window.history.pushState({ voraConfiguration: selection }, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent(CONFIGURATION_EVENT, { detail: selection }))
  document.getElementById(target)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

export function configurationUrl({ model = '', source = 'configurator', interior = '', exterior = '', plot = '' }, href = typeof window === 'undefined' ? 'https://vora.invalid/' : window.location.href) {
  const url = new URL(href)
  if (model) url.searchParams.set('model', model)
  else url.searchParams.delete('model')
  if (interior && INTERIORS.some(({ id }) => id === interior)) url.searchParams.set('interior', interior)
  else url.searchParams.delete('interior')
  if (exterior && EXTERIORS.some(({ id }) => id === exterior)) url.searchParams.set('exterior', exterior)
  else url.searchParams.delete('exterior')
  if (plot && PLOT_OPTIONS.includes(plot)) url.searchParams.set('plot', plot)
  else url.searchParams.delete('plot')
  url.searchParams.set('source', normalizeLeadSource(source))
  url.hash = 'configurator'
  return url
}

export function replaceConfigurationInUrl(configuration) {
  if (typeof window === 'undefined') return ''
  const url = configurationUrl(configuration)
  window.history.replaceState({ voraConfiguration: configuration }, '', `${url.pathname}${url.search}${url.hash}`)
  return url.toString()
}

export function optionDescription(options, id) {
  return options.find((option) => option.id === id)?.desc || ''
}
