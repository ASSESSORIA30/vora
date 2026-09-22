import test from 'node:test'
import assert from 'node:assert/strict'
import { configurationUrl, readConfiguration } from '../src/lib/configuration.js'

test('configuration URL preserves attribution and contains only valid choices',()=>{
  const url=configurationUrl({model:'170',interior:'GRAPHITE',exterior:'Pool',source:'model-finder'},'https://example.test/?utm_source=guide#models')
  assert.equal(url.pathname,'/')
  assert.equal(url.searchParams.get('utm_source'),'guide')
  assert.equal(url.searchParams.get('model'),'170')
  assert.equal(url.searchParams.get('interior'),'GRAPHITE')
  assert.equal(url.searchParams.get('exterior'),'Pool')
  assert.equal(url.searchParams.get('source'),'model-finder')
  assert.equal(url.hash,'#configurator')
})

test('configuration URL discards unknown options and normalizes its source',()=>{
  const url=configurationUrl({model:'130',interior:'invented',exterior:'invented',source:'unknown'},'https://example.test/modelos/vora-130')
  assert.equal(url.searchParams.has('interior'),false)
  assert.equal(url.searchParams.has('exterior'),false)
  assert.equal(url.searchParams.get('source'),'contact')
})

test('shared configuration can be read back without personal fields',()=>{
  const url=configurationUrl({model:'Signature',interior:'PURE',exterior:'Essential',source:'configurator'},'https://example.test/')
  assert.deepEqual(readConfiguration(url.search),{model:'Signature',interior:'PURE',exterior:'Essential',plot:'',source:'configurator'})
  assert.equal(url.searchParams.has('name'),false)
  assert.equal(url.searchParams.has('email'),false)
  assert.equal(url.searchParams.has('phone'),false)
})
