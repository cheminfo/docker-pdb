import { globals } from 'eslint-config-zakodium';
import jsdoc from 'eslint-config-zakodium/jsdoc';
import js from 'eslint-config-zakodium/js';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';
import unicorn from 'eslint-config-zakodium/unicorn';
import vitest from 'eslint-config-zakodium/vitest';
import vitestTs from 'eslint-config-zakodium/vitest-ts';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores([
    '**/coverage',
    '**/dist',
    '**/data',
    'backend/public',
    // Playwright drivers run outside the app and are checked by the e2e run.
    'frontend/e2e',
    'frontend/playwright.config.ts',
    'frontend/animate-smoke.mjs',
    'frontend/playwright-report',
    'frontend/test-results',
  ]),
  unicorn,
  // The backend is plain JavaScript; the frontend is TypeScript + React.
  {
    files: ['backend/**'],
    extends: [js, jsdoc, vitest],
    languageOptions: { globals: { ...globals.nodeBuiltin } },
  },
  {
    files: ['frontend/**'],
    extends: [ts, react, vitestTs],
  },
);
