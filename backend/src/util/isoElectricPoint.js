// pkN  : pKa of the N-terminal amino acid (NH3+)
// pkC  : pKa of the C-terminal amino acid (COOH)
// pkSCb: pKa of the side chain positively charged
// pkSC : pKa of the neutral side chain
// source: http://upload.wikimedia.org/wikipedia/commons/a/a9/Amino_Acids.svg

const pKaAA = {
  ALA: { pkN: 9.71, pkC: 2.33 },
  ARG: { pkN: 9, pkC: 2.03, pkSCb: 12.1 },
  ASN: { pkN: 8.76, pkC: 2.16 },
  ASP: { pkN: 9.66, pkC: 1.95, pkSC: 3.71 },
  CYS: { pkN: 10.28, pkC: 1.91, pkSC: 8.14 },
  GLU: { pkN: 9.58, pkC: 2.16, pkSC: 4.15 },
  GLN: { pkN: 9, pkC: 2.18 },
  GLY: { pkN: 9.58, pkC: 2.34 },
  HIS: { pkN: 9.09, pkC: 1.7, pkSCb: 6.04 },
  ILE: { pkN: 9.6, pkC: 2.26 },
  LEU: { pkN: 9.58, pkC: 2.32 },
  LYS: { pkN: 9.16, pkC: 2.15, pkSCb: 10.67 },
  MET: { pkN: 9.08, pkC: 2.16 },
  PHE: { pkN: 9.09, pkC: 2.18 },
  PRO: { pkN: 10.47, pkC: 1.95 },
  SER: { pkN: 9.05, pkC: 2.13 },
  THR: { pkN: 8.96, pkC: 2.2 },
  TRP: { pkN: 9.34, pkC: 2.38 },
  TYR: { pkN: 9.04, pkC: 2.24, pkSC: 10.1 },
  VAL: { pkN: 9.52, pkC: 2.27 },
};

// inspired by: http://isoelectric.ovh.org/files/practise-isoelectric-point.html#mozTocId763352

export function getChart(aas) {
  const combined = simplify(aas);
  if (!combined) return undefined;
  const y = [];
  const yAbs = [];
  for (let i = 0; i <= 14; i += 0.01) {
    const charge = calculateForPh(combined, i);
    y.push(charge);
    yAbs.push(Math.abs(charge));
  }
  combined.y = y;
  combined.yAbs = yAbs;
  return combined;
}

export function getCharge(aas, pH = 7) {
  const combined = simplify(aas);
  if (!combined) return undefined;
  const charge = calculateForPh(combined, pH);
  return Math.round(charge * 1000) / 1000;
}

export function getIEP(aas) {
  const combined = simplify(aas);
  if (!combined) return undefined;
  let first = 0;
  let last = 14;
  let current = 14;
  let previous = 0;

  while (Math.abs(current - previous) > 0.0001) {
    previous = current;
    current = (last + first) / 2;
    const currentCharge = calculateForPh(combined, current);
    if (currentCharge > 0) {
      first = current;
    } else if (currentCharge < 0) {
      last = current;
    } else {
      previous = current;
    }
  }
  return Math.round(current * 1000) / 1000;
}

function calculateForPh(combined, pH) {
  let total = 0;
  total += 1 / (1 + 10 ** (pH - combined.first));
  total += -1 / (1 + 10 ** (combined.last - pH));
  for (const key in combined.acid) {
    total += -combined.acid[key] / (1 + 10 ** (pKaAA[key].pkSC - pH));
  }
  for (const key in combined.basic) {
    total += combined.basic[key] / (1 + 10 ** (pH - pKaAA[key].pkSCb));
  }
  return total;
}

function simplify(aas) {
  const combined = {};
  if (pKaAA[aas[0]]) {
    combined.first = pKaAA[aas[0]].pkN;
  } else {
    return undefined;
  }
  if (pKaAA[aas.at(-1)]) {
    combined.last = pKaAA[aas.at(-1)].pkC;
  } else {
    return undefined;
  }
  combined.basic = {};
  combined.acid = {};
  for (const aa of aas) {
    if (!pKaAA[aa]) return undefined;
    if (pKaAA[aa].pkSCb) {
      if (!combined.basic[aa]) combined.basic[aa] = 0;
      combined.basic[aa]++;
    }
  }
  for (const aa of aas) {
    if (!pKaAA[aa]) return undefined;
    if (pKaAA[aa].pkSC) {
      if (!combined.acid[aa]) combined.acid[aa] = 0;
      combined.acid[aa]++;
    }
  }
  return combined;
}

export default { getCharge, getIEP, getChart };
