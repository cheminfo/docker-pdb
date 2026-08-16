import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('site header exposes Home, Browse and API pages', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.app-header-nav');
  await expect(
    nav.getByRole('link', { name: 'Home', exact: true }),
  ).toBeVisible();
  await expect(
    nav.getByRole('link', { name: 'Browse', exact: true }),
  ).toBeVisible();
  await expect(
    nav.getByRole('link', { name: 'API', exact: true }),
  ).toBeVisible();
});

test('the header carries the Cite and Tools utilities', async ({ page }) => {
  await page.goto('/');
  const actions = page.locator('.app-header-actions');
  await expect(actions.getByRole('button', { name: 'Cite' })).toBeVisible();
  await expect(actions.getByRole('button', { name: 'Tools' })).toBeVisible();
});

test('clicking Browse navigates to /browse', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('.app-header-nav')
    .getByRole('link', { name: 'Browse', exact: true })
    .click();
  await expect(page).toHaveURL(/\/browse/);
  await expect(page.getByPlaceholder('Search titles…')).toBeVisible();
});

test('clicking API navigates to /api', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('.app-header-nav')
    .getByRole('link', { name: 'API', exact: true })
    .click();
  await expect(page).toHaveURL(/\/api/);
  await expect(page.getByRole('heading', { name: 'HTTP API' })).toBeVisible();
});

test('clicking Home returns to /', async ({ page }) => {
  await page.goto('/api');
  await page
    .locator('.app-header-nav')
    .getByRole('link', { name: 'Home', exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
});
