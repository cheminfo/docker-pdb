/**
 * Split a stream of CIF lines into one text block per `data_XXX` section.
 *
 * The CCD archive concatenates ~30k chem_comp entries into a single file,
 * each introduced by a `data_<code>` line. Blocks are yielded as raw text
 * so the caller can hand each one to `moleculeFromCif` without ever holding
 * the whole 100+ MB archive in memory.
 * @param {AsyncIterable<string>} lines - Lines of a CIF file, in order.
 * @yields {string} Raw CIF text for one `data_XXX` block.
 */
export async function* splitCifBlocks(lines) {
  let blockLines = [];
  for await (const line of lines) {
    // A `data_` line opens a new block; flush the one it terminates.
    if (line.startsWith('data_') && blockLines.length > 0) {
      yield blockLines.join('\n');
      blockLines = [line];
    } else {
      blockLines.push(line);
    }
  }
  if (blockLines.length > 0) yield blockLines.join('\n');
}
