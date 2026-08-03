import { test, expect } from '@playwright/test'

/**
 * The /analytics dashboard: no marketing chrome, and a days window that cannot
 * leave 1-365.
 *
 * THE POINT OF THE CLAMP TESTS. clampDays() was already checked as an
 * expression, and that proved nothing about the call site — an expression can be
 * correct while the value handed to fetchSummary comes from somewhere else
 * entirely. These read the days value out of the REQUEST BODY, which is the only
 * place that settles it.
 *
 * That is also why playwright.config.js sets synthetic VITE_SUPABASE_* values:
 * without them fetchSummary() throws on isConfigured() before a request exists
 * to inspect, which is exactly why this went unverified the first time.
 */

/** The aggregate shape AnalyticsPage renders. Synthetic; no production data. */
const SUMMARY = {
  total: 12,
  sessions: 7,
  days: 30,
  by_source: [{ source: 'hero', n: 8 }],
  by_path: [{ path: '/', n: 8 }],
  by_day: [{ day: '2026-08-01', n: 3 }],
}

/**
 * Intercept the RPC and keep the posted body. The returned array is what the
 * test asserts on — the request is the target, not the rendered numbers.
 */
async function captureSummaryCalls(page) {
  const calls = []
  await page.route('**/rpc/analytics_summary**', async (route) => {
    calls.push(route.request().postDataJSON())
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SUMMARY),
    })
  })
  return calls
}

async function submit(page, days) {
  await page.goto('/analytics')
  await page.locator('#analytics-passphrase').fill('not-a-real-passphrase')
  await page.locator('#analytics-days').fill(days)
  await page.getByRole('button', { name: /show me/i }).click()
}

/**
 * There are TWO guards on this window, and writing these tests is what
 * established that — the first run of the out-of-range cases produced no request
 * at all, not a clamped one.
 *
 * The form is not noValidate, so the browser runs constraint validation against
 * min="1" max="365" BEFORE the submit event reaches React. Out-of-range input is
 * therefore stopped at the browser and never becomes a request. A comment in
 * AnalyticsPage.jsx used to claim those attributes "were enforcing nothing at
 * all"; they enforce the outer boundary, and that comment has been corrected.
 *
 * clampDays is still load-bearing, for the case native validation lets through:
 * an EMPTY field is valid HTML, and Number('') is 0 — the original bug, a query
 * for nothing that rendered as a quiet month.
 *
 * Both layers are tested, because either one silently disappearing would leave
 * the other looking like it was doing the job.
 */
test.describe('the days window reaches the request clamped', () => {
  /* A non-numeric case is deliberately absent: #analytics-days is type=number,
     so a browser will not accept one as typed input. clampDays still guards it
     for a programmatic caller, but it is unreachable through this UI and a test
     claiming to cover it would be theatre. */
  const ACCEPTED = [
    { typed: '', expected: 30, why: 'an empty field must not query zero days' },
    { typed: '30', expected: 30, why: 'a value already in range is untouched' },
    { typed: '1', expected: 1, why: 'the floor itself is valid' },
    { typed: '365', expected: 365, why: 'the ceiling itself is valid' },
  ]

  for (const { typed, expected, why } of ACCEPTED) {
    test(`"${typed || 'empty'}" is sent as ${expected} — ${why}`, async ({ page }) => {
      const calls = await captureSummaryCalls(page)
      await submit(page, typed)

      await expect.poll(() => calls.length, { timeout: 5000 }).toBe(1)
      expect(calls[0].days).toBe(expected)
    })
  }

  for (const typed of ['0', '9999']) {
    test(`"${typed}" never becomes a request`, async ({ page }) => {
      const calls = await captureSummaryCalls(page)
      await submit(page, typed)
      await page.waitForTimeout(1000)

      /* Blocked by native constraint validation. The important property is not
         which layer stopped it — it is that no query outside 1-365 is ever
         issued. */
      expect(calls).toHaveLength(0)
    })
  }

  /**
   * The clamp itself, at the call site, with the browser's guard stood down.
   *
   * Turning off noValidate is exactly the situation clampDays exists for: any
   * path that reaches the submit handler without native validation having run
   * first. Without this the clamp's out-of-range branches would be untested
   * through the UI, which is how they went unverified in the first place.
   */
  for (const { typed, expected } of [
    { typed: '0', expected: 1 },
    { typed: '9999', expected: 365 },
  ]) {
    test(`"${typed}" clamps to ${expected} when native validation is bypassed`, async ({
      page,
    }) => {
      const calls = await captureSummaryCalls(page)
      await page.goto('/analytics')
      await page.locator('#analytics-passphrase').fill('not-a-real-passphrase')
      await page.locator('#analytics-days').fill(typed)
      await page.locator('.analytics-form').evaluate((form) => {
        form.noValidate = true
      })
      await page.getByRole('button', { name: /show me/i }).click()

      await expect.poll(() => calls.length, { timeout: 5000 }).toBe(1)
      expect(calls[0].days).toBe(expected)
    })
  }
})

test('the passphrase is posted, never compared in the browser', async ({ page }) => {
  const calls = await captureSummaryCalls(page)
  await submit(page, '30')
  await expect.poll(() => calls.length, { timeout: 5000 }).toBe(1)

  /* The security model is that Postgres decides. A future refactor that checked
     the passphrase in React would have to stop sending it — so asserting that it
     IS sent is how this test guards the model. */
  expect(calls[0].passphrase).toBe('not-a-real-passphrase')
})

test('the dashboard carries no marketing chrome', async ({ page }) => {
  await page.goto('/analytics')
  await expect(page.locator('h1')).toContainText(/whatsapp clicks/i)

  await expect(page.locator('header')).toHaveCount(0)
  await expect(page.locator('.site-footer')).toHaveCount(0)
  await expect(page.locator('.sticky-whatsapp')).toHaveCount(0)
  await expect(page.locator('.btn-accent')).toHaveCount(0)
  /* Asking the owner to consent to counting their own clicks was the tell. */
  await expect(page.locator('.consent-banner')).toHaveCount(0)

  /* The landmark stays. Stripping the chrome must not strip the document
     structure with it. */
  await expect(page.locator('main#main')).toHaveCount(1)
})

test('the dashboard stays out of search results', async ({ page }) => {
  await page.goto('/analytics')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})
