const CIS_THRESHOLD = 30;
const TRANS_THRESHOLD = 150;
// Squared distance (Å²). Typical C–N peptide bond is ~1.33 Å; 2.0 Å is a generous
// upper bound that excludes chain breaks and inter-chain atoms.
const PEPTIDE_BOND_MAX_DISTANCE_SQUARED = 4;
const STANDARD_AA = new Set([
  'ALA',
  'ARG',
  'ASN',
  'ASP',
  'CYS',
  'GLU',
  'GLN',
  'GLY',
  'HIS',
  'ILE',
  'LEU',
  'LYS',
  'MET',
  'PHE',
  'PRO',
  'SER',
  'THR',
  'TRP',
  'TYR',
  'VAL',
]);

/**
 * Compute backbone ω (omega) torsions and add a summary to `result`.
 *
 * The ω angle is the dihedral CA(i) – C(i) – N(i+1) – CA(i+1). It is normally
 * close to ±180° (trans). Values close to 0° are cis amide bonds, almost always
 * found before a proline. Anything between is a distorted/twisted bond.
 *
 * Only the first MODEL (or the file as a single implicit model) is considered,
 * and only altLoc ' ' or 'A' atoms are used.
 * @param {object} result - Parser result. Mutated to add `result.omega`.
 * @param {string[]} lines - Raw PDB lines (already split).
 * @returns {void}
 */
export function addOmegaStats(result, lines) {
  const residues = collectBackbone(lines);
  const pairCounts = {};
  const summary = {
    nbPeptideBonds: 0,
    nbCis: 0,
    nbTrans: 0,
    nbTwisted: 0,
    cisBonds: [],
    twistedBonds: [],
    pairCounts,
  };

  for (let i = 0; i < residues.length - 1; i++) {
    const a = residues[i];
    const b = residues[i + 1];
    if (a.chain !== b.chain) continue;
    if (!a.CA || !a.C || !b.N || !b.CA) continue;
    if (distanceSquared(a.C, b.N) > PEPTIDE_BOND_MAX_DISTANCE_SQUARED) continue;

    const omega = dihedral(a.CA, a.C, b.N, b.CA);
    const absOmega = Math.abs(omega);
    summary.nbPeptideBonds++;

    if (STANDARD_AA.has(a.resName) && STANDARD_AA.has(b.resName)) {
      const key = `${a.resName}:${b.resName}`;
      pairCounts[key] = (pairCounts[key] || 0) + 1;
    }

    const bond = {
      chain: a.chain,
      residue1: a.resName,
      residue2: b.resName,
      position1: a.resSeq,
      position2: b.resSeq,
      omega: roundOmega(omega),
    };

    if (absOmega >= TRANS_THRESHOLD) {
      summary.nbTrans++;
    } else if (absOmega <= CIS_THRESHOLD) {
      summary.nbCis++;
      summary.cisBonds.push(bond);
    } else {
      summary.nbTwisted++;
      summary.twistedBonds.push(bond);
    }
  }

  result.omega = summary;
}

function collectBackbone(lines) {
  const residues = [];
  let current = null;
  let modelDone = false;
  for (const line of lines) {
    const field = line.slice(0, 6);
    if (field === 'ENDMDL') {
      if (residues.length > 0) {
        modelDone = true;
        break;
      }
      continue;
    }
    if (modelDone) break;
    if (field !== 'ATOM  ') continue;

    const altLoc = line[16];
    if (altLoc !== ' ' && altLoc !== 'A') continue;
    const atomName = line.slice(12, 16).trim();
    if (atomName !== 'N' && atomName !== 'CA' && atomName !== 'C') continue;

    const resName = line.slice(17, 20).trim();
    const chain = line.slice(21, 22).trim();
    const resSeq = Number.parseInt(line.slice(22, 26), 10);
    const iCode = line[26];
    const coordinates = [
      Number.parseFloat(line.slice(30, 38)),
      Number.parseFloat(line.slice(38, 46)),
      Number.parseFloat(line.slice(46, 54)),
    ];

    if (
      !current ||
      current.chain !== chain ||
      current.resSeq !== resSeq ||
      current.iCode !== iCode ||
      current.resName !== resName
    ) {
      current = { chain, resSeq, iCode, resName };
      residues.push(current);
    }
    current[atomName] = coordinates;
  }
  return residues;
}

function dihedral(p1, p2, p3, p4) {
  const b1 = subtract(p2, p1);
  const b2 = subtract(p3, p2);
  const b3 = subtract(p4, p3);
  const n1 = cross(b1, b2);
  const n2 = cross(b2, b3);
  const m = cross(n1, normalize(b2));
  const x = dot(n1, n2);
  const y = dot(m, n2);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v) {
  const length = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
}

function distanceSquared(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function roundOmega(omega) {
  return Math.round(omega * 100) / 100;
}
