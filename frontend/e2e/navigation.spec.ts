import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('top nav exposes Home, Browse and API tabs', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.topnav');
  await expect(nav.getByRole('tab', { name: 'Home' })).toBeVisible();
  await expect(nav.getByRole('tab', { name: 'Browse' })).toBeVisible();
  await expect(nav.getByRole('tab', { name: 'API' })).toBeVisible();
});

test('clicking the Browse tab navigates to /browse', async ({ page }) => {
  await page.goto('/');
  await page.locator('.topnav').getByRole('tab', { name: 'Browse' }).click();
  await expect(page).toHaveURL(/\/browse/);
  await expect(page.getByPlaceholder('Search titles…')).toBeVisible();
});

test('clicking the API tab navigates to /api', async ({ page }) => {
  await page.goto('/');
  await page.locator('.topnav').getByRole('tab', { name: 'API' }).click();
  await expect(page).toHaveURL(/\/api/);
  await expect(page.getByRole('heading', { name: 'HTTP API' })).toBeVisible();
});

test('clicking the Home tab returns to /', async ({ page }) => {
  await page.goto('/api');
  await page.locator('.topnav').getByRole('tab', { name: 'Home' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
});
