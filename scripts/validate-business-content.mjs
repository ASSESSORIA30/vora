import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const registry=JSON.parse(fs.readFileSync(path.join(root,'content/business-content.json'),'utf8'))
const errors=[]
const ids=new Set()
const allowedStatuses=new Set(registry.statuses)
const allowedDestinations=new Set(registry.destinations)
const allowedPriorities=new Set(['critical','high','medium','low'])

if(registry.version!==1)errors.push('registry version must be 1')
if(!Array.isArray(registry.records)||!registry.records.length)errors.push('records must be a non-empty array')

for(const record of registry.records||[]){
  if(!/^[a-z0-9-]+$/.test(record.id||''))errors.push(`invalid id: ${record.id}`)
  if(ids.has(record.id))errors.push(`duplicate id: ${record.id}`)
  ids.add(record.id)
  if(!record.label)errors.push(`${record.id}: missing label`)
  if(!allowedStatuses.has(record.status))errors.push(`${record.id}: invalid status`)
  if(!allowedPriorities.has(record.priority))errors.push(`${record.id}: invalid priority`)
  if(!Array.isArray(record.destinations)||!record.destinations.length)errors.push(`${record.id}: missing destinations`)
  for(const destination of record.destinations||[])if(!allowedDestinations.has(destination))errors.push(`${record.id}: invalid destination ${destination}`)
  if(record.status==='pending'&&(record.value!==null||record.source!==null||record.validatedAt!==null))errors.push(`${record.id}: pending records cannot contain publishable values`)
  if(record.status==='verified'&&(!record.value||!record.source||!/^\d{4}-\d{2}-\d{2}/.test(record.validatedAt||'')))errors.push(`${record.id}: verified records require value, source and validatedAt`)
}

if(errors.length){
  console.error(`Business content validation failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

const pending=registry.records.filter(({status})=>status==='pending').length
const verified=registry.records.length-pending
console.log(`Business content registry valid: ${registry.records.length} records (${verified} verified, ${pending} pending).`)
