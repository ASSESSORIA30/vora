import { getListedRooms } from './houses.js'

const SURFACE_KEYS = ['built', 'useful', 'porch', 'garage', 'terrace', 'pool']
const round = (value) => Math.round((value + Number.EPSILON) * 10) / 10
const differs = (left, right) => Math.abs(left - right) > 0.01
const validArea = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0

export function validateHouse(house) {
  const errors = []
  const discrepancies = []
  const roomIds = new Set()

  if (!['verified', 'pending'].includes(house.validationStatus)) {
    errors.push(`invalid validationStatus: ${house.validationStatus}`)
  }

  for (const key of SURFACE_KEYS) {
    const value = house.surfaces?.[key]
    if (value !== null && !validArea(value)) errors.push(`invalid surfaces.${key}: ${value}`)
  }

  for (const room of house.rooms) {
    if (!room.id || typeof room.id !== 'string') errors.push('room without a stable id')
    else if (roomIds.has(room.id)) errors.push(`duplicate room id: ${room.id}`)
    else roomIds.add(room.id)
    if (!validArea(room.area)) errors.push(`invalid area for room ${room.id || room.name}: ${room.area}`)
  }

  const planRoomIds = new Set()
  let planSum = 0
  for (const planRoom of house.plan.rooms) {
    if (planRoomIds.has(planRoom.roomId)) errors.push(`duplicate plan roomId: ${planRoom.roomId}`)
    planRoomIds.add(planRoom.roomId)
    const room = house.rooms.find((candidate) => candidate.id === planRoom.roomId)
    if (!room) errors.push(`unknown plan roomId: ${planRoom.roomId}`)
    else if (validArea(room.area)) planSum += room.area
  }

  const listedRooms = getListedRooms(house)
  const roomSum = listedRooms.reduce((sum, room) => sum + (validArea(room.area) ? room.area : 0), 0)
  const useful = house.surfaces?.useful
  const sums = {
    useful,
    rooms: round(roomSum),
    plan: round(planSum),
  }

  if (validArea(useful) && differs(roomSum, useful)) {
    discrepancies.push({
      code: 'room_sum_useful_mismatch',
      expected: useful,
      actual: round(roomSum),
      difference: round(roomSum - useful),
    })
  }
  if (validArea(useful) && differs(planSum, useful)) {
    discrepancies.push({
      code: 'plan_sum_useful_mismatch',
      expected: useful,
      actual: round(planSum),
      difference: round(planSum - useful),
    })
  }
  if (differs(roomSum, planSum)) {
    discrepancies.push({
      code: 'room_sum_plan_sum_mismatch',
      expected: round(roomSum),
      actual: round(planSum),
      difference: round(planSum - roomSum),
    })
  }

  const expectedStatus = discrepancies.length === 0 ? 'verified' : 'pending'
  if (house.validationStatus !== expectedStatus) {
    errors.push(`validationStatus should be ${expectedStatus}, received ${house.validationStatus}`)
  }

  return {
    id: house.id,
    name: `VORA ${house.name}`,
    status: house.validationStatus,
    sums,
    discrepancies,
    errors,
    valid: errors.length === 0,
  }
}

export function validateHouses(houses) {
  const models = houses.map(validateHouse)
  return {
    valid: models.every((model) => model.valid),
    models,
    errors: models.flatMap((model) => model.errors.map((error) => `${model.id}: ${error}`)),
  }
}
