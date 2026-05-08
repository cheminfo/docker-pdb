// Smoke test: navigate to /animate on the live dev server, run each scene
// in turn, and report any errors surfaced by the page's error panel.
import { chromium } from 'playwright-core';

const BASE_URL = process.env.ANIMATE_URL ?? 'http://localhost:5176/animate';
const SCENES = [
  'Global view',
  'Display helix',
  'Display β-sheet',
  'Ramachandran',
  'Interaction 3.5 Å',
];

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
});
const context = await browser.newContext();
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

console.log(`→ Loading ${BASE_URL}`);
await page.goto(BASE_URL, { waitUntil: 'networkidle' });

// Wait for the Run button to become enabled (signals viewer + colorModule ready)
const runButton = page.locator('button.animate-run-btn');
await runButton.waitFor({ state: 'visible', timeout: 30_000 });
for (let attempt = 0; attempt < 60; attempt++) {
  if (!(await runButton.isDisabled())) break;
  await page.waitForTimeout(500);
}
if (await runButton.isDisabled()) {
  console.log('✗ Run button never became enabled — viewer did not initialize');
  await browser.close();
  process.exit(1);
}
console.log('✓ Viewer + colorModule ready');

let allPassed = true;
for (const sceneLabel of SCENES) {
  console.log(`\n→ Scene: ${sceneLabel}`);
  // Click the scene button to load the script into the editor
  await page.getByRole('button', { name: sceneLabel }).first().click();
  // Click Run
  await runButton.click();
  // Wait for it to leave the "Running…" state
  for (let attempt = 0; attempt < 60; attempt++) {
    const text = (await runButton.textContent())?.trim();
    if (text === 'Run') break;
    await page.waitForTimeout(500);
  }
  // Give async work a beat to settle
  await page.waitForTimeout(800);

  const errorPanel = page.locator('.animate-error');
  const hasError = (await errorPanel.count()) > 0;
  if (hasError) {
    const errorText = (await errorPanel.first().textContent())?.trim();
    console.log(`  ✗ FAILED — ${errorText}`);
    allPassed = false;
  } else {
    console.log(`  ✓ ran without error`);
  }

  // Reset between scenes for a clean slate
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.waitForTimeout(300);
}

if (consoleErrors.length > 0) {
  console.log(`\n--- ${consoleErrors.length} console error(s) seen ---`);
  for (const error of consoleErrors.slice(0, 10)) {
    console.log(`  ${error.split('\n')[0]}`);
  }
}

await page.screenshot({ path: 'animate-smoke.png', fullPage: false });
console.log('\nScreenshot: frontend/animate-smoke.png');
await browser.close();
process.exit(allPassed ? 0 : 1);
