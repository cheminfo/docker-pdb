import { test, expect } from 'vitest';

import { getCharge, getChart, getIEP } from '../isoElectricPoint.js';

test('getIEP of a basic peptide (LYS-rich) is above neutral pH', () => {
  // Heavy lysine bias: high pkSCb pushes the IEP toward 11+.
  const iep = getIEP(['LYS', 'LYS', 'ALA']);
  expect(iep).toBeGreaterThan(10);
  expect(iep).toBeLessThan(12);
});

test('getIEP of an acidic peptide (ASP/GLU-rich) is well below neutral pH', () => {
  const iep = getIEP(['ASP', 'GLU', 'ASP', 'GLU']);
  expect(iep).toBeGreaterThan(2);
  expect(iep).toBeLessThan(5);
});

test('getCharge at the IEP is approximately zero', () => {
  const aas = ['ALA', 'GLY', 'LYS', 'ASP', 'TYR'];
  const iep = getIEP(aas);
  expect(Math.abs(getCharge(aas, iep))).toBeLessThan(0.05);
});

test('getCharge below the IEP is positive, above the IEP is negative', () => {
  const aas = ['LYS', 'ALA', 'GLY'];
  const iep = getIEP(aas);
  expect(getCharge(aas, iep - 2)).toBeGreaterThan(0);
  expect(getCharge(aas, iep + 2)).toBeLessThan(0);
});

test('unknown amino acid codes make the helpers return undefined', () => {
  expect(getIEP(['ALA', 'XYZ', 'GLY'])).toBeUndefined();
  expect(getCharge(['XYZ', 'ALA'])).toBeUndefined();
  expect(getChart(['XYZ', 'ALA'])).toBeUndefined();
});

test('getChart returns a 1401-point sweep over pH 0 — 14', () => {
  const chart = getChart(['ALA', 'GLY']);
  expect(chart).toBeDefined();
  expect(chart.y).toHaveLength(1401);
  expect(chart.yAbs).toHaveLength(1401);
  // The chart's |charge| array is monotonically related to its sign
  // around the IEP; the minimum should be very close to zero.
  expect(Math.min(...chart.yAbs)).toBeLessThan(0.05);
});
