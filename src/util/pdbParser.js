import { getIEP } from './isoElectricPoint.js';

let lines;
let result;
let hetnames;
let compounds;
let compoundsArray;
let helices;
let sheets;

const aa = {
  ALA: true,
  ARG: true,
  ASN: true,
  ASP: true,
  CYS: true,
  GLU: true,
  GLN: true,
  GLY: true,
  HIS: true,
  ILE: true,
  LEU: true,
  LYS: true,
  MET: true,
  PHE: true,
  PRO: true,
  SER: true,
  THR: true,
  TRP: true,
  TYR: true,
  VAL: true,
};
const atomMass = {
  np: 237.0482,
  no: 259,
  gd: 157.25212,
  ge: 72.61276,
  ga: 69.72307,
  fm: 257,
  fr: 223,
  xe: 131.29248,
  os: 190.22486,
  hf: 178.48497,
  hg: 200.59915,
  he: 4.0026,
  pd: 106.41533,
  pa: 231.03588,
  pb: 207.21689,
  pm: 145,
  po: 209,
  dy: 162.49703,
  lr: 260,
  lu: 174.96672,
  md: 258,
  mg: 24.30505,
  mn: 54.93805,
  f: 18.9984,
  eu: 151.96437,
  mo: 95.93129,
  b: 10.81103,
  c: 12.01074,
  n: 14.00674,
  o: 15.9994,
  k: 39.0983,
  fe: 55.84515,
  h: 1.00794,
  i: 126.90447,
  w: 183.84178,
  v: 50.94147,
  u: 238.02891,
  na: 22.98977,
  nb: 92.90638,
  s: 32.06608,
  nd: 144.23613,
  ne: 20.18005,
  p: 30.97376,
  ni: 58.69336,
  es: 252,
  er: 167.2563,
  y: 88.90585,
  tm: 168.93421,
  tl: 204.38332,
  ca: 40.07802,
  te: 127.60313,
  br: 79.90353,
  ti: 47.86675,
  th: 232.03805,
  tb: 158.92534,
  bk: 247,
  tc: 98,
  ta: 180.94788,
  bi: 208.98038,
  be: 9.01218,
  sn: 118.71011,
  sm: 150.36634,
  sr: 87.61665,
  sc: 44.95591,
  kr: 83.79933,
  se: 78.95939,
  cu: 63.54564,
  cs: 132.90545,
  si: 28.08541,
  li: 6.94004,
  cr: 51.99614,
  co: 58.9332,
  cm: 247,
  cl: 35.45254,
  sb: 121.75979,
  la: 138.90545,
  ru: 101.06495,
  ce: 140.11572,
  cf: 251,
  cd: 112.41155,
  rn: 222,
  rh: 102.9055,
  re: 186.20671,
  ho: 164.93032,
  rb: 85.46766,
  ra: 226.0254,
  zr: 91.22365,
  zn: 65.39557,
  ir: 192.21605,
  ba: 137.32689,
  yb: 173.03769,
  at: 210,
  as: 74.9216,
  ar: 39.94768,
  in: 114.81809,
  au: 196.96655,
  al: 26.98154,
  am: 243,
  pt: 195.07779,
  ac: 227.0278,
  pu: 244,
  ag: 107.86815,
  pr: 140.90765,
};

export function parse(pdb) {
  hetnames = {};
  compounds = {};
  helices = [];
  sheets = [];
  compoundsArray = [];
  lines = pdb.split(/[\r\n]/);
  result = {
    chain: {},
    title: '',
    formula: [],
    helices,
    sheets,
    nbModifiedResidues: 0,
  };

  for (const line of lines) {
    const field = line.slice(0, 6);
    if (field === 'SEQRES') {
      addSeqres(line);
    } else if (field === 'TITLE ') {
      title(line);
    } else if (field === 'EXPDTA') {
      result.experiment = line.trim().replace(/EXPDTA *(.*)/, '$1');
    } else if (field === 'HEADER') {
      result.year = line.slice(57, 59) * 1;
      if (result.year < 50) {
        result.year += 2000;
      } else {
        result.year += 1900;
      }
    } else if (field === 'FORMUL') {
      addFormula(line);
    } else if (field === 'HETNAM') {
      addHetnam(line);
    } else if (field === 'COMPND') {
      addCompound(line);
    } else if (field === 'HELIX ') {
      addHelix(line);
    } else if (field === 'SHEET ') {
      addSheet(line);
    } else if (field === 'MODRES') {
      addModres();
    }
  }

  addStats();

  return result;
}

function addModres() {
  result.nbModifiedResidues++;
}

