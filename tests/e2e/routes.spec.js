import { test, expect } from '@playwright/test'

/**
 * Every public route renders and none of them scroll sideways.
 *
 * Deliberately shallow. This is the check that catches a route removed from
 * App.jsx but left in NAV_LINKS, a prerender that wrote a page with no body, or
 * a layout that overflows once a long word meets a narrow phone — the failures
 * that make a page useless rather than imperfect. Content assertions live with
 * the features that own them.
 */
const ROUTES = ['/', '/services', '/pricing', '/about', '/faq', '/privacy']

for (const route of ROUTES) {
  test(`${route} renders with a single h1`, async ({ page }) => {
    const response = await page.goto(route)
    expect(response?.status(), `${route} should not 404`).toBeLessThan(400)

    /* One h1 per page is a stated rule in DESIGN.md, not just a nicety —
       it is how the page says what it is. */
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).not.toBeEmpty()
  })

  test(`${route} does not scroll sideways`, async ({ page }) => {
    await page.goto(route)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(0)
  })
}

test('an unknown path renders the 404 rather than a placeholder', async ({ page }) => {
  await page.goto('/no-such-page')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('body')).not.toContainText('built in a later phase')
})
