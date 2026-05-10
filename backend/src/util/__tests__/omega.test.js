import { expect, test } from 'vitest';

import { addOmegaStats } from '../omega.js';

function atomLine({ serial, atom, resName, chain, resSeq, x, y, z }) {
  // Hand-built ATOM record. Atom names get a leading space (cols 13–16)
  // so that single- and double-letter elements (`N`, `CA`, `C`) sit in
  // the position the parser slices on.
  const ser = String(serial).padStart(5);
  const atomCol = ` ${atom}`.padEnd(4);
  const seq = String(resSeq).padStart(4);
  const xs = x.toFixed(3).padStart(8);
  const ys = y.toFixed(3).padStart(8);
  const zs = z.toFixed(3).padStart(8);
  return `ATOM  ${ser} ${atomCol} ${resName.padEnd(3)} ${chain}${seq}    ${xs}${ys}${zs}`;
}

function backbone(resName, chain, resSeq, ca, c, n, baseSerial = 1) {
  return [
    atomLine({
      serial: baseSerial,
      atom: 'N',
      resName,
      chain,
      resSeq,
      x: n[0],
      y: n[1],
      z: n[2],
    }),
    atomLine({
      serial: baseSerial + 1,
      atom: 'CA',
      resName,
      chain,
      resSeq,
      x: ca[0],
      y: ca[1],
      z: ca[2],
    }),
    atomLine({
      serial: baseSerial + 2,
      atom: 'C',
      resName,
      chain,
      resSeq,
      x: c[0],
      y: c[1],
      z: c[2],
    }),
  ];
}

test('addOmegaStats counts a textbook trans peptide bond', () => {
  // Coplanar trans layout: ω(CA1, C1, N2, CA2) = 180°.
  const lines = [
    ...backbone('ALA', 'A', 1, [0, 1, 0], [0, 0, 0], [0, 2, 0], 1),
    ...backbone('GLY', 'A', 2, [1, -1, 0], [2, -1, 0], [1, 0, 0], 4),
  ];
  const result = {};
  addOmegaStats(result, lines);

  expect(result.omega).toMatchObject({
    nbPeptideBonds: 1,
    nbTrans: 1,
    nbCis: 0,
    nbTwisted: 0,
    cisBonds: [],
    twistedBonds: [],
    pairCounts: { 'ALA:GLY': 1 },
  });
});

test('addOmegaStats counts a textbook cis peptide bond and records the pair', () => {
  // Coplanar cis layout: ω(CA1, C1, N2, CA2) = 0°. Bias the second residue
  // to PRO since cis bonds are almost always X–PRO in real structures.
  const lines = [
    ...backbone('ALA', 'A', 1, [0, 1, 0], [0, 0, 0], [0, 2, 0], 1),
    ...backbone('PRO', 'A', 2, [1, 1, 0], [2, 1, 0], [1, 0, 0], 4),
  ];
  const result = {};
  addOmegaStats(result, lines);

  expect(result.omega.nbCis).toBe(1);
  expect(result.omega.nbTrans).toBe(0);
  expect(result.omega.cisBonds).toStrictEqual([
    {
      chain: 'A',
      residue1: 'ALA',
      residue2: 'PRO',
      position1: 1,
      position2: 2,
      omega: 0,
    },
  ]);
});

test('addOmegaStats does not bridge a chain break', () => {
  // Two separate one-residue chains: no peptide bond can form.
  const lines = [
    ...backbone('ALA', 'A', 1, [0, 1, 0], [0, 0, 0], [0, 2, 0], 1),
    ...backbone('GLY', 'B', 1, [10, 1, 0], [10, 0, 0], [10, 2, 0], 4),
  ];
  const result = {};
  addOmegaStats(result, lines);

  expect(result.omega.nbPeptideBonds).toBe(0);
  expect(result.omega.cisBonds).toStrictEqual([]);
  expect(result.omega.twistedBonds).toStrictEqual([]);
});

test('addOmegaStats classifies an intermediate (twisted) bond', () => {
  // Skewed layout: omega close to 90°, between cis and trans thresholds.
  const lines = [
    ...backbone('ALA', 'A', 1, [0, 1, 0], [0, 0, 0], [0, 2, 0], 1),
    ...backbone('GLY', 'A', 2, [1, 0, -1], [2, 0, -1], [1, 0, 0], 4),
  ];
  const result = {};
  addOmegaStats(result, lines);

  expect(result.omega.nbTwisted).toBe(1);
  expect(result.omega.twistedBonds).toHaveLength(1);
});
