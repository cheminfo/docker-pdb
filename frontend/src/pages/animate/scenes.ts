/**
 * Demonstration scenes ported from the historical JSmol teaching tool. Each
 * `code` string is exactly what gets loaded into the editor when the user
 * clicks the matching button on the Animate page.
 *
 * Scripts are written in the synchronous-looking style: the runner
 * (`runScript.ts` → `rewriteAwait.ts`) injects `await` automatically before
 * every call to a `Promise`-returning method. Explicit `await` is also
 * accepted for power users.
 */
export interface Scene {
  id: string;
  label: string;
  code: string;
}

const GLOBAL_VIEW = `// Global view: everything but the PLP cofactor as a ribbon coloured
// by secondary structure, water as red spheres, cysteines as thick
// labelled ball-and-stick, and the PLP cofactor as pink surface dots.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Global View — chains: ' + pdb.chains.join(', '), {
  size: 28,
  italic: true,
});

const protein = pdb.select('not PLP');
protein.ribbon.color({ model: 'structure' });

const water = pdb.select('[H2O]');
water.atoms.color({ value: 'red' });

const cystein = pdb.select('[CYS]');
cystein.bonds.diameter(0.4).color({ model: 'atoms', alpha: 0.8 });
cystein.atoms.radius({ value: 1.4 });

const cysteinCAlpha = cystein.select('.CA');
cysteinCAlpha.label('\${residue.name}\${residue.number}');

ms.spin('y');

const ligand = pdb.select('PLP');
ligand.surface.dots();
ligand.surface.color({ value: 'pink' });
`;

const DISPLAY_HELIX = `// Alpha helix on chain A, residues 108-122. Highlights the helix in
// translucent magenta then zooms in on its side chains.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Alpha Helix: residues 108-122, chain A', { size: 26, italic: true });

pdb.select('not PLP').ribbon.color({ model: 'structure', alpha: 0.4 });

const helix = pdb.select('108-122:A');
helix.ribbon.color({ color: 'magenta', alpha: 0.8 });
ms.spin('y');
delay(2);

// .zoom(factor) frames the helix's bounding sphere to fill 'factor' of
// the viewport (default 0.75). Because the bounding sphere is rotation-
// invariant, the helix stays well-framed while the camera spins.
helix.zoom();
helix.atoms.radius({ value: 0.3 });
helix.atoms.color({ model: 'element' });
helix.bonds.diameter(0.15);
delay(3);
`;

const DISPLAY_SHEET = `// Two beta strands on chain A (residues 99-105 and 267-274) highlighted
// in translucent lime, then zoomed in.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Beta Strands: 99-105 and 267-274, chain A', {
  size: 24,
  italic: true,
});

pdb.select('not PLP').ribbon.color({ model: 'structure', alpha: 0.4 });

const sheets = pdb.select('99-105:A or 267-274:A');
sheets.ribbon.color({ color: 'limegreen', alpha: 0.7 });
ms.spin('y');
delay(2);

sheets.zoom(0.6);
sheets.atoms.radius({ value: 0.3 });
sheets.atoms.color({ model: 'element' });
sheets.bonds.diameter(0.15);
delay(3);
`;

const RAMACHANDRAN = `// Ramachandran (φ × ψ) + ω rotated 90° about the y-axis (cis / trans).
// Both panels are drawn as a 2D overlay on top of the Mol* canvas. Five
// residues are highlighted in blue on both panels and rendered as
// ball-and-stick in the 3D view to make them easy to locate.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Ramachandran + ω (cis / trans)', { size: 22, italic: true });

pdb.all.ribbon.color({ model: 'structure', alpha: 0.5 });

const targets = pdb.select('29:A or 166:A or 192:A or 296:A or 358:A');
targets.atoms.radius({ value: 0.3 });
targets.atoms.color({ model: 'element' });
targets.bonds.diameter(0.15);

pdb.ramachandran({
  position: 'bottom-right',
  highlight: ['29:A', '166:A', '192:A', '296:A', '358:A'],
});

targets.focus();
`;

const INTERACTION = `// Show every atom within 3.5 Å of the PLP cofactor with a ball-and-stick
// detail and draw a labeled distance from PLP to that contact shell.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Atoms within 3.5 Å of PLP', { size: 22, italic: true });

pdb.select('not PLP').ribbon.color({ model: 'structure', alpha: 0.4 });

const ligand = pdb.select('PLP');
ligand.atoms.radius({ value: 0.4 });
ligand.atoms.color({ value: 'limegreen' });

const close = pdb.select('within 3.5 of PLP and not PLP');
close.atoms.radius({ value: 0.3 });
close.atoms.color({ model: 'element' });
close.bonds.diameter(0.15);

pdb.select('PLP or within 3.5 of PLP').focus();
ligand.distance(close);
`;

export const SCENES: Scene[] = [
  { id: 'global', label: 'Global view', code: GLOBAL_VIEW },
  { id: 'helix', label: 'Display helix', code: DISPLAY_HELIX },
  { id: 'sheet', label: 'Display β-sheet', code: DISPLAY_SHEET },
  { id: 'ramachandran', label: 'Ramachandran', code: RAMACHANDRAN },
  { id: 'interaction', label: 'Interaction 3.5 Å', code: INTERACTION },
];

export const DEFAULT_SCENE_CODE = GLOBAL_VIEW;
