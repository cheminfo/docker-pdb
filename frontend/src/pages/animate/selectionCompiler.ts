import type { KeywordGroup, Selection } from './selectionParser.ts';

/* eslint-disable @typescript-eslint/naming-convention -- mmCIF property names mandated by Mol* */

interface MolScriptApi {
  struct: {
    generator: {
      all: () => unknown;
      empty: () => unknown;
      atomGroups: (params: Record<string, unknown>) => unknown;
    };
    modifier: {
      exceptBy: (params: { 0: unknown; by: unknown }) => unknown;
      intersectBy: (params: { 0: unknown; by: unknown }) => unknown;
      includeSurroundings: (params: {
        0: unknown;
        radius: number;
        'as-whole-residues': boolean;
      }) => unknown;
    };
    combinator: {
      merge: (members: unknown[]) => unknown;
    };
    atomProperty: {
      macromolecular: {
        auth_comp_id: () => unknown;
        auth_asym_id: () => unknown;
        auth_seq_id: () => unknown;
        auth_atom_id: () => unknown;
        entityType: () => unknown;
        entitySubtype: () => unknown;
        secondaryStructureFlags: () => unknown;
      };
      core: {
        elementSymbol: () => unknown;
      };
    };
    type: {
      elementSymbol: (args: [string]) => unknown;
      secondaryStructureFlags: (args: string[]) => unknown;
    };
  };
  core: {
    rel: {
      eq: (args: [unknown, unknown]) => unknown;
      inRange: (args: [unknown, number, number]) => unknown;
    };
    logic: {
      and: (args: unknown[]) => unknown;
    };
    str: {
      match: (args: [unknown, unknown]) => unknown;
    };
    flags: {
      hasAny: (args: [unknown, unknown]) => unknown;
    };
  };
  re: (pattern: string, flags?: string) => unknown;
}

/** Backbone atom names (protein) used by `backbone` / `sidechain` keywords. */
const PROTEIN_BACKBONE_ATOMS = ['N', 'CA', 'C', 'O', 'OXT', 'H', 'HA'];

/**
 * Compile a parsed `Selection` to a Mol* MolScript expression. The second
 * argument is Mol*'s MolScript builder (the `MS` / `Q` object exposed by
 * `mol-script/script`); the type here is intentionally loose so this module
 * does not pull a synchronous import of Mol* at module load.
 * @param selection - Parsed AST from `parseSelection`.
 * @param builder - Mol* MolScript builder.
 * @returns MolScript expression for `Script.getStructureSelection`.
 */
export function compileSelection(
  selection: Selection,
  builder: unknown,
): unknown {
  return compile(selection, builder as MolScriptApi);
}

function compile(sel: Selection, Q: MolScriptApi): unknown {
  switch (sel.kind) {
    case 'group':
      return compileGroup(sel.name, Q);
    case 'ligand':
      return Q.struct.generator.atomGroups({
        'residue-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_comp_id(),
          sel.label,
        ]),
      });
    case 'atomName':
      return Q.struct.generator.atomGroups({
        'atom-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_atom_id(),
          sel.name,
        ]),
      });
    case 'residueAtom':
      return Q.struct.generator.atomGroups({
        'residue-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_comp_id(),
          sel.residue,
        ]),
        'atom-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_atom_id(),
          sel.atom,
        ]),
      });
    case 'element':
      return Q.struct.generator.atomGroups({
        'atom-test': Q.core.rel.eq([
          Q.struct.atomProperty.core.elementSymbol(),
          Q.struct.type.elementSymbol([sel.element]),
        ]),
      });
    case 'chain':
      return Q.struct.generator.atomGroups({
        'chain-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_asym_id(),
          sel.chain,
        ]),
      });
    case 'residueRange':
      return Q.struct.generator.atomGroups({
        'chain-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_asym_id(),
          sel.chain,
        ]),
        'residue-test': Q.core.rel.inRange([
          Q.struct.atomProperty.macromolecular.auth_seq_id(),
          sel.from,
          sel.to,
        ]),
      });
    case 'residue':
      return Q.struct.generator.atomGroups({
        'chain-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_asym_id(),
          sel.chain,
        ]),
        'residue-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_seq_id(),
          sel.index,
        ]),
      });
    case 'not':
      return Q.struct.modifier.exceptBy({
        0: Q.struct.generator.all(),
        by: compile(sel.expr, Q),
      });
    case 'or':
      return Q.struct.combinator.merge([
        compile(sel.left, Q),
        compile(sel.right, Q),
      ]);
    case 'and':
      return Q.struct.modifier.intersectBy({
        0: compile(sel.left, Q),
        by: compile(sel.right, Q),
      });
    case 'within':
      return Q.struct.modifier.includeSurroundings({
        0: compile(sel.expr, Q),
        radius: sel.radius,
        'as-whole-residues': false,
      });
    default:
      throw new Error(
        `Unknown selection kind: ${(sel as { kind: string }).kind}`,
      );
  }
}

