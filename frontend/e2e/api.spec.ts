import { expect, test } from '@playwright/test';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('API page renders the static endpoint reference', async ({ page }) => {
  await page.goto('/api');
  await expect(page.getByRole('heading', { name: 'HTTP API' })).toBeVisible();

  const endpoints = page.locator('.endpoint');
  await expect(endpoints).toHaveCount(6);

  await expect(endpoints).toContainText([
    /GET \/pdb\/<PDB-ID>/,
    /GET \/pdb\/<PDB-ID>\/<PDB-ID>\.pdb/,
    /GET \/assembly\/<PDB-ID>\/<PDB-ID>\.pdb1/,
    /GET \/assembly\/<PDB-ID>\/<size>\.png/,
    /GET \/view\/<view-name>/,
    /GET \/stats\/<view-name>/,
  ]);
});

test('every endpoint card has a clickable example link', async ({ page }) => {
  await page.goto('/api');
  const examples = page.locator('.endpoint a.example');
  await expect(examples).toHaveCount(6);
  await expect(examples.first()).toHaveAttribute('href', '/pdb/5ABY');
});
