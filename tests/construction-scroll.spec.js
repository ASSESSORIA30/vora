import { test, expect } from '@playwright/test'

const consent = page => page.addInitScript(() => localStorage.setItem('vora_consent', 'necessary'))
const phase = page => page.locator('#construction .hud-count-current')
const engaged = page => page.evaluate(() => document.documentElement.classList.contains('construction-engaged'))
// Gestures made while a transition runs are ignored on purpose, so each step waits for the previous one.
const settled = page => expect(page.locator('#construction')).toHaveAttribute('data-moving', 'false', { timeout: 6000 })
const sectionTop = page => page.evaluate(() => Math.round(document.getElementById('construction').getBoundingClientRect().top))

// Wheel events are sent through CDP with explicit timestamps: real browsers stamp
// them with the hardware time, so the cadence must not depend on test-runner delays.
async function wheelSequence(page, deltas, interval) {
  const client = await page.context().newCDPSession(page)
  const start = Date.now() / 1000
  for (const [index, deltaY] of deltas.entries()) {
    await client.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 600, y: 400, deltaX: 0, deltaY, timestamp: start + index * interval / 1000 })
  }
  await client.detach()
}

// A Mac-trackpad style swipe: the finger accelerates, then inertia keeps emitting decaying deltas.
async function trackpad(page, direction, { peak = 48, inertia = 1200 } = {}) {
  const deltas = [2, 6, 14, 28, 40, peak].map(value => direction * value)
  for (let value = peak, elapsed = 0; elapsed < inertia && value >= .5; elapsed += 16) {
    value *= .955
    deltas.push(direction * Math.max(.5, value))
  }
  await wheelSequence(page, deltas, 16)
  await page.waitForTimeout(150)
  await settled(page)
}

async function arriveFromAbove(page) {
  const top = await page.evaluate(() => document.getElementById('construction').getBoundingClientRect().top + scrollY)
  await page.evaluate(y => scrollTo(0, y), top - 400)
  await page.mouse.move(600, 400)
  await page.waitForTimeout(300)
  for (let notch = 0; notch < 20 && !(await engaged(page)); notch++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(30) }
  await expect.poll(() => engaged(page)).toBe(true)
  // Let the arriving gesture end, so the next one is clearly a new gesture.
  await page.waitForTimeout(400)
  await settled(page)
  expect(Math.abs(await sectionTop(page))).toBeLessThanOrEqual(1)
}

test('the construction film is only requested near its full-screen section', async ({ page }) => {
  await consent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  const requests = []
  page.on('request', request => requests.push(request.url()))
  await page.goto('/')
  await page.waitForTimeout(500)
  expect(requests.some(url => url.includes('/videos/vora-construccion.mp4'))).toBe(false)
  const box = await page.locator('#construction').boundingBox()
  expect(Math.round(box.height)).toBe(900)
  await expect(phase(page)).toHaveText('01')
  await expect(page.locator('#construction .hud-title[data-active="true"]')).toHaveText('Todo empieza aquí')
})

test('one gesture moves exactly one phase, whatever its length or inertia', async ({ page }) => {
  await consent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await arriveFromAbove(page)
  await expect(phase(page)).toHaveText('01')

  await trackpad(page, 1, { peak: 30, inertia: 200 })
  await expect(phase(page)).toHaveText('02')
  await trackpad(page, 1, { peak: 160, inertia: 2400 })
  await expect(phase(page)).toHaveText('03')
  await wheelSequence(page, Array(14).fill(100), 40)
  await page.waitForTimeout(500)
  await settled(page)
  await expect(phase(page)).toHaveText('04')
  await trackpad(page, -1, { inertia: 900 })
  await expect(phase(page)).toHaveText('03')
  await expect(page.locator('#construction .hud-title[data-active="true"]')).toHaveText('Precisión industrial')
  await expect(page.locator('#construction .hud-segment[data-state="done"]')).toHaveCount(2)
  expect(Math.abs(await sectionTop(page))).toBeLessThanOrEqual(1)

  await page.keyboard.press('ArrowDown')
  await settled(page)
  await expect(phase(page)).toHaveText('04')

  await page.getByRole('button', { name: 'Fase 7 de 7: VORA — Concrete Living' }).click()
  await expect(phase(page)).toHaveText('07')
  await expect(page.getByRole('button', { name: 'Fase 7 de 7: VORA — Concrete Living' })).toHaveAttribute('aria-current', 'step')
})

test('the section releases at both ends and is met from below at its last phase', async ({ page }) => {
  await consent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await arriveFromAbove(page)
  await trackpad(page, -1, { inertia: 600 })
  await expect.poll(() => engaged(page)).toBe(false)
  await expect.poll(() => sectionTop(page)).toBeGreaterThan(300)

  await arriveFromAbove(page)
  await page.getByRole('button', { name: 'Fase 7 de 7: VORA — Concrete Living' }).click()
  await settled(page)
  await trackpad(page, 1, { inertia: 600 })
  await expect.poll(() => engaged(page)).toBe(false)
  await expect.poll(() => sectionTop(page)).toBeLessThanOrEqual(-899)

  for (let notch = 0; notch < 60 && !(await engaged(page)); notch++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(60) }
  await expect.poll(() => engaged(page)).toBe(true)
  expect(Math.abs(await sectionTop(page))).toBeLessThanOrEqual(1)
  await expect(phase(page)).toHaveText('07')
})

test('focus moving elsewhere releases the page instead of trapping it', async ({ page }) => {
  await consent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await arriveFromAbove(page)
  await page.locator('#models a').first().focus()
  await expect.poll(() => engaged(page)).toBe(false)
  await expect(page.locator('#models a').first()).toBeInViewport()
})

test.describe('touch', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

  test('each swipe moves one phase, however long it is', async ({ page }) => {
    await consent(page)
    await page.goto('/')
    const top = await page.evaluate(() => document.getElementById('construction').getBoundingClientRect().top + scrollY)
    await page.evaluate(y => scrollTo(0, y), top - 300)
    for (let step = 0; step < 30 && !(await engaged(page)); step++) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200) }
    await expect.poll(() => engaged(page)).toBe(true)
    await settled(page)
    const client = await page.context().newCDPSession(page)
    const swipe = async (from, to) => {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: from }] })
      for (let i = 1; i <= 10; i++) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: from + (to - from) * i / 10 }] })
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(100)
      await settled(page)
    }
    const start = Number(await phase(page).textContent())
    await swipe(600, 540)
    await expect(phase(page)).toHaveText(String(start + 1).padStart(2, '0'))
    await swipe(780, 120)
    await expect(phase(page)).toHaveText(String(start + 2).padStart(2, '0'))
    await swipe(200, 500)
    await expect(phase(page)).toHaveText(String(start + 1).padStart(2, '0'))
    expect(Math.abs(await sectionTop(page))).toBeLessThanOrEqual(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
})

test('reduced motion shows the phases as stills with controls and never holds the page', async ({ page }) => {
  await consent(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const section = page.locator('#construction')
  await section.scrollIntoViewIfNeeded()
  await expect(section.locator('video')).toHaveCount(0)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(300)
  expect(await engaged(page)).toBe(false)
  await section.getByRole('button', { name: 'Fase siguiente' }).click()
  await expect(phase(page)).toHaveText('02')
  await expect(section.locator('[aria-live="polite"]')).toContainText('Fase 2 de 7: Cimentación')
})