function compileGroup(name: KeywordGroup, Q: MolScriptApi): unknown {
  switch (name) {
    case 'all':
      return Q.struct.generator.all();
    case 'none':
      return Q.struct.generator.empty();
    case 'polymer':
      return entityTypeIs(Q, 'polymer');
    case 'water':
      return entityTypeIs(Q, 'water');
    case 'ligand':
      return entityTypeIs(Q, 'non-polymer');
    case 'protein':
      return entitySubtypeMatches(
        Q,
        '(polypeptide|cyclic-pseudo-peptide|peptide nucleic acid)',
      );
    case 'nucleic':
      return entitySubtypeMatches(
        Q,
        '(deoxyribonucleotide|ribonucleotide|peptide nucleic acid)',
      );
    case 'hetero':
      return Q.struct.modifier.exceptBy({
        0: Q.struct.generator.all(),
        by: entityTypeIs(Q, 'polymer'),
      });
    case 'helix':
      return secondaryStructureIs(Q, ['helix']);
    case 'sheet':
      return secondaryStructureIs(Q, ['beta']);
    case 'backbone':
      return atomNameIn(Q, PROTEIN_BACKBONE_ATOMS);
    case 'sidechain':
      return Q.struct.modifier.intersectBy({
        0: entitySubtypeMatches(
          Q,
          '(polypeptide|cyclic-pseudo-peptide|peptide nucleic acid)',
        ),
        by: Q.struct.modifier.exceptBy({
          0: Q.struct.generator.all(),
          by: atomNameIn(Q, PROTEIN_BACKBONE_ATOMS),
        }),
      });
    default:
      throw new Error(`Unknown keyword group: ${name as string}`);
  }
}

function secondaryStructureIs(Q: MolScriptApi, flags: string[]): unknown {
  return Q.struct.generator.atomGroups({
    'residue-test': Q.core.flags.hasAny([
      Q.struct.atomProperty.macromolecular.secondaryStructureFlags(),
      Q.struct.type.secondaryStructureFlags(flags),
    ]),
  });
}

function atomNameIn(Q: MolScriptApi, atomNames: string[]): unknown {
  return Q.struct.combinator.merge(
    atomNames.map((atomName) =>
      Q.struct.generator.atomGroups({
        'atom-test': Q.core.rel.eq([
          Q.struct.atomProperty.macromolecular.auth_atom_id(),
          atomName,
        ]),
      }),
    ),
  );
}

function entityTypeIs(Q: MolScriptApi, value: string): unknown {
  return Q.struct.generator.atomGroups({
    'entity-test': Q.core.rel.eq([
      Q.struct.atomProperty.macromolecular.entityType(),
      value,
    ]),
  });
}

function entitySubtypeMatches(Q: MolScriptApi, pattern: string): unknown {
  return Q.struct.generator.atomGroups({
    'entity-test': Q.core.logic.and([
      Q.core.rel.eq([
        Q.struct.atomProperty.macromolecular.entityType(),
        'polymer',
      ]),
      Q.core.str.match([
        Q.re(pattern, 'i'),
        Q.struct.atomProperty.macromolecular.entitySubtype(),
      ]),
    ]),
  });
}
