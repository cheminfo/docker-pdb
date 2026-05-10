/**
 * Streaming parser for the wwPDB Chemical Component Dictionary (CCD) in
 * mmCIF format. The CCD file (`components.cif`) is a concatenation of
 * thousands of `data_<CODE>` blocks; uncompressed it is around 1 GB, so
 * we never materialize it in memory.
 *
 * `parseCcdMmcif` is an async generator that consumes any async-iterable
 * source of lines (e.g. a `readline.createInterface(...)`) and yields one
 * structured object per chem_comp block:
 *
 *   {
 *     code, name, type, formula,
 *     atoms: [{ id, symbol, charge, x, y, z, aromatic }],
 *     bonds: [{ atom1, atom2, order, aromatic }],
 *   }
 *
 * Coordinates use the *ideal* model (`pdbx_model_Cartn_*_ideal`) which is
 * the canonical idealized geometry stored in CCD. Falls back to the model
 * coordinates when the ideal is missing (some legacy entries).
 */

const ATOM_TAGS = new Set([
  '_chem_comp_atom.atom_id',
  '_chem_comp_atom.type_symbol',
  '_chem_comp_atom.charge',
  '_chem_comp_atom.pdbx_aromatic_flag',
  '_chem_comp_atom.pdbx_model_Cartn_x_ideal',
  '_chem_comp_atom.pdbx_model_Cartn_y_ideal',
  '_chem_comp_atom.pdbx_model_Cartn_z_ideal',
  '_chem_comp_atom.model_Cartn_x',
  '_chem_comp_atom.model_Cartn_y',
  '_chem_comp_atom.model_Cartn_z',
]);

const BOND_TAGS = new Set([
  '_chem_comp_bond.atom_id_1',
  '_chem_comp_bond.atom_id_2',
  '_chem_comp_bond.value_order',
  '_chem_comp_bond.pdbx_aromatic_flag',
]);

/**
 * Tokenize one mmCIF data line into individual values, honoring
 * double-quoted and single-quoted strings (which may contain spaces).
 * @param {string} line - One raw mmCIF line.
 * @returns {string[]} Tokens, with quoted strings collapsed to a single token.
 */
export function tokenizeMmcifLine(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    const character = line[i];
    if (character === ' ' || character === '\t') {
      i++;
      continue;
    }
    if (character === '"' || character === "'") {
      const end = line.indexOf(character, i + 1);
      if (end === -1) {
        tokens.push(line.slice(i + 1));
        return tokens;
      }
      tokens.push(line.slice(i + 1, end));
      i = end + 1;
      continue;
    }
    let end = i;
    while (end < line.length && line[end] !== ' ' && line[end] !== '\t') {
      end++;
    }
    tokens.push(line.slice(i, end));
    i = end;
  }
  return tokens;
}

/**
 * Strip leading/trailing quotes and turn the mmCIF "missing" markers (`.`
 * and `?`) into an empty string.
 * @param {string} value - Raw token value.
 * @returns {string} Cleaned value (`''` if the value was a missing marker).
 */
function cleanValue(value) {
  if (value === '.' || value === '?') return '';
  return value;
}

/**
 * Async generator that parses an async-iterable of mmCIF lines and yields
 * one chem_comp block per `data_<CODE>` section.
 * @param {object} lines - Async iterable of mmCIF lines (typed as `AsyncIterable<string>`; the JSDoc lint rule does not yet recognize the global).
 * @yields {object} One parsed chem_comp block with fields: `code`, `name`, `type`, `formula`, `atoms`, `bonds`.
 */
