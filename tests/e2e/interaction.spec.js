import { test, expect } from '@playwright/test'

/**
 * The primary CTA's press state, and the hover lift that must not stick to it.
 *
 * Previously "verified" by reading base.css, which is not verification: a
 * selector can exist and never match, and the bug being guarded here was
 * precisely two rules fighting over `transform`. These drive the control.
 */

/** scale(0.98) arrives as matrix(0.98, 0, 0, 0.98, 0, 0). */
function scaleOf(matrix) {
  const found = /matrix\(([^)]+)\)/.exec(matrix)
  if (!found) return null
  return Number.parseFloat(found[1].split(',')[0])
}

test('the CTA acknowledges a press', async ({ page }) => {
  await page.goto('/')
  const cta = page.locator('[data-primary-cta]').first()
  await cta.scrollIntoViewIfNeeded()

  const box = await cta.boundingBox()
  expect(box).not.toBeNull()

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  /* Past --duration-fast (150ms) so the transition has landed. */
  await page.waitForTimeout(250)
  const pressed = await cta.evaluate((el) => getComputedStyle(el).transform)
  await page.mouse.up()

  const scale = scaleOf(pressed)
  expect(scale, `expected a press scale, got transform: ${pressed}`).not.toBeNull()
  expect(scale).toBeGreaterThan(0.9)
  expect(scale).toBeLessThan(1)
})

test('the hover lift does not stick after a tap on touch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'this is the touch-specific regression')

  await page.goto('/')
  const cta = page.locator('[data-primary-cta]').first()
  await cta.scrollIntoViewIfNeeded()

  /* Ungated, :hover fires on tap in a touch browser and stays applied until the
     next tap elsewhere, so the button stayed lifted after the thumb left. The
     hover rule sits behind (hover: hover) and (pointer: fine) for this reason —
     if that media query ever stops matching the way it should, this fails. */
  const hoverApplies = await page.evaluate(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  expect(hoverApplies, 'the mobile project should report a coarse pointer').toBe(false)

  await cta.dispatchEvent('touchstart')
  await cta.dispatchEvent('touchend')
  await page.waitForTimeout(300)

  const resting = await cta.evaluate((el) => getComputedStyle(el).transform)
  const scale = scaleOf(resting)
  /* Either no transform at all, or one that is not the hover lift. */
  if (scale !== null) expect(scale).toBeCloseTo(1, 2)
  expect(resting).not.toContain('-2')
})

test('the focus ring is olive, not the brand accent', async ({ page }) => {
  await page.goto('/faq')
  const summary = page.locator('.faq-question').first()
  await summary.focus()

  const outline = await summary.evaluate((el) => getComputedStyle(el).outlineColor)
  /* --olive #3d5a3a. A terracotta ring on a terracotta control is no ring. */
  expect(outline).toBe('rgb(61, 90, 58)')
})
