import { defineConfig, devices } from '@playwright/test';

const PORT = 5179;
const API_PORT = Number(process.env.PORT ?? 31015);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // The pages read the API through the dev server's proxy, so the backend has
  // to be up too: without it every data-backed panel renders its empty state
  // and the failure reads as a UI bug.
  webServer: [
    {
      command: 'npm run dev -w backend',
      cwd: '..',
      url: `http://localhost:${API_PORT}/v1/stats/byYear`,
      reuseExistingServer: true,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: `npm run dev -- --port ${PORT} --strictPort`,
      url: baseURL,
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
