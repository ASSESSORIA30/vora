import test from 'node:test'
import assert from 'node:assert/strict'
import { HOUSES, getListedRooms, getPlanRooms } from '../src/data/houses.js'
import { validateHouse, validateHouses } from '../src/data/validateHouses.js'

const byId = new Map(HOUSES.map((house) => [house.id, house]))

test('house data has valid canonical room and plan references', () => {
  const result = validateHouses(HOUSES)
  assert.equal(result.valid, true, result.errors.join('\n'))
  assert.equal(HOUSES.length, 7)
})

test('legacy surface aliases are derived from the canonical surface object', () => {
  for (const house of HOUSES) {
    assert.equal(house.usableSurface, house.surfaces.useful)
    assert.equal(house.porchSurface, house.surfaces.porch)
    assert.equal(house.surfaces.built, null)
    assert.equal(house.surfaces.garage, null)
    assert.equal(house.surfaces.terrace, null)
    assert.equal(house.surfaces.pool, null)
  }
})

test('plan labels and areas resolve from canonical rooms', () => {
  for (const house of HOUSES) {
    const canonical = new Map(house.rooms.map((room) => [room.id, room]))
    for (const room of getPlanRooms(house)) {
      assert.equal(room.area, canonical.get(room.roomId).area)
      assert.equal(room.name, canonical.get(room.roomId).planLabel || canonical.get(room.roomId).name)
    }
    assert.ok(getListedRooms(house).every((room) => room.listed))
  }
})

test('validator rejects broken ids, duplicate references and invalid areas', () => {
  const unknownReference = structuredClone(byId.get('vora-90'))
  unknownReference.plan.rooms[0].roomId = 'missing-room'
  assert.ok(validateHouse(unknownReference).errors.includes('unknown plan roomId: missing-room'))

  const duplicateRoom = structuredClone(byId.get('vora-90'))
  duplicateRoom.rooms.push({ ...duplicateRoom.rooms[0] })
  assert.ok(validateHouse(duplicateRoom).errors.includes(`duplicate room id: ${duplicateRoom.rooms[0].id}`))

  const duplicatePlanReference = structuredClone(byId.get('vora-90'))
  duplicatePlanReference.plan.rooms.push({ ...duplicatePlanReference.plan.rooms[0] })
  assert.ok(validateHouse(duplicatePlanReference).errors.includes(`duplicate plan roomId: ${duplicatePlanReference.plan.rooms[0].roomId}`))

  const invalidArea = structuredClone(byId.get('vora-90'))
  invalidArea.rooms[0].area = Number.NaN
  assert.match(validateHouse(invalidArea).errors.join('\n'), /invalid area for room/)
})

test('current discrepancies and validation statuses stay explicit', () => {
  const result = validateHouses(HOUSES)
  const reports = new Map(result.models.map((model) => [model.id, model]))

  for (const id of ['vora-90', 'vora-130', 'vora-150']) {
    assert.equal(byId.get(id).validationStatus, 'verified')
    assert.deepEqual(reports.get(id).discrepancies, [])
  }

  const expected = {
    'vora-110': ['plan_sum_useful_mismatch', 'room_sum_plan_sum_mismatch'],
    'vora-170': ['room_sum_useful_mismatch', 'plan_sum_useful_mismatch'],
    'vora-200': ['plan_sum_useful_mismatch', 'room_sum_plan_sum_mismatch'],
    'vora-signature': ['room_sum_useful_mismatch', 'plan_sum_useful_mismatch', 'room_sum_plan_sum_mismatch'],
  }
  for (const [id, codes] of Object.entries(expected)) {
    assert.equal(byId.get(id).validationStatus, 'pending')
    assert.deepEqual(reports.get(id).discrepancies.map((item) => item.code), codes)
  }
})
