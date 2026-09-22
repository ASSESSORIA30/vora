import { test, expect } from '@playwright/test'

async function consent(page,value='necessary'){
  await page.addInitScript((choice)=>{
    localStorage.setItem('vora_consent',choice)
    window.recordedEvents=[]
    window.gtag=(...args)=>window.recordedEvents.push(args)
  },value)
}

test('configurator reaches contact without reload and preserves every selection',async({page})=>{
  await consent(page)
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/?utm_source=phase-two')
  await page.evaluate(()=>{window.phaseTwoPageIdentity=Math.random()})
  const identity=await page.evaluate(()=>window.phaseTwoPageIdentity)
  await page.getByRole('group',{name:'01 · MODELO'}).getByRole('button',{name:'150',exact:true}).click()
  await page.getByRole('group',{name:'02 · INTERIOR'}).getByRole('button',{name:/PURE/}).click()
  await page.getByRole('group',{name:'03 · EXTERIOR'}).getByRole('button',{name:/Pool/}).click()
  await page.getByRole('button',{name:'Hablar de esta VORA'}).click()

  expect(await page.evaluate(()=>window.phaseTwoPageIdentity)).toBe(identity)
  await expect(page).toHaveURL(/utm_source=phase-two.*model=150.*interior=PURE.*exterior=Pool.*source=configurator.*#contact/)
  const summary=page.getByRole('region',{name:'TU SELECCIÓN DEL CONFIGURADOR'})
  await expect(summary).toContainText('VORA 150')
  await expect(summary).toContainText('PURE')
  await expect(summary).toContainText('Roble claro')
  await expect(summary).toContainText('Pool')
  await expect(summary).toContainText('Piscina integrada')
  await expect(page.getByRole('group',{name:'Modelo'}).getByRole('button',{name:'VORA 150'})).toHaveAttribute('aria-pressed','true')
  await page.setViewportSize({width:390,height:844})
  await summary.scrollIntoViewIfNeeded()
  await page.screenshot({path:'test-results/contact-mobile.png'})
})

test('client validation is accessible and blocks incomplete requests',async({page})=>{
  await consent(page)
  let requests=0
  await page.route('**/api/contact',route=>{requests+=1;return route.abort()})
  await page.goto('/#contact')
  await page.getByRole('button',{name:'Enviar mi consulta'}).click()
  await expect(page.getByRole('alert')).toContainText('Revisa los campos')
  await expect(page.getByLabel('Nombre', {exact:false})).toBeFocused()
  await expect(page.getByLabel('Nombre', {exact:false})).toHaveAttribute('aria-invalid','true')
  expect(requests).toBe(0)
})

test('failed submission preserves form and configuration; retry sends once and tracks no personal data',async({page})=>{
  await consent(page,'analytics')
  await page.emulateMedia({reducedMotion:'reduce'})
  let success=false,requests=0,lastPayload
  await page.route('**/api/contact',async route=>{
    requests+=1
    lastPayload=route.request().postDataJSON()
    await new Promise(resolve=>setTimeout(resolve,100))
    await route.fulfill({status:success?200:502,contentType:'application/json',body:JSON.stringify(success?{ok:true,accepted:true}:{ok:false,error:'email_provider_error'})})
  })
  await page.goto('/?model=170&interior=GRAPHITE&exterior=Pool&source=configurator#contact')
  await page.getByLabel('Nombre',{exact:false}).fill('Persona Vora')
  await page.getByLabel('Teléfono',{exact:false}).fill('+34 600 000 000')
  await page.getByLabel('Email',{exact:false}).fill('persona@example.com')
  await page.getByLabel('Provincia',{exact:false}).fill('Girona')
  await page.getByRole('group',{name:'Situación del terreno'}).getByRole('button',{name:'Ya tengo parcela',exact:true}).click()
  await page.getByRole('checkbox').check()
  await page.getByRole('button',{name:'Enviar mi consulta'}).click()
  await expect(page.getByRole('alert')).toContainText('Tus datos siguen guardados')
  await expect(page.getByLabel('Nombre',{exact:false})).toHaveValue('Persona Vora')
  await expect(page.getByRole('region',{name:'TU SELECCIÓN DEL CONFIGURADOR'})).toContainText('GRAPHITE')
  success=true
  await page.getByRole('button',{name:'Enviar mi consulta'}).evaluate(button=>{
    const form=button.closest('form')
    form.requestSubmit()
    form.requestSubmit()
  })
  await expect(page.getByRole('status').filter({hasText:'SOLICITUD RECIBIDA'})).toBeVisible()
  expect(requests).toBe(2)
  expect(lastPayload.configuration).toEqual({model:'170',interior:'GRAPHITE',exterior:'Pool',source:'configurator'})
  expect(lastPayload.submissionId).toMatch(/^[a-zA-Z0-9-]{8,100}$/)
  const leadEvent=await page.evaluate(()=>window.recordedEvents.find(event=>event[0]==='event'&&event[1]==='generate_lead'))
  expect(leadEvent[2]).toMatchObject({model:'vora-170',source:'configurator',has_configuration:true,land_status:'owned'})
  expect(leadEvent[2]).not.toHaveProperty('name')
  expect(leadEvent[2]).not.toHaveProperty('phone')
  expect(leadEvent[2]).not.toHaveProperty('email')
  expect(leadEvent[2]).not.toHaveProperty('province')
})
