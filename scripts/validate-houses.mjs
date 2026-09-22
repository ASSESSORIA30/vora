import { HOUSES } from '../src/data/houses.js'
import { validateHouses } from '../src/data/validateHouses.js'

const result = validateHouses(HOUSES)

console.log('Model            Status    Useful   Rooms    Plan     Discrepancies')
for (const model of result.models) {
  const discrepancyCodes = model.discrepancies.map((item) => item.code).join(', ') || 'none'
  console.log([
    model.name.padEnd(16),
    model.status.padEnd(9),
    String(model.sums.useful).padEnd(8),
    String(model.sums.rooms).padEnd(8),
    String(model.sums.plan).padEnd(8),
    discrepancyCodes,
  ].join(' '))
}

if (!result.valid) {
  console.error('\nStructural validation errors:')
  for (const error of result.errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('\nStructural validation passed. Known surface discrepancies are reported and preserved.')
}
