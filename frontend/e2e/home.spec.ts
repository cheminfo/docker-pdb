import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('home page renders title and intro', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('PDB');
  await expect(page.locator('h1')).toContainText('View');
  await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
});

test('home page renders the four stat cards once the API responds', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.stat-card')).toHaveCount(4);
  await expect(page.locator('.stat-card').first()).toContainText('PDB entries');
  await expect(page.locator('.stat-card')).toContainText([
    'PDB entries',
    'Bio-assembly entries',
    'Total documents',
    'Total disk',
  ]);
});

test('home page renders both chart panels', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Structures by year' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Experimental method' }),
  ).toBeVisible();
});

test('home page shows an error placeholder when stats fail', async ({
  page,
}) => {
  await page.route(/\/pdb\/?$/, (route) =>
    route.fulfill({ status: 500, body: 'boom' }),
  );
  await page.goto('/');
  await expect(
    page.getByText(/Could not load database stats/),
  ).toBeVisible();
});
