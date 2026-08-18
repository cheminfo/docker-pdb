import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('the Molecules nav tab is exposed', async ({ page }) => {
  await page.goto('/');
  await expect(
    page
      .locator('.app-header-nav')
      .getByRole('link', { name: 'Molecules', exact: true }),
  ).toBeVisible();
});

test('navigating to /molecules renders the editor and result list', async ({
  page,
}) => {
  await page.goto('/molecules');
  await expect(
    page.getByRole('heading', { name: 'Molecules', exact: true }),
  ).toBeVisible();
  // The mocked /v1/ligands endpoint returns ATP + HEM rows.
  await expect(page.getByText('ATP', { exact: true })).toBeVisible();
  await expect(page.getByText('HEM', { exact: true })).toBeVisible();
  // PDB count is rendered with thousands separator.
  await expect(page.getByText('1,842')).toBeVisible();
});
