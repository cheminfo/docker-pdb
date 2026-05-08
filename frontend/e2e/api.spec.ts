import { expect, test } from '@playwright/test';

import { endpoints } from '../src/pages/api/endpoints.tsx';

import { mockApi } from './fixtures.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('API page renders the static endpoint reference', async ({ page }) => {
  await page.goto('/api');
  await expect(page.getByRole('heading', { name: 'HTTP API' })).toBeVisible();

  const cards = page.locator('.endpoint');
  await expect(cards).toHaveCount(endpoints.length);

  // Each card's path is rendered as `GET <path>` in the leading <code> tag.
  // Asserting once per row keeps the failure message specific.
  for (const [index, endpoint] of endpoints.entries()) {
    await expect(cards.nth(index).locator('code.path')).toHaveText(
      `${endpoint.method} ${endpoint.path}`,
    );
  }
});

test('every endpoint card has a clickable example link', async ({ page }) => {
  await page.goto('/api');
  const examples = page.locator('.endpoint a.example');
  await expect(examples).toHaveCount(endpoints.length);
  for (const [index, endpoint] of endpoints.entries()) {
    await expect(examples.nth(index)).toHaveAttribute(
      'href',
      endpoint.example,
    );
  }
});