export async function* parseCcdMmcif(lines) {
  let block = null;
  /** @type {null | 'atom' | 'bond' | 'other'} */
  let loopKind = null;
  /** @type {string[]} */
  let loopColumns = [];

  for await (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('data_')) {
      if (block) yield block;
      block = {
        code: line.slice(5).trim(),
        name: '',
        type: '',
        formula: '',
        atoms: [],
        bonds: [],
      };
      loopKind = null;
      loopColumns = [];
      continue;
    }

    if (!block) continue;

    if (line === '#' || line === '') {
      loopKind = null;
      loopColumns = [];
      continue;
    }

    if (line === 'loop_') {
      loopKind = 'other';
      loopColumns = [];
      continue;
    }

    if (line.startsWith('_chem_comp.')) {
      handleScalar(block, line);
      continue;
    }

    if (line.startsWith('_')) {
      // We are inside (or starting) a loop_ block — record the column tag.
      if (loopKind === null) loopKind = 'other';
      loopColumns.push(line.trim());
      if (loopColumns.some((tag) => ATOM_TAGS.has(tag))) {
        loopKind = 'atom';
      } else if (loopColumns.some((tag) => BOND_TAGS.has(tag))) {
        loopKind = 'bond';
      }
      continue;
    }

    if (loopKind === 'atom') {
      addAtom(block, loopColumns, line);
    } else if (loopKind === 'bond') {
      addBond(block, loopColumns, line);
    }
    // Unknown loop rows or stray data are ignored.
  }

  if (block) yield block;
}

/**
 * Parse a `_chem_comp.<key>  <value>` line into the block.
 * @param {object} block - Block currently being populated.
 * @param {string} line - mmCIF line of the form `_chem_comp.<key> <value>`.
 */
function handleScalar(block, line) {
  const tokens = tokenizeMmcifLine(line);
  if (tokens.length < 2) return;
  const tag = tokens[0];
  const value = cleanValue(tokens.slice(1).join(' '));
  if (tag === '_chem_comp.name') block.name = value;
  else if (tag === '_chem_comp.type') block.type = value;
  else if (tag === '_chem_comp.formula') block.formula = value;
}

/**
 * Append one atom row to the current block.
 * @param {object} block - Block currently being populated.
 * @param {string[]} columns - Column tags of the active loop, in source order.
 * @param {string} line - One data row of the loop.
 */
function addAtom(block, columns, line) {
  const tokens = tokenizeMmcifLine(line);
  if (tokens.length !== columns.length) return;
  const lookup = (tag) => {
    const i = columns.indexOf(tag);
    return i === -1 ? '' : cleanValue(tokens[i]);
  };
  const id = lookup('_chem_comp_atom.atom_id');
  const symbol = lookup('_chem_comp_atom.type_symbol');
  if (!id || !symbol) return;
  const xIdeal = lookup('_chem_comp_atom.pdbx_model_Cartn_x_ideal');
  const yIdeal = lookup('_chem_comp_atom.pdbx_model_Cartn_y_ideal');
  const zIdeal = lookup('_chem_comp_atom.pdbx_model_Cartn_z_ideal');
  const xModel = lookup('_chem_comp_atom.model_Cartn_x');
  const yModel = lookup('_chem_comp_atom.model_Cartn_y');
  const zModel = lookup('_chem_comp_atom.model_Cartn_z');
  block.atoms.push({
    id,
    symbol,
    charge: Number.parseInt(lookup('_chem_comp_atom.charge') || '0', 10),
    x: Number.parseFloat(xIdeal || xModel || '0'),
    y: Number.parseFloat(yIdeal || yModel || '0'),
    z: Number.parseFloat(zIdeal || zModel || '0'),
    aromatic:
      lookup('_chem_comp_atom.pdbx_aromatic_flag').toUpperCase() === 'Y',
  });
}

/**
 * Append one bond row to the current block.
 * @param {object} block - Block currently being populated.
 * @param {string[]} columns - Column tags of the active loop, in source order.
 * @param {string} line - One data row of the loop.
 */
function addBond(block, columns, line) {
  const tokens = tokenizeMmcifLine(line);
  if (tokens.length !== columns.length) return;
  const lookup = (tag) => {
    const i = columns.indexOf(tag);
    return i === -1 ? '' : cleanValue(tokens[i]);
  };
  const atom1 = lookup('_chem_comp_bond.atom_id_1');
  const atom2 = lookup('_chem_comp_bond.atom_id_2');
  if (!atom1 || !atom2) return;
  block.bonds.push({
    atom1,
    atom2,
    order: lookup('_chem_comp_bond.value_order').toUpperCase() || 'SING',
    aromatic:
      lookup('_chem_comp_bond.pdbx_aromatic_flag').toUpperCase() === 'Y',
  });
}
