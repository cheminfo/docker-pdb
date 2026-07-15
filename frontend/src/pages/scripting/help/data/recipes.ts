/**
 * Task-oriented cookbook: short, complete scripts answering the questions
 * people actually arrive with. Every recipe is self-contained and can be
 * pasted straight into the editor. Rendered by `HelpRecipes.tsx`, indexed by
 * `search.ts`.
 */

export interface Recipe {
  id: string;
  title: string;
  /** What the reader gets, and when to reach for this. */
  goal: string;
  code: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'inspect',
    title: 'What is actually in this file?',
    goal: 'Start here whenever a selection comes up empty. Prints the chains, ligands and counts, so you can select things that genuinely exist.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);

ms.echo('Chains: ' + pdb.chains.join(' ') +
        ' | Ligands: ' + (pdb.ligands.join(' ') || 'none') +
        ' | ' + pdb.residues.length + ' residues' +
        ' | ' + pdb.helices.length + ' helices', { size: 18 });`,
  },
  {
    id: 'chains',
    title: 'Colour each chain differently',
    goal: 'The quickest way to see how many subunits there are and how they pack. Works for 2 chains or 200 — the loop does not care.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

const colors = ['steelblue', 'salmon', 'mediumseagreen', 'mediumpurple'];
for (let i = 0; i < pdb.chains.length; i++) {
  pdb.select(':' + pdb.chains[i])
     .ribbon.color(colors[i % colors.length]);
}
pdb.all.zoom(0.9);`,
  },
  {
    id: 'pocket',
    title: 'A ligand and the pocket around it',
    goal: 'The classic figure: ligand in sticks, the residues lining it in thin sticks, everything else a faint ribbon.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

const ligand = pdb.select('PLP');
const pocket = pdb.select('within 4.5 of PLP and not PLP and not water');

pdb.all.ribbon.color({ color: 'lightgrey', alpha: 0.5 });
ligand.bonds.diameter(0.25).color({ model: 'atoms' });
pocket.bonds.diameter(0.12).color({ model: 'atoms', alpha: 0.9 });

ligand.contactsWith(pocket);
ligand.zoom(0.4, { seconds: 1.5 });
ms.echo('PLP binding site', { size: 24 });`,
  },
  {
    id: 'helix',
    title: 'Pull one helix out of the structure',
    goal: 'Hide everything else, show a single helix, and reveal the hydrogen bonds that hold it together.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

const helix = pdb.select('108-122:A');
helix.ribbon.color('crimson');
helix.select('backbone').bonds.diameter(0.1).color({ model: 'atoms' });

// Restrict the H-bond search to the atoms you actually drew, so no
// cylinder ends up anchored on an invisible side-chain atom.
helix.select('backbone').hbonds.show();

helix.zoom(0.7, { seconds: 1.5 });
ms.echo('α-helix 108–122, backbone H-bonds', { size: 22 });`,
  },
  {
    id: 'surface',
    title: 'A hydrophobic surface with the ligand inside',
    goal: 'Shows why a pocket binds what it binds. The surface must be transparent, or it hides the very thing you want to show.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

pdb.select('protein').surface.color({ model: 'hydrophobicity', alpha: 0.65 });
pdb.select('ligand').bonds.diameter(0.25).color({ model: 'atoms' });
pdb.select('ligand').zoom(0.5, { seconds: 2 });
ms.echo('Hydrophobicity — orange is greasy', { size: 20 });`,
  },
  {
    id: 'distance',
    title: 'Measure a distance',
    goal: 'Put a number on the canvas. Each `.to(...)` adds one more labelled line.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);

const lys = pdb.select('LYS.NZ');
const contacts = pdb.select('within 3.5 of PLP and not PLP');

lys.distances.color('orange').diameter(0.08).to(contacts);
lys.focus({ seconds: 1 });`,
  },
  {
    id: 'labels',
    title: 'Label residues',
    goal: 'Name the residues in a pocket. Labels sit on the α-carbons, so they do not crowd the sticks.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

const pocket = pdb.select('within 4.5 of PLP and not PLP and not water');
pocket.bonds.diameter(0.12).color({ model: 'atoms' });
pocket.select('.CA').label('residue', { size: 1.4, bold: true });
pocket.zoom(0.5);`,
  },
  {
    id: 'movie',
    title: 'Build a scene step by step (a movie)',
    goal: 'Narrate a structure one layer at a time. This is the pattern behind the Global view example: draw, title, pause, add the next layer.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.hideDefaults();

ms.echo('1 — the backbone', { size: 24 });
pdb.select('protein').ribbon.tube().color('lightgrey');
pdb.all.zoom(0.9);
ms.rotate({ degrees: 180, speed: 60 });

ms.echo('2 — where the helices are', { size: 24 });
pdb.select('helix').ribbon.cartoon().color('crimson');
delay(2);

ms.echo('3 — and the sheets', { size: 24 });
pdb.select('sheet').ribbon.cartoon().color('gold');
ms.spin('y', 30);
delay(4);
ms.spin('off');`,
  },
  {
    id: 'ramachandran',
    title: 'Ramachandran plot in 3D',
    goal: 'Swap the protein for a cloud of points at (φ, ψ, ω), then switch back. An orthographic camera keeps it honest — no perspective distortion in a scatter plot.',
    code: `const ms = new MolStar();
const pdb = ms.loadPDB(text);

const stats = pdb.dihedralStats();
ms.echo(stats.helix + ' helical, ' + stats.sheet + ' sheet, ' +
        stats.coil + ' coil (of ' + stats.total + ')', { size: 20 });

pdb.createModel('rama', {
  pdb: pdb.ramachandranPdb(),
  camera: 'orthographic',
});
pdb.select('protein').atoms.radius({ value: 0.25 }).color({ model: 'sequence' });
pdb.all.zoom(0.8);
delay(4);

pdb.switchModel('initial');
ms.fit(0.85, { seconds: 1.5 });`,
  },
];
