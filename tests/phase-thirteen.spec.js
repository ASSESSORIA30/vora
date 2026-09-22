import { test, expect } from '@playwright/test'

test('model finder applies transparent criteria and preserves the selected model', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vora_consent', 'analytics')
    window.recordedEvents = []
    window.gtag = (...args) => window.recordedEvents.push(args)
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#model-finder')
  const finder = page.locator('#model-finder')
  await expect(finder).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

  await finder.getByRole('group', { name: 'Dormitorios mínimos' }).getByRole('button', { name: '4', exact: true }).click()
  await finder.getByRole('group', { name: 'Baños mínimos' }).getByRole('button', { name: '3', exact: true }).click()
  await finder.getByRole('button', { name: 'Despacho' }).click()
  await finder.getByRole('button', { name: 'Ver modelos compatibles' }).click()

  const results = finder.locator('[data-model-finder-result]')
  await expect(results).toHaveCount(3)
  await expect(results.nth(0)).toHaveAttribute('data-model-finder-result', 'vora-170')
  await expect(results.nth(1)).toHaveAttribute('data-model-finder-result', 'vora-200')
  await expect(results.nth(2)).toHaveAttribute('data-model-finder-result', 'vora-signature')

  await page.evaluate(() => { window.finderPageIdentity = Math.random() })
  const identity = await page.evaluate(() => window.finderPageIdentity)
  await results.nth(0).getByRole('link', { name: 'Configurar' }).click()
  expect(await page.evaluate(() => window.finderPageIdentity)).toBe(identity)
  await expect(page).toHaveURL(/model=170.*source=model-finder.*#configurator/)
  await expect(page.getByRole('group', { name: '01 · MODELO' }).getByRole('button', { name: '170', exact: true })).toHaveAttribute('aria-pressed', 'true')

  const events = await page.evaluate(() => window.recordedEvents.filter((entry) => entry[0] === 'event'))
  expect(events.filter((entry) => entry[1] === 'model_finder_start')).toHaveLength(1)
  expect(events.filter((entry) => entry[1] === 'model_finder_complete')).toHaveLength(1)
  expect(events.find((entry) => entry[1] === 'model_finder_complete')[2]).toMatchObject({ bedrooms: 4, bathrooms: 3, office: true, result_count: 3 })
  expect(events.find((entry) => entry[1] === 'model_finder_result_click')[2]).toMatchObject({ model: 'vora-170', action: 'configure' })
})

test('strict finder criteria only return explicitly confirmed capabilities', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('vora_consent', 'necessary'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#model-finder')
  const finder = page.locator('#model-finder')
  await finder.getByRole('group', { name: 'Dormitorios mínimos' }).getByRole('button', { name: '5', exact: true }).click()
  await finder.getByRole('group', { name: 'Baños mínimos' }).getByRole('button', { name: '4', exact: true }).click()
  await finder.getByRole('button', { name: 'Despacho' }).click()
  await finder.getByRole('button', { name: 'Garaje' }).click()
  await finder.getByRole('button', { name: 'Piscina' }).click()
  await finder.getByRole('button', { name: 'Ver modelos compatibles' }).click()
  await expect(finder.locator('[data-model-finder-result]')).toHaveCount(1)
  await expect(finder.locator('[data-model-finder-result="vora-signature"]')).toContainText('Garaje')
  await expect(finder.locator('[data-model-finder-result="vora-signature"]')).toContainText('Piscina')
  await expect(finder).not.toContainText('m²')
})
