import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import pymol from '../pymol.js';

// Requires the `pymol` and `gm` binaries to be installed.
// Set HAS_PYMOL=1 to run this test locally.
test.skipIf(!process.env.HAS_PYMOL)('should work', async () => {
  const pdb = readFileSync(join(import.meta.dirname, '1O8O.pdb'), 'utf8');
  const result = await pymol('aaaa', pdb);

  expect(result.length).toBeGreaterThan(28700);
});
