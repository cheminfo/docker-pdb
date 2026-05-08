import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('top nav exposes the three pages', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.topnav');
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Browse' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'API' })).toBeVisible();
});

test('clicking the Browse link navigates to /browse', async ({ page }) => {
  await page.goto('/');
  await page.locator('.topnav').getByRole('link', { name: 'Browse' }).click();
  await expect(page).toHaveURL(/\/browse$/);
  await expect(
    page.getByPlaceholder(/Filter… \(e\.g\. nbResidues/),
  ).toBeVisible();
});

test('clicking the API link navigates to /api', async ({ page }) => {
  await page.goto('/');
  await page.locator('.topnav').getByRole('link', { name: 'API' }).click();
  await expect(page).toHaveURL(/\/api$/);
  await expect(page.getByRole('heading', { name: 'HTTP API' })).toBeVisible();
});

test('clicking the brand link returns to home', async ({ page }) => {
  await page.goto('/api');
  await page.locator('.topnav-brand').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
});
