import test from 'node:test'
import assert from 'node:assert/strict'
import { buildLeadRecord } from '../api/lead-record.js'
import { deliverLeadToCrm } from '../api/integrations/crm.js'

const lead={
  submissionId:'submission-123',name:'Persona',phone:'+34 600 000 000',email:'persona@example.com',province:'Girona',plot:'Ya tengo parcela',privacy:true,
  model:'170',interior:'GRAPHITE',exterior:'Pool',source:'model-finder',page:'https://vora.example/modelos/vora-170?model=170#contact',
  attribution:{utm_source:'google',utm_medium:'cpc',utm_campaign:'brand',utm_term:'vora',utm_content:'model',gclid:'click',gbraid:'',wbraid:'',fbclid:'',landing_page:'https://vora.example/',referrer_host:'google.com',first_seen:'2026-09-22T10:00:00.000Z'},
}

test('builds a stable server-side lead record for email and a future CRM',()=>{
  const record=buildLeadRecord(lead,{now:new Date('2026-09-22T12:00:00.000Z')})
  assert.equal(record.id,'submission-123')
  assert.equal(record.timestamp,'2026-09-22T12:00:00.000Z')
  assert.equal(record.source,'model-finder')
  assert.deepEqual(record.configuration,{model:'170',interior:'GRAPHITE',exterior:'Pool'})
  assert.equal(record.land_status,'Ya tengo parcela')
  assert.equal(record.page_origin,'https://vora.example')
  assert.equal(record.page_path,'/modelos/vora-170#contact')
  assert.deepEqual(record.contact,{name:'Persona',phone:'+34 600 000 000',email:'persona@example.com',province:'Girona'})
  assert.deepEqual(record.consent,{privacy:true,captured_at:'2026-09-22T12:00:00.000Z'})
  assert.equal(record.utm.source,'google')
})

test('generates a server id when an older client omits one',()=>{
  const record=buildLeadRecord({...lead,submissionId:''},{now:new Date('2026-09-22T12:00:00.000Z'),idFactory:()=> 'server-id'})
  assert.equal(record.id,'server-id')
})

test('CRM adapter is explicitly inert until a provider is configured',async()=>{
  assert.deepEqual(await deliverLeadToCrm({}),{configured:false,delivered:false,provider:null})
})
