/** Subset of PDB header fields rendered in the "last imported entry" card. */
export interface PdbHeaderInfo {
  /** First keyword line of the HEADER record, e.g. "HYDROLASE/HYDROLASE INHIBITOR". */
  classification?: string;
  /** Deposition date as it appears in HEADER (DD-MMM-YY). */
  depositionDate?: string;
  /** Distinct ORGANISM_SCIENTIFIC values found in SOURCE records. */
  sourceOrganisms: string[];
  /** Joined AUTHOR records, e.g. "DOE, J., SMITH, A.". */
  authors?: string;
  /** Raw resolution from REMARK 2 (e.g. "1.85 ANGSTROMS") if present. */
  resolution?: string;
}

/**
 * Extract a small set of human-readable header fields from the raw PDB text.
 * The parsed sqlite document already exposes `title`, `experiment`, `year`,
 * `chain`, and `formula`; this helper covers the few fields that are not
 * persisted in sqlite but are useful in the home-page summary card.
 * @param pdb - Raw PDB-format text.
 * @returns Extracted header fields (`sourceOrganisms` is always defined).
 */
export function parsePdbHeader(pdb: string): PdbHeaderInfo {
  const info: PdbHeaderInfo = { sourceOrganisms: [] };
  const sourceLines: string[] = [];
  const authorLines: string[] = [];
  for (const line of pdb.split(/\r?\n/)) {
    const field = line.slice(0, 6);
    if (field === 'ATOM  ' || field === 'HETATM') break;
    if (field === 'HEADER') {
      const classification = line.slice(10, 50).trim();
      const date = line.slice(50, 59).trim();
      if (classification) info.classification = classification;
      if (date) info.depositionDate = date;
    } else if (field === 'SOURCE') {
      sourceLines.push(line.slice(10).trim());
    } else if (field === 'AUTHOR') {
      authorLines.push(line.slice(10).trim());
    } else if (
      field === 'REMARK' &&
      line.slice(7, 10).trim() === '2' &&
      line.includes('RESOLUTION.')
    ) {
      const match = /RESOLUTION\.\s+([0-9.]+\s+\w+)/i.exec(line);
      if (match) info.resolution = match[1];
    }
  }

  const organisms = new Set<string>();
  for (const raw of sourceLines.join(' ').split(';')) {
    const match = /ORGANISM_SCIENTIFIC:\s*(.+)$/i.exec(raw.trim());
    if (match?.[1]) organisms.add(match[1].trim());
  }
  info.sourceOrganisms = [...organisms];

  if (authorLines.length > 0) {
    info.authors = authorLines.join(' ').replaceAll(/\s+/g, ' ').trim();
  }

  return info;
}
