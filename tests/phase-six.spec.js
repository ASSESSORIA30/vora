import { test, expect } from '@playwright/test'

async function consent(page,value='analytics'){
  await page.addInitScript((choice)=>{
    localStorage.setItem('vora_consent',choice)
    window.recordedEvents=[]
    window.gtag=(...args)=>window.recordedEvents.push(args)
  },value)
}

test('commercial process and scope publish only the currently confirmed claims',async({page})=>{
  await consent(page)
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')

  const process=page.locator('#process')
  await expect(process.getByRole('listitem')).toHaveCount(6)
  await expect(process).toContainText('Elige tu VORA')
  await expect(process).not.toContainText('Licencias')
  await expect(process).not.toContainText('Cimentación')
  await expect(process).not.toContainText('Transporte')
  await process.scrollIntoViewIfNeeded()

  const included=page.locator('#included')
  await expect(included).toContainText('ALCANCE CONFIRMADO')
  await expect(included.locator('dl > div')).toHaveCount(6)
  await expect(included).not.toContainText('Permisos')
  await expect(included).not.toContainText('Cimentación')

  const events=await page.evaluate(()=>window.recordedEvents.filter(entry=>entry[0]==='event').map(entry=>entry[1]))
  expect(events.filter(name=>name==='process_view')).toHaveLength(1)
})

test('FAQ is keyboard accessible, server-visible and tracks meaningful opens',async({page})=>{
  await consent(page)
  await page.goto('/#faq')
  const faq=page.locator('#faq')
  const item=faq.locator('details').first()
  await expect(item).not.toHaveAttribute('open','')
  await expect(item).toContainText('No. Puedes explicar en qué punto estás')
  await item.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(item).toHaveAttribute('open','')
  const faqEvent=await page.evaluate(()=>window.recordedEvents.find(entry=>entry[0]==='event'&&entry[1]==='faq_open'))
  expect(faqEvent[2]).toMatchObject({faq_id:'plot-needed',topic:'Terreno',placement:'home'})
})

test('land status reaches contact without reload and preserves source and selection',async({page})=>{
  await consent(page)
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.setViewportSize({width:390,height:844})
  await page.goto('/#land')
  await page.evaluate(()=>{window.phaseSixIdentity=Math.random()})
  const identity=await page.evaluate(()=>window.phaseSixIdentity)
  await page.locator('#land').getByRole('link',{name:/Aún no tengo/}).click()

  expect(await page.evaluate(()=>window.phaseSixIdentity)).toBe(identity)
  expect(await page.evaluate(()=>Object.fromEntries(new URLSearchParams(location.search)))).toMatchObject({plot:'Aún no tengo',source:'land-journey'})
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.getByRole('group',{name:'Situación del terreno'}).getByRole('button',{name:'Aún no tengo'})).toHaveAttribute('aria-pressed','true')
  await expect(page.getByRole('region',{name:'TU PUNTO DE PARTIDA'})).toContainText('Aún no tengo')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)

  const events=await page.evaluate(()=>window.recordedEvents.filter(entry=>entry[0]==='event'))
  expect(events.some(entry=>entry[1]==='land_status_select'&&entry[2].land_status==='not_yet')).toBe(true)
  expect(events.some(entry=>entry[1]==='contact_cta_click'&&entry[2].source==='land-journey')).toBe(true)
})

test('land-origin lead sends the safe source and tracks conversion only after acceptance',async({page})=>{
  await consent(page)
  await page.emulateMedia({reducedMotion:'reduce'})
  let payload
  await page.route('**/api/contact',async route=>{
    payload=route.request().postDataJSON()
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,accepted:true})})
  })
  await page.goto('/?plot=No%20s%C3%A9%20si%20es%20apta&source=land-journey#contact')
  await page.getByLabel('Nombre',{exact:false}).fill('Persona Vora')
  await page.getByLabel('Teléfono',{exact:false}).fill('600000000')
  await page.getByLabel('Provincia',{exact:false}).fill('Girona')
  await page.getByRole('checkbox').check()
  await page.getByRole('button',{name:'Enviar mi consulta'}).click()
  await expect(page.getByRole('status')).toContainText('SOLICITUD RECIBIDA')
  expect(payload).toMatchObject({plot:'No sé si es apta',source:'land-journey',configuration:{source:'land-journey'}})
  const leadEvent=await page.evaluate(()=>window.recordedEvents.find(entry=>entry[0]==='event'&&entry[1]==='generate_lead'))
  expect(leadEvent[2]).toMatchObject({source:'land-journey',land_status:'unknown_fit'})
  expect(leadEvent[2]).not.toHaveProperty('name')
})

test('model pages expose real links to compare, configure and contact',async({page})=>{
  await consent(page,'necessary')
  await page.goto('/modelos/vora-170')
  await expect(page.locator('section[aria-labelledby="features-title"]').getByRole('link',{name:'Comparar modelos'})).toHaveAttribute('href','/#compare')
  await expect(page.getByRole('link',{name:'Configurar VORA 170'})).toHaveAttribute('href','#configurator')
  await expect(page.getByRole('link',{name:'Contactar'})).toHaveAttribute('href','#contact')
})
