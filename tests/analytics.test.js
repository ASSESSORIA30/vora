import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { captureAttribution, resetAnalyticsStateForTests, sanitizeAnalyticsParams, track, trackOnce } from '../src/lib/analytics.js'

function browser({ consent = 'analytics', path = '/', search = '', width = 390 } = {}) {
  const values = new Map([['vora_consent', consent]])
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  const calls = []
  globalThis.window = {
    innerWidth: width,
    location: { pathname: path, search },
    gtag: (...args) => calls.push(args),
  }
  globalThis.document = { referrer: 'https://example.org/reference?private=value' }
  return { calls, values }
}

afterEach(() => {
  resetAnalyticsStateForTests()
  delete globalThis.window
  delete globalThis.document
  delete globalThis.localStorage
})

test('analytics requires consent and an available destination', () => {
  const { calls } = browser({ consent: 'necessary' })
  assert.equal(track('model_view', { model: 'vora-130' }), false)
  assert.equal(calls.length, 0)
})

test('event parameters are allowlisted and enriched without personal data', () => {
  const { calls } = browser({ path: '/modelos/vora-130', width: 390 })
  assert.equal(track('generate_lead', {
    model: 'vora-130',
    source: 'model_page',
    land_status: 'owned',
    has_configuration: true,
    name: 'Personal name',
    email: 'person@example.com',
    phone: '+34 600 000 000',
    message: 'Private free text',
  }), true)
  assert.deepEqual(calls[0], ['event', 'generate_lead', {
    page_type: 'model_detail',
    page_path: '/modelos/vora-130',
    device_context: 'mobile',
    model: 'vora-130',
    source: 'model_page',
    land_status: 'owned',
    has_configuration: true,
  }])
})

test('trackOnce prevents duplicate funnel events', () => {
  const { calls } = browser()
  assert.equal(trackOnce('configurator:model', 'configurator_start', { model: 'vora-110' }), true)
  assert.equal(trackOnce('configurator:model', 'configurator_start', { model: 'vora-110' }), false)
  assert.equal(calls.length, 1)
})

test('attribution preserves the first landing and stores only the referrer host', () => {
  const { values } = browser({ path: '/casas-modulares-premium', search: '?utm_source=search&utm_campaign=vora' })
  const first = captureAttribution()
  assert.equal(first.landing_page, '/casas-modulares-premium')
  assert.equal(first.referrer_host, 'example.org')
  assert.equal(first.utm_source, 'search')
  window.location.pathname = '/modelos/vora-150'
  window.location.search = ''
  const second = captureAttribution()
  assert.equal(second.landing_page, '/casas-modulares-premium')
  assert.equal(JSON.parse(values.get('vora_attribution')).landing_page, '/casas-modulares-premium')
})

test('unknown event parameters are discarded by default', () => {
  browser({ path: '/' })
  assert.deepEqual(sanitizeAnalyticsParams('unknown_event', { arbitrary: 'value', email: 'a@b.test' }), {
    page_type: 'home',
    page_path: '/',
    device_context: 'mobile',
  })
})
