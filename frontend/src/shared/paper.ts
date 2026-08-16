import type { Reference } from 'react-cheminfo/core';

/**
 * The archive this site serves. It is the founding Protein Data Bank paper,
 * the one the wwPDB lists among the references any downstream use must carry;
 * the About page lists the two others alongside it.
 */
export const PAPER: Reference = {
  authors: [
    { given: 'H. M.', family: 'Berman' },
    { given: 'J.', family: 'Westbrook' },
    { given: 'Z.', family: 'Feng' },
    { given: 'G.', family: 'Gilliland' },
    { given: 'T. N.', family: 'Bhat' },
    { given: 'H.', family: 'Weissig' },
    { given: 'I. N.', family: 'Shindyalov' },
    { given: 'P. E.', family: 'Bourne' },
  ],
  title: 'The Protein Data Bank',
  journal: 'Nucleic Acids Research',
  journalAbbreviation: 'Nucleic Acids Res.',
  year: 2000,
  volume: '28',
  issue: '1',
  firstPage: '235',
  lastPage: '242',
  doi: '10.1093/nar/28.1.235',
  publisher: 'Oxford University Press',
};
