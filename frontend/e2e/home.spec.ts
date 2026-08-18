import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('home page renders title and intro', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Protein Data Bank');
  await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
});

test('home page renders the five stat cards once the API responds', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.stat-card')).toHaveCount(5);
  await expect(page.locator('.stat-card').first()).toContainText('PDB entries');
  await expect(page.locator('.stat-card')).toContainText([
    'PDB entries',
    `Added in ${new Date().getFullYear()}`,
    'Bio-assembly entries',
    'Raw archives on disk',
    'Last rsync',
  ]);
});

test('home page renders both chart panels', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Methods over time' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Experimental method' }),
  ).toBeVisible();
});

test('home page shows an error placeholder when stats fail', async ({
  page,
}) => {
  await page.route(/\/v1\/database\/info/, (route) =>
    route.fulfill({ status: 500, body: 'boom' }),
  );
  await page.goto('/');
  await expect(page.getByText(/Could not load database stats/)).toBeVisible();
});
