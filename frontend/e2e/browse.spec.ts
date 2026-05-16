import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('browse page lists the curated PDB entries', async ({ page }) => {
  await page.goto('/browse');
  const rows = page.locator('.pdb-table tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('1O8O');
  await expect(rows.nth(1)).toContainText('3QK2');
});

test('search filters the table', async ({ page }) => {
  await page.goto('/browse');
  await expect(page.locator('.pdb-table tbody tr')).toHaveCount(2);

  await page.getByPlaceholder('Search titles…').fill('lactamase');
  await expect(page.locator('.pdb-table tbody tr')).toHaveCount(1);
  await expect(page.locator('.pdb-table tbody tr')).toContainText('3QK2');
  await expect(page.locator('.filter-panel-count')).toHaveText('1 / 2');
});

test('search with no matches shows the empty placeholder', async ({ page }) => {
  await page.goto('/browse');
  await page.getByPlaceholder('Search titles…').fill('zzzz-no-match');
  await expect(page.locator('.pdb-table-empty')).toContainText(
    'No entries match',
  );
});

test('selecting an entry shows its header and metadata', async ({ page }) => {
  await page.goto('/browse');
  await page.locator('.pdb-table tbody tr').nth(1).click();

  const header = page.locator('.browse-entry-header');
  await expect(header).toContainText('3QK2');
  await expect(header).toContainText('Another lactamase structure');
  await expect(header).toContainText('Chains:');
  await expect(header).toContainText('Residues:');
  await expect(header).toContainText('Year:');
});

test('search syntax help popover toggles', async ({ page }) => {
  await page.goto('/browse');
  const helpButton = page.getByRole('button', { name: 'Search syntax help' });
  await expect(page.locator('.searchbox-help')).toHaveCount(0);
  await helpButton.click();
  await expect(page.locator('.searchbox-help')).toBeVisible();
  await helpButton.click();
  await expect(page.locator('.searchbox-help')).toHaveCount(0);
});
