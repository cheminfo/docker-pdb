/* eslint-disable camelcase --
   Keys mirror the snake_case SQL column names ss_index0…ss_index7 so callers
   can spread the result directly into prepared-statement bindings. */

/** Number of BigInt64 values in the substructure-search index. */
const SS_INDEX_LENGTH = 8;

/**
 * Compute the substructure-search index for a molecule.
 *
 * OpenChemLib's molecule index is a 16-element Uint32Array (512 bits). We
 * reinterpret the underlying buffer as 8 signed BigInt64 values so they
 * fit one-per-column in SQLite INTEGER columns (which are 64-bit signed
 * integers). The first phase of substructure search then becomes a
 * bitwise `(ss_indexN & ?) = ?` filter over those columns.
 * @param {import('openchemlib').Molecule} molecule - OCL molecule.
 * @returns {{
 *   ss_index0: bigint, ss_index1: bigint, ss_index2: bigint, ss_index3: bigint,
 *   ss_index4: bigint, ss_index5: bigint, ss_index6: bigint, ss_index7: bigint,
 * }} The 8 BigInt64 fingerprint values keyed by SQL column name.
 */
export function computeSSIndex(molecule) {
  const index = Uint32Array.from(molecule.getIndex());
  const view = new BigInt64Array(index.buffer);
  if (view.length < SS_INDEX_LENGTH) {
    throw new Error(
      `Expected at least ${SS_INDEX_LENGTH} BigInt64 values, got ${view.length}`,
    );
  }
  return {
    ss_index0: view[0],
    ss_index1: view[1],
    ss_index2: view[2],
    ss_index3: view[3],
    ss_index4: view[4],
    ss_index5: view[5],
    ss_index6: view[6],
    ss_index7: view[7],
  };
}
