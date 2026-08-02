import { defineConfig, devices } from '@playwright/test'

/**
 * The suite runs against the PRODUCTION build, not the dev server.
 *
 * That is deliberate and it is the only configuration that tests the real
 * thing: `npm run build` is two stages, and the second — scripts/prerender.mjs —
 * writes the per-route <head> and throws on template drift. A dev-server suite
 * would never exercise it. It also means Vite has inlined the VITE_* values
 * below, which is the whole reason the analytics tests can reach a request at
 * all: without them fetchSummary() throws before constructing one.
 *
 * TEST CREDENTIALS ARE NOT REAL, AND CANNOT BECOME REAL BY ACCIDENT.
 * VITE_SUPABASE_URL points at 127.0.0.1:9 — the discard port, on loopback. Every
 * analytics test intercepts the request with page.route() and answers it itself,
 * but if an interception were ever missed, the request would fail against a dead
 * local port rather than travel anywhere. There is no configuration of this file
 * that reaches a live Supabase project.
 */
const TEST_ENV = {
  VITE_SUPABASE_URL: 'http://127.0.0.1:9',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key-not-a-real-credential',
  VITE_FORMSPREE_ID: 'test-formspree-id',
}

export default defineConfig({
  testDir: './tests/e2e',
  /* The site is small and every spec drives its own page; parallel is safe. */
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    /**
     * Pixel 5 rather than a bare viewport resize: the device descriptor sets
     * isMobile and hasTouch, which is what makes Chromium report
     * `(hover: none)` and `(pointer: coarse)`. The CTA press tests depend on
     * that — a resized desktop browser still reports a fine pointer, so it
     * would pass while proving nothing about a phone.
     */
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    /* --host is not optional: vite preview otherwise binds localhost, which on
       Windows resolves to ::1 first, and the runner then waits out its timeout
       against a 127.0.0.1 that nothing is listening on. */
    command: 'npm run build && npm run preview -- --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: TEST_ENV,
  },
})
