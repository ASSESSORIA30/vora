import { test, expect } from '@playwright/test'

const INDEXABLE_PATHS=['/','/modelos/vora-90','/modelos/vora-110','/modelos/vora-130','/modelos/vora-150','/modelos/vora-170','/modelos/vora-200','/modelos/vora-signature','/casas-industrializadas-hormigon','/casas-hormigon-llave-en-mano','/casas-modulares-premium','/guias','/guias/elegir-modelo-vivienda-industrializada','/guias/terreno-vivienda-industrializada']

async function necessaryConsent(page){
  await page.addInitScript(()=>localStorage.setItem('vora_consent','necessary'))
}

test('every canonical page returns 200 with unique metadata and one H1',async({page})=>{
  await necessaryConsent(page)
  const titles=new Set(),descriptions=new Set()
  for(const pathname of INDEXABLE_PATHS){
    const response=await page.goto(pathname)
    expect(response.status(),pathname).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    const title=await page.title()
    const description=await page.locator('meta[name="description"]').getAttribute('content')
    expect(titles.has(title),`duplicate title ${title}`).toBe(false)
    expect(descriptions.has(description),`duplicate description ${description}`).toBe(false)
    titles.add(title);descriptions.add(description)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp(`${pathname==='/'?'$':pathname+'$'}`))
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image')
  }
})

test('prerendered model and landing content is useful without client JavaScript',async({request})=>{
  const modelResponse=await request.get('/modelos/vora-110',{headers:{Accept:'text/html'}})
  const modelHtml=await modelResponse.text()
  expect(modelHtml).toContain('data-prerendered="true"')
  expect(modelHtml).toContain('<h1')
  expect(modelHtml).toContain('Despensa')
  expect(modelHtml).toContain('Explora otros modelos')
  expect(modelHtml).not.toContain('m² útiles')
  expect(modelHtml).toContain('BreadcrumbList')
  expect(modelHtml).not.toContain('SingleFamilyResidence')

  const landingResponse=await request.get('/casas-modulares-premium',{headers:{Accept:'text/html'}})
  const landingHtml=await landingResponse.text()
  expect(landingHtml).toContain('Antes de elegir tu VORA')
  expect(landingHtml).toContain('¿Qué modelos indican piscina o garaje?')
  expect(landingHtml).toContain('FAQPage')
  expect(landingHtml).toContain('/#compare')

  const guideResponse=await request.get('/guias/terreno-vivienda-industrializada',{headers:{Accept:'text/html'}})
  const guideHtml=await guideResponse.text()
  expect(guideHtml).toContain('Puedes empezar sin parcela')
  expect(guideHtml).toContain('La web no sustituye el estudio técnico')
  expect(guideHtml).toContain('BreadcrumbList')
  expect(guideHtml).not.toContain('FAQPage')
})

test('unknown and noncanonical routes have the expected status behavior',async({page,request})=>{
  await necessaryConsent(page)
  const missing=await page.goto('/modelos/vora-inexistente')
  expect(missing.status()).toBe(404)
  await expect(page.getByRole('heading',{level:1,name:'Esta página no existe.'})).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)

  const trailing=await request.get('/modelos/vora-90/',{headers:{Accept:'text/html'},maxRedirects:0})
  expect(trailing.status()).toBe(308)
  expect(trailing.headers().location).toBe('/modelos/vora-90')
  const htmlVariant=await request.get('/modelos/vora-90.html',{headers:{Accept:'text/html'},maxRedirects:0})
  expect(htmlVariant.status()).toBe(308)
  expect(htmlVariant.headers().location).toBe('/modelos/vora-90')
})

test('landing pages remain usable at mobile and desktop widths',async({page})=>{
  await necessaryConsent(page)
  await page.setViewportSize({width:390,height:844})
  await page.goto('/casas-hormigon-llave-en-mano')
  await expect(page.getByRole('navigation',{name:'Migas de pan'})).toBeVisible()
  await expect(page.getByRole('heading',{name:'Antes de elegir tu VORA.'})).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.setViewportSize({width:1440,height:1000})
  await page.goto('/modelos/vora-130')
  await expect(page.getByRole('navigation',{name:'Migas de pan'})).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)

  await page.setViewportSize({width:390,height:844})
  await page.goto('/guias/elegir-modelo-vivienda-industrializada')
  await expect(page.getByRole('heading',{level:1,name:'Cómo elegir un modelo de vivienda industrializada.'})).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
