import { test, expect } from '@playwright/test'

test('construction scroll defers its video and pins a full-screen stage',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('vora_consent','necessary'))
  await page.setViewportSize({width:1440,height:900})
  const requests=[]
  page.on('request',request=>requests.push(request.url()))
  await page.goto('/')
  const section=page.locator('#construction')
  await expect(section).toHaveCount(1)
  expect(requests.some(url=>url.includes('/media/construction/')&&url.endsWith('.mp4'))).toBe(false)
  const layout=await section.evaluate(node=>({height:node.offsetHeight,stage:getComputedStyle(node.firstElementChild).position,viewport:innerHeight}))
  expect(layout.stage).toBe('sticky')
  expect(layout.height).toBeGreaterThanOrEqual(layout.viewport*3)
  await expect(section.locator('.construction-caption').first()).toContainText('El futuro de')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('reduced motion shows the finished house without loading the video',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('vora_consent','necessary'))
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.setViewportSize({width:390,height:844})
  await page.goto('/')
  const section=page.locator('#construction')
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole('heading',{level:2})).toContainText('Concrete Living')
  await expect(section.locator('video')).toHaveCount(0)
  await expect(section.getByRole('img')).toBeVisible()
})
