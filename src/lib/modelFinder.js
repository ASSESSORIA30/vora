import { HOUSES } from '../data/houses.js'

export function modelCapabilities(model) {
  const roomTypes = new Set(model.rooms.filter((room) => room.listed).map((room) => room.type))
  return {
    bedrooms: model.bedrooms,
    bathrooms: model.bathrooms,
    office: roomTypes.has('office'),
    dressingRoom: roomTypes.has('closet'),
    garage: model.features.some((feature) => /garaje/i.test(feature)),
    pool: model.features.some((feature) => /^piscina(?:\s*\+|$)/i.test(feature)),
  }
}

export function findCompatibleModels(criteria, houses = HOUSES, limit = 3) {
  const normalized = {
    bedrooms: Math.max(0, Number(criteria.bedrooms) || 0),
    bathrooms: Math.max(0, Number(criteria.bathrooms) || 0),
    office: Boolean(criteria.office),
    garage: Boolean(criteria.garage),
    pool: Boolean(criteria.pool),
  }
  return houses
    .filter((model) => {
      const capabilities = modelCapabilities(model)
      return capabilities.bedrooms >= normalized.bedrooms
        && capabilities.bathrooms >= normalized.bathrooms
        && (!normalized.office || capabilities.office)
        && (!normalized.garage || capabilities.garage)
        && (!normalized.pool || capabilities.pool)
    })
    .sort((a, b) => {
      const left = modelCapabilities(a)
      const right = modelCapabilities(b)
      const leftSurplus = (left.bedrooms - normalized.bedrooms) * 10 + (left.bathrooms - normalized.bathrooms) * 5
      const rightSurplus = (right.bedrooms - normalized.bedrooms) * 10 + (right.bathrooms - normalized.bathrooms) * 5
      return leftSurplus - rightSurplus || houses.indexOf(a) - houses.indexOf(b)
    })
    .slice(0, limit)
}
