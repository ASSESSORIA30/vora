import { test, expect } from '@playwright/test'

async function consent(page, value = 'necessary') {
  await page.addInitScript((value) => {
    localStorage.setItem('vora_consent', value)
    window.recordedEvents = []
    window.gtag = (...args) => window.recordedEvents.push(args)
  }, value)
}

test('mobile navigation closes, traps/restores focus and unlocks scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await consent(page)
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir menú' })
  await trigger.click()
  const menu = page.getByRole('dialog')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cerrar menú' })).toBeFocused()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await page.keyboard.press('Shift+Tab')
  await expect(menu.getByRole('link', { name: 'Contacto', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(menu.getByRole('button')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await trigger.click()
  await menu.getByRole('link', { name: 'Contacto', exact: true }).click()
  await expect(menu).toHaveCount(0)
  await expect(page).toHaveURL(/#contact$/)
})

test('mobile hero never requests desktop media and immediately exposes the CTA', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await consent(page)
  const requests = []
  page.on('request', request => requests.push(request.url()))
  await page.goto('/')
  await expect(page.locator('#top h1')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Descubrir la colección' })).toBeVisible()
  await expect(page.locator('#top video source')).toHaveAttribute('src', '/media/hero/hero-mobile.mp4')
  expect(requests.filter(url => url.includes('hero-desktop'))).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/home-mobile.png' })
})

test('reduced motion keeps content and statistics visible without video or smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await consent(page)
  await page.goto('/')
  await expect(page.locator('#top video')).toHaveCount(0)
  expect(await page.evaluate(() => window.lenis == null)).toBe(true)
  await expect(page.locator('#about')).toContainText('07')
  await expect(page.locator('#about')).toContainText('03—05')
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('#models .motion-collection-track')).toHaveCSS('flex-direction', 'column')
  await expect(page.locator('#contact h2')).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('#top video')).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('#top video')).toHaveCount(0)
  await expect(page.locator('#contact h2')).toHaveText('Hablemosde tu proyecto.')
})

test('form records one start, no failed conversion and one successful conversion', async ({ page }) => {
  await consent(page, 'analytics')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  let success = false
  const payloads = []
  await page.route('**/api/contact', async route => {
    payloads.push(route.request().postDataJSON())
    await route.fulfill({ status: success ? 200 : 503, contentType: 'application/json', body: JSON.stringify(success ? { ok: true, accepted: true } : { ok: false, error: 'test_failure' }) })
  })
  await page.goto('/?model=130&interior=EARTH&exterior=Terrace#contact')
  await page.getByLabel('Nombre', { exact: false }).fill('Prova Vora')
  await page.getByLabel('Teléfono', { exact: false }).fill('600000000')
  await page.getByLabel('Provincia', { exact: false }).fill('Barcelona')
  await page.getByRole('group', { name: 'Situación del terreno' }).getByRole('button', { name: 'Ya tengo parcela', exact: true }).click()
  await page.getByRole('checkbox').check()
  const events = () => page.evaluate(() => window.recordedEvents.filter(x => x[0] === 'event').map(x => x[1]))
  expect((await events()).filter(x => x === 'form_start')).toHaveLength(1)
  await page.getByRole('button', { name: 'Enviar mi consulta' }).click()
  await expect(page.getByRole('alert')).toContainText('No hemos podido enviar')
  expect(await events()).not.toContain('generate_lead')
  success = true
  await page.getByRole('button', { name: 'Enviar mi consulta' }).click()
  await expect(page.getByRole('status')).toContainText('SOLICITUD RECIBIDA')
  await expect(page.getByRole('status')).toBeFocused()
  expect((await events()).filter(x => x === 'generate_lead')).toHaveLength(1)
  expect(payloads[1]).toMatchObject({ model: '130', interior: 'EARTH', exterior: 'Terrace', privacy: true, province: 'Barcelona' })
})

test('necessary-only consent does not send analytics events', async ({ page }) => {
  await consent(page)
  await page.goto('/')
  await page.getByRole('link', { name: 'Descubrir la colección' }).click()
  expect(await page.evaluate(() => window.recordedEvents)).toEqual([])
})

test('configuration and plan selectors expose their selected state', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const models = page.getByRole('group', { name: '01 · MODELO' })
  await models.getByRole('button', { name: '90', exact: true }).click()
  await expect(models.getByRole('button', { name: '90', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('group', { name: '03 · EXTERIOR' }).getByRole('button', { name: /Pool/ })).toHaveCount(0)
  await page.goto('/modelos/vora-130')
  const plans = page.getByRole('group', { name: 'Vista del plano' })
  await plans.getByRole('button', { name: 'Plano limpio' }).click()
  await expect(plans.getByRole('button', { name: 'Plano limpio' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('img', { name: 'Plano arquitectónico conceptual' })).toBeVisible()
})

test('all existing pages render without runtime errors', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const paths = ['/', ...['90','110','130','150','170','200','signature'].map(x => `/modelos/vora-${x}`), '/casas-industrializadas-hormigon', '/casas-hormigon-llave-en-mano', '/casas-modulares-premium', '/legal/aviso-legal', '/legal/privacidad', '/legal/cookies']
  for (const path of paths) {
    const response = await page.goto(path)
    expect(response.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
  }
  expect(errors).toEqual([])
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.screenshot({ path: 'test-results/home-desktop.png' })
})
