import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/contact.js'

function request(body,{ip='203.0.113.1',headers={}}={}){
  return {method:'POST',body,headers:{'content-type':'application/json','x-forwarded-for':ip,...headers},socket:{remoteAddress:ip}}
}

function response(){
  return {
    statusCode:200,
    headers:{},
    payload:null,
    setHeader(name,value){this.headers[name]=value},
    status(code){this.statusCode=code;return this},
    json(payload){this.payload=payload;return this},
  }
}

function validLead(overrides={}){
  return {
    name:'Persona de prueba',phone:'+34 600 000 000',email:'persona@example.com',province:'Barcelona',plot:'Ya tengo parcela',privacy:true,website:'',
    configuration:{model:'130',interior:'EARTH',exterior:'Terrace',source:'configurator'},
    page:'https://example.com/?utm_source=test#contact',attribution:{utm_source:'test'},formStartedAt:Date.now()-5000,
    submissionId:`submission-${Math.random().toString(36).slice(2,12)}`,...overrides,
  }
}

test('rejects malformed lead fields before contacting Resend',async()=>{
  const res=response()
  await handler(request(validLead({name:'',phone:'abc',email:'not-an-email',privacy:false}),{ip:'203.0.113.10'}),res)
  assert.equal(res.statusCode,400)
  assert.equal(res.payload.error,'invalid_request')
  assert.deepEqual(Object.keys(res.payload.fields).sort(),['email','name','phone','privacy'])
})

test('reports the exact missing Resend configuration without inventing values',async()=>{
  const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEADS_EMAIL:process.env.LEADS_EMAIL,RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL}
  delete process.env.RESEND_API_KEY
  delete process.env.LEADS_EMAIL
  delete process.env.RESEND_FROM_EMAIL
  const res=response()
  await handler(request(validLead(),{ip:'203.0.113.11'}),res)
  assert.equal(res.statusCode,503)
  assert.deepEqual(res.payload.required,['RESEND_API_KEY','LEADS_EMAIL','RESEND_FROM_EMAIL'])
  Object.entries(saved).forEach(([key,value])=>value===undefined?delete process.env[key]:process.env[key]=value)
})

test('accepts model comparison as a contact source without requiring configurator options',async()=>{
  const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEADS_EMAIL:process.env.LEADS_EMAIL,RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL}
  delete process.env.RESEND_API_KEY
  delete process.env.LEADS_EMAIL
  delete process.env.RESEND_FROM_EMAIL
  const res=response()
  await handler(request(validLead({configuration:{model:'110',interior:'',exterior:'',source:'model-comparison'}}),{ip:'203.0.113.14'}),res)
  assert.equal(res.statusCode,503)
  assert.equal(res.payload.error,'lead_channel_not_configured')
  Object.entries(saved).forEach(([key,value])=>value===undefined?delete process.env[key]:process.env[key]=value)
})

test('accepts the land journey source and the expanded plot states',async()=>{
  const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEADS_EMAIL:process.env.LEADS_EMAIL,RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL}
  delete process.env.RESEND_API_KEY
  delete process.env.LEADS_EMAIL
  delete process.env.RESEND_FROM_EMAIL
  const res=response()
  await handler(request(validLead({plot:'No sé si es apta',configuration:{model:'',interior:'',exterior:'',source:'land-journey'}}),{ip:'203.0.113.15'}),res)
  assert.equal(res.statusCode,503)
  assert.equal(res.payload.error,'lead_channel_not_configured')
  Object.entries(saved).forEach(([key,value])=>value===undefined?delete process.env[key]:process.env[key]=value)
})

test('accepts collection and SEO landing sources for configured leads',async()=>{
  const saved={RESEND_API_KEY:process.env.RESEND_API_KEY,LEADS_EMAIL:process.env.LEADS_EMAIL,RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL}
  delete process.env.RESEND_API_KEY
  delete process.env.LEADS_EMAIL
  delete process.env.RESEND_FROM_EMAIL
  for(const [index,source] of ['model-collection','model-finder','seo-landing','seo-guide'].entries()){
    const res=response()
    await handler(request(validLead({configuration:{model:'130',interior:'EARTH',exterior:'Terrace',source}}),{ip:`203.0.113.${20+index}`}),res)
    assert.equal(res.statusCode,503)
    assert.equal(res.payload.error,'lead_channel_not_configured')
  }
  Object.entries(saved).forEach(([key,value])=>value===undefined?delete process.env[key]:process.env[key]=value)
})

test('sanitizes the email body, includes configuration and deduplicates accepted submissions',async()=>{
  const savedFetch=global.fetch
  const savedEnv={RESEND_API_KEY:process.env.RESEND_API_KEY,LEADS_EMAIL:process.env.LEADS_EMAIL,RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL}
  process.env.RESEND_API_KEY='test-key'
  process.env.LEADS_EMAIL='leads@example.com'
  process.env.RESEND_FROM_EMAIL='VORA <from@example.com>'
  let providerCalls=0,providerPayload
  global.fetch=async(_url,options)=>{providerCalls+=1;providerPayload=JSON.parse(options.body);return {ok:true,status:200,json:async()=>({id:'email-id'})}}
  const lead=validLead({name:'<img src=x onerror=alert(1)>'})
  const first=response(),second=response()
  await handler(request(lead,{ip:'203.0.113.12'}),first)
  await handler(request(lead,{ip:'203.0.113.12'}),second)
  assert.deepEqual(first.payload,{ok:true,accepted:true})
  assert.deepEqual(second.payload,{ok:true,accepted:false,duplicate:true})
  assert.equal(providerCalls,1)
  assert.match(providerPayload.html,/&lt;img src=x onerror=alert\(1\)&gt;/)
  assert.match(providerPayload.html,/configurator/)
  assert.match(providerPayload.html,/EARTH/)
  global.fetch=savedFetch
  Object.entries(savedEnv).forEach(([key,value])=>value===undefined?delete process.env[key]:process.env[key]=value)
})

test('honeypot submissions are accepted silently without contacting the provider',async()=>{
  const savedFetch=global.fetch
  let called=false
  global.fetch=async()=>{called=true;throw new Error('must not run')}
  const res=response()
  await handler(request(validLead({website:'spam.example'}),{ip:'203.0.113.13'}),res)
  assert.deepEqual(res.payload,{ok:true,accepted:false})
  assert.equal(called,false)
  global.fetch=savedFetch
})

test('rejects unsupported methods, media types and oversized payloads',async()=>{
  const wrongMethod=response()
  await handler({...request(validLead()),method:'GET'},wrongMethod)
  assert.equal(wrongMethod.statusCode,405)
  assert.equal(wrongMethod.headers.Allow,'POST')
  assert.equal(wrongMethod.headers['Cache-Control'],'no-store, max-age=0')

  const wrongType=response()
  await handler(request(validLead(),{headers:{'content-type':'text/plain'}}),wrongType)
  assert.equal(wrongType.statusCode,415)

  const oversized=response()
  await handler(request(validLead(),{headers:{'content-length':'20000'}}),oversized)
  assert.equal(oversized.statusCode,413)
})

test('implausibly fast submissions are accepted silently without provider access',async()=>{
  const savedFetch=global.fetch
  let called=false
  global.fetch=async()=>{called=true;throw new Error('must not run')}
  const res=response()
  await handler(request(validLead({formStartedAt:Date.now()}),{ip:'203.0.113.30'}),res)
  assert.deepEqual(res.payload,{ok:true,accepted:false})
  assert.equal(called,false)
  global.fetch=savedFetch
})
