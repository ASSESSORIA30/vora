import test from 'node:test'
import assert from 'node:assert/strict'
import { HOUSES } from '../src/data/houses.js'
import { findCompatibleModels, modelCapabilities } from '../src/lib/modelFinder.js'

test('capabilities derive only from canonical rooms and explicit features', () => {
  const vora150 = HOUSES.find(({ id }) => id === 'vora-150')
  const vora200 = HOUSES.find(({ id }) => id === 'vora-200')
  assert.equal(modelCapabilities(vora150).pool, false, 'prepared for a pool is not an included pool')
  assert.equal(modelCapabilities(vora200).pool, true)
  assert.equal(modelCapabilities(vora200).garage, true)
  assert.equal(modelCapabilities(vora200).office, true)
})

test('finder applies every selected criterion as a minimum or required feature', () => {
  const result = findCompatibleModels({ bedrooms: 4, bathrooms: 3, office: true, garage: false, pool: false })
  assert.deepEqual(result.map(({ id }) => id), ['vora-170', 'vora-200', 'vora-signature'])
})

test('finder returns the only confirmed model for the strictest criteria', () => {
  const result = findCompatibleModels({ bedrooms: 5, bathrooms: 4, office: true, garage: true, pool: true })
  assert.deepEqual(result.map(({ id }) => id), ['vora-signature'])
})

test('finder never returns more than three models and orders by closest capacity', () => {
  const result = findCompatibleModels({ bedrooms: 3, bathrooms: 2 })
  assert.deepEqual(result.map(({ id }) => id), ['vora-90', 'vora-110', 'vora-130'])
})
