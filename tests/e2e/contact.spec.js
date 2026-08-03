import { test, expect } from '@playwright/test'

/**
 * The contact form's failure paths, which are the ones that lose enquiries.
 */

test('a failed submit moves focus to the first invalid field', async ({ page }) => {
  await page.goto('/')
  await page.locator('.contact-submit').scrollIntoViewIfNeeded()
  await page.locator('.contact-submit').click()

  /* Not merely "an error appeared" — focus has to land on the offending field,
     because that is what announces the error to a screen reader and what tells
     a keyboard visitor where to go. */
  await expect(page.locator('#contact-name')).toBeFocused()
  await expect(page.locator('.contact-error')).not.toHaveCount(0)
})

test('errors are the semantic error colour, not the brand accent', async ({ page }) => {
  await page.goto('/')
  await page.locator('.contact-submit').scrollIntoViewIfNeeded()
  await page.locator('.contact-submit').click()

  const colour = await page
    .locator('.contact-error')
    .first()
    .evaluate((el) => getComputedStyle(el).color)

  /* --erica #9f1239. Terracotta (168, 80, 61) here would make a failed field
     look like the button the visitor is being invited to press. */
  expect(colour).toBe('rgb(159, 18, 57)')
})

test('correcting a field clears its error without stealing focus', async ({ page }) => {
  await page.goto('/')
  await page.locator('.contact-submit').scrollIntoViewIfNeeded()
  await page.locator('.contact-submit').click()
  await expect(page.locator('#contact-name')).toBeFocused()

  await page.locator('#contact-name').fill('Tiaan')
  await expect(page.locator('#contact-name-error')).toHaveCount(0)
  await expect(page.locator('#contact-name')).toBeFocused()
})

test('the phone field asks for a telephone keypad without rejecting an email', async ({ page }) => {
  await page.goto('/')
  const field = page.locator('#contact-detail')
  await expect(field).toHaveAttribute('inputmode', 'tel')
  /* type stays text: the field accepts a phone number OR an email, and
     validateEnquiry is deliberately permissive about which. */
  await expect(field).toHaveAttribute('type', 'text')
})