function addHelix(line) {
  const chain = line.slice(19, 20).trim();
  const first = line.slice(21, 25) * 1;
  const last = line.slice(33, 37) * 1;
  const kind = line.slice(38, 40) * 1;
  helices.push({ chain, from: first, to: last, kind });
}

function addSheet(line) {
  const chain = line.slice(21, 22).trim();
  const first = line.slice(22, 26) * 1;
  const last = line.slice(33, 37) * 1;
  sheets.push({ chain, from: first, to: last });
}

function calculateFormula(label, formula) {
  const parts = formula.split(' ');
  let mw = 0;
  let mf = '';
  for (const part of parts) {
    const atom = part.replace(/[0-9]+/, '');
    const number = part.replace(/[^0-9]*/, '') * 1;
    if (atomMass[atom.toLowerCase()]) {
      mw += atomMass[atom.toLowerCase()] * number;
    }
    mf += atom.slice(0, 1);
    mf += atom.slice(1).toLowerCase();
    if (number > 1) {
      mf += number;
    }
  }
  const toReturn = { label, mf, mw: mw.toFixed(3) };
  if (hetnames[label]) {
    toReturn.name = hetnames[label];
  }
  return toReturn;
}

function addFormula(line) {
  const label = line.slice(12, 15).trim();
  let mf = line.slice(19, 70).trim();
  let number = 1;
  if (mf.includes('(')) {
    number = mf.replace(/\(.*/, '') * 1;
  }
  mf = mf.replace(/.*\(/, '').replace(/\).*/, '');
  const formula = calculateFormula(label, mf);
  formula.number = number;
  result.formula.push(formula);
}

function title(line) {
  if (result.title) {
    result.title += ' ';
  }
  result.title += line.slice(10).trim();
}

function addSeqres(line) {
  if (Object.keys(compounds).length === 0) {
    analyseCompounds();
  }
  const chain = line.slice(10, 12).trim();
  const nbResidues = line.slice(14, 18) * 1;
  const residues = line.slice(19, 70).trim().split(/ +/);

  if (!result.chain[chain]) {
    result.chain[chain] = compounds[chain];
    if (!result.chain[chain]) {
      result.chain[chain] = {};
    }
    result.chain[chain].nbResidues = nbResidues;
    result.chain[chain].residues = [];
  }
  result.chain[chain].residues = result.chain[chain].residues.concat(residues);
}

function addHetnam(line) {
  const residue = line.slice(11, 14).trim();
  const name = line.slice(15, 70).trim();

  if (hetnames[residue]) {
    hetnames[residue] += ' ';
  } else {
    hetnames[residue] = '';
  }
  hetnames[residue] += name;
}

function addCompound(line) {
  compoundsArray.push(line.slice(10).trim());
}

function analyseCompounds() {
  let current = null;
  for (const rawLine of compoundsArray) {
    const label = rawLine.replace(/:.*/, '').replace(/;$/, '');
    const value = rawLine.replace(/^[^ ]* /, '').replace(/;$/, '');

    if (label === 'MOL_ID') {
      current = { id: value };
    } else if (label === 'CHAIN' && current) {
      const chains = value.split(',');
      for (const chain of chains) {
        compounds[chain] = current;
      }
    } else if (label === 'MOLECULE' && current) {
      current.molecule = value;
    } else if (label === 'SYNONYM' && current) {
      current.synonym = value;
    } else if (label === 'EC' && current) {
      current.ec = value;
    }
  }
}

function addStats() {
  const residueStats = {};
  let totalResidues = 0;
  let totalChains = 0;
  const allResidues = [];
  for (const key in result.chain) {
    const chain = result.chain[key];
    totalResidues += chain.nbResidues;
    totalChains++;
    for (const residue of chain.residues) {
      allResidues.push(residue);
      if (!residueStats[residue]) {
        residueStats[residue] = 0;
      }
      residueStats[residue]++;
    }
    chain.iep = getIEP(chain.residues);
    delete chain.residues;
  }
  result.residueStats = residueStats;
  result.iep = getIEP(allResidues);

  const percentageAA = {};
  let totalAA = 0;
  for (const key in aa) {
    percentageAA[key] = 0;
  }
  for (const key in residueStats) {
    if (aa[key]) percentageAA[key] = residueStats[key];
    totalAA += residueStats[key];
  }
  for (const key in percentageAA) {
    percentageAA[key] = Math.round((percentageAA[key] / totalAA) * 1000) / 1000;
  }
  result.percentageAA = percentageAA;
  result.nbResidues = totalResidues;
  result.nbChains = totalChains;
}

export default { parse };
