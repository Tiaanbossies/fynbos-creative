import { test, expect } from '@playwright/test'

/**
 * Consent is opt-in, and the WhatsApp click is never held hostage to it.
 *
 * The second half matters more than the first: this site exists to produce a
 * WhatsApp click, so a consent prompt that blocks or delays one is a worse
 * failure than any amount of missing analytics.
 */

/** The CTA opens wa.me in a new tab. Swallow it so a test never leaves the app. */
async function stubWhatsApp(page) {
  await page.route('**://wa.me/**', (route) => route.abort())
  await page.route('**://api.whatsapp.com/**', (route) => route.abort())
  page.context().on('page', (popup) => popup.close().catch(() => {}))
}

test('nothing is recorded before the visitor answers', async ({ page }) => {
  const events = []
  await page.route('**/analytics_events**', (route) => {
    events.push(route.request().url())
    return route.fulfill({ status: 201, body: '' })
  })
  await stubWhatsApp(page)

  await page.goto('/')
  await expect(page.locator('.consent-banner')).toBeVisible()

  await page.locator('[data-primary-cta]').first().click({ force: true })
  await page.waitForTimeout(600)

  expect(events, 'an event was sent before consent was given').toHaveLength(0)
})

test('declining keeps it off, and the notice does not come back', async ({ page }) => {
  const events = []
  await page.route('**/analytics_events**', (route) => {
    events.push(route.request().url())
    return route.fulfill({ status: 201, body: '' })
  })
  await stubWhatsApp(page)

  await page.goto('/')
  await page.getByRole('button', { name: /no thanks/i }).click()
  await expect(page.locator('.consent-banner')).toHaveCount(0)

  await page.locator('[data-primary-cta]').first().click({ force: true })
  await page.waitForTimeout(600)
  expect(events, 'an event was sent after the visitor declined').toHaveLength(0)

  /* A refusal has to survive a reload, or it is not a refusal. */
  await page.goto('/pricing')
  await expect(page.locator('.consent-banner')).toHaveCount(0)
})

test('allowing lets a click be counted', async ({ page }) => {
  const events = []
  await page.route('**/analytics_events**', (route) => {
    events.push(route.request().postDataJSON())
    return route.fulfill({ status: 201, body: '' })
  })
  await stubWhatsApp(page)

  await page.goto('/')
  await page.getByRole('button', { name: /^allow/i }).click()
  await expect(page.locator('.consent-banner')).toHaveCount(0)

  await page.locator('[data-primary-cta]').first().click({ force: true })
  await expect.poll(() => events.length, { timeout: 5000 }).toBeGreaterThan(0)

  const event = events[0]
  expect(event.event).toBe('whatsapp_click')
  expect(event.path).toBe('/')
  /* The privacy policy promises a hostname, never a full referrer. */
  expect(event).not.toHaveProperty('referrer')
})

test('the WhatsApp link is a real href before any consent choice', async ({ page }) => {
  await page.goto('/')
  const cta = page.locator('[data-primary-cta]').first()
  await expect(cta).toHaveAttribute('href', /wa\.me|whatsapp/i)
})
