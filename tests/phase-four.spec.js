import { test, expect } from '@playwright/test'

async function consent(page, value = 'analytics') {
  await page.addInitScript((choice) => {
    localStorage.setItem('vora_consent', choice)
    window.recordedEvents = []
    window.gtag = (...args) => window.recordedEvents.push(args)
  }, value)
}

const analyticsEvents = (page) => page.evaluate(() => window.recordedEvents.filter((entry) => entry[0] === 'event'))

test('comparison is semantic, filterable and avoids horizontal mobile overflow', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#compare')
  const comparison = page.locator('#compare')
  await expect(comparison).toBeVisible()
  await expect(comparison.getByRole('heading', { name: 'Encuentra la escala que encaja contigo.' })).toBeVisible()
  await expect(comparison.locator('[data-model-comparison-card]')).toHaveCount(7)
  await expect(comparison).not.toContainText('m² útiles')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

  const filters = comparison.getByRole('group', { name: 'Filtrar modelos por número de dormitorios' })
  await filters.getByRole('button', { name: '4', exact: true }).click()
  await expect(filters.getByRole('button', { name: '4', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(comparison.locator('[data-model-comparison-card]')).toHaveCount(4)
  await expect(comparison.locator('[data-model-comparison-card="vora-170"]')).toContainText('Despacho')
  await expect(comparison.locator('[data-model-comparison-card="vora-200"]')).toContainText('Garaje doble')
  await expect(comparison.locator('[data-model-comparison-card="vora-150"]')).toContainText('Preparada para piscina')
  await comparison.getByRole('link', { name: 'Hablar del proyecto' }).click()
  await expect(page).toHaveURL(/source=model-comparison#contact$/)
  await expect.poll(async () => (await analyticsEvents(page)).filter((entry) => entry[1] === 'model_comparison_view').length).toBe(1)
  const events = await analyticsEvents(page)
  expect(events.filter((entry) => entry[1] === 'contact_start')).toHaveLength(1)
})

test('comparison keeps the model through configurator and contact without reloading', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#compare')
  await page.evaluate(() => { window.phaseFourPageIdentity = Math.random() })
  const identity = await page.evaluate(() => window.phaseFourPageIdentity)
  const card = page.locator('[data-model-comparison-card="vora-110"]')
  await card.getByRole('link', { name: 'Configurar', exact: true }).click()

  expect(await page.evaluate(() => window.phaseFourPageIdentity)).toBe(identity)
  await expect(page).toHaveURL(/model=110.*source=model-comparison.*#configurator/)
  await expect(page.getByRole('group', { name: '01 · MODELO' }).getByRole('button', { name: '110', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Hablar de esta VORA' }).click()
  expect(await page.evaluate(() => window.phaseFourPageIdentity)).toBe(identity)
  const location = await page.evaluate(() => ({ hash: window.location.hash, params: Object.fromEntries(new URLSearchParams(window.location.search)) }))
  expect(location).toEqual({ hash: '#contact', params: { model: '110', source: 'model-comparison', interior: 'EARTH', exterior: 'Terrace' } })
  await expect(page.getByRole('region', { name: 'TU SELECCIÓN DEL COMPARADOR' })).toContainText('VORA 110')

  const events = await analyticsEvents(page)
  expect(events.filter((entry) => entry[1] === 'configurator_start')).toHaveLength(1)
  expect(events.filter((entry) => entry[1] === 'contact_start')).toHaveLength(1)
  expect(events.filter((entry) => entry[1] === 'model_comparison_select' && entry[2].action === 'configure')).toHaveLength(1)
  expect(events.find((entry) => entry[1] === 'configurator_start')[2]).toMatchObject({ source: 'model-comparison', model: 'vora-110' })
  for (const entry of events) expect(JSON.stringify(entry)).not.toMatch(/email|phone|name|province/i)
})

test('model page exposes decision path, preselected configurator and objective alternatives', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/modelos/vora-170')
  await expect(page.getByRole('heading', { level: 1, name: '170' })).toBeVisible()
  await expect(page.getByRole('group', { name: '01 · MODELO' }).getByRole('button', { name: '170', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { name: 'Explora otros modelos.' })).toBeVisible()
  await expect(page.getByText('Modelo anterior', { exact: true })).toHaveCount(1)
  await expect(page.getByText('Modelo siguiente', { exact: true })).toHaveCount(1)

  const sectionOrder = await page.evaluate(() => {
    const selectors = ['section[aria-label^="Datos principales"]', '#plan', 'section[aria-labelledby="features-title"]', '#configurator', '#contact', 'section[aria-labelledby="related-models-title"]']
    return selectors.map((selector) => document.querySelector(selector)?.getBoundingClientRect().top + scrollY)
  })
  expect(sectionOrder).toEqual([...sectionOrder].sort((a, b) => a - b))

  await page.getByRole('link', { name: 'Contactar', exact: true }).click()
  await expect(page).toHaveURL(/model=170.*source=model_page.*#contact/)
  await expect(page.getByRole('region', { name: 'MODELO SELECCIONADO' })).toContainText('VORA 170')
  const events = await analyticsEvents(page)
  expect(events.filter((entry) => entry[1] === 'model_view')).toHaveLength(1)
})
