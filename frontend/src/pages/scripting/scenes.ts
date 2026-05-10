/**
 * Demonstration scenes ported from the historical JSmol teaching tool. Each
 * `code` string is exactly what gets loaded into the editor when the user
 * clicks the matching button on the Scripting page.
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

const GLOBAL_VIEW = `// Global view: everything but the HEC heme c cofactor as a ribbon coloured
// by secondary structure, water as red spheres, cysteines as thick
// labelled ball-and-stick (the two CYS that covalently tether HEC are
// among them), and the HEC cofactor as pink surface dots.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Global View — chains: ' + pdb.chains.join(', '), {
  size: 28,
  italic: true,
});

const protein = pdb.select('not HEC');
protein.ribbon.color({ model: 'structure' });

const water = pdb.select('[H2O]');
water.atoms.color({ value: 'red' });

const cystein = pdb.select('[CYS]');
cystein.bonds.diameter(0.4).color({ model: 'atoms', alpha: 0.8 });
cystein.atoms.radius({ value: 1.4 });

const cysteinCAlpha = cystein.select('.CA');
cysteinCAlpha.label('\${residue.name}\${residue.number}');

ms.spin('y');

const ligand = pdb.select('HEC');
ligand.surface.dots();
ligand.surface.color({ value: 'pink' });
`;

const DISPLAY_HELIX = `// Alpha helix walkthrough on chain A, residues 6-21.
// Demonstrates the new keyword selectors (helix, backbone, sidechain) and
// the hbonds channel (yellow dashed lines by default).
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('Alpha Helix: residues 6-21, chain A', { size: 24, italic: true });

// Take full control of the canvas: hide Mol*'s default polymer/water/ligand
// representations so only what we add below is visible.
ms.hideDefaults();

// 1. Whole protein as a structure-coloured ribbon, rotate once for context.
pdb.all.ribbon.color({ model: 'structure', alpha: 0.7 });
ms.rotate({ degrees: 360 });

// 2. Drop the global ribbon and keep only our target helix as a
//    translucent magenta cartoon — every other secondary structure
//    (helices, sheets, loops) disappears with it.
pdb.all.ribbon.hide();
const helix = pdb.select('6-21:A');
helix.ribbon.color({ color: 'magenta', alpha: 0.45 });

// 3. Zoom in tight on the helix and show backbone atoms + bonds.
helix.zoom(0.95);
const backbone = helix.select('backbone');
backbone.atoms.radius({ value: 0.3 });
backbone.atoms.color({ model: 'element' });
backbone.bonds.diameter(0.15);

// 4. Hydrogen bonds — defaults to yellow dashed cylinders. We run
//    detection on the backbone selection so only backbone donors and
//    acceptors are considered; side-chain N/O atoms aren't drawn here,
//    so they shouldn't anchor any cylinders either.
backbone.hbonds.show();

// 5. Slow rotation so the i,i+4 H-bond pattern is easy to follow.
ms.rotate({ degrees: 360, speed: 45 });

// 6. Side chains: just the bond cylinders. We include the .CA atom so
//    the CA-CB bond is in-selection and the sidechain stays anchored to
//    the backbone (otherwise each sidechain renders as a floating stub).
helix.select('sidechain or .CA').bonds.diameter(0.15);
`;

const DISPLAY_SHEET = `// β-sheet walkthrough: two consecutive antiparallel strands on chain A
// (residues 40-47 and 50-57 — strands 1 and 2 of the 3-stranded sheet in
// 8ZXR's SSR1698 domain). Mirrors the helix scene so the two
// secondary-structure motifs read the same way; picking adjacent strands
// is what makes the inter-strand H-bond pattern visible.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('β-sheet: 40-47 + 50-57, chain A', { size: 24, italic: true });

// Take full control of the canvas: hide Mol*'s default polymer/water/ligand
// representations so only what we add below is visible.
ms.hideDefaults();

// 1. Whole protein as a structure-coloured ribbon, rotate once for context.
pdb.all.ribbon.color({ model: 'structure', alpha: 0.7 });
ms.rotate({ degrees: 360 });

// 2. Drop the global ribbon; keep only the two β-strands as a translucent
//    lime cartoon — the rest of the protein disappears.
pdb.all.ribbon.hide();
const sheet = pdb.select('40-47:A or 50-57:A');
sheet.ribbon.color({ color: 'limegreen', alpha: 0.45 });

// 3. Zoom in on the strands and show backbone atoms + bonds.
sheet.zoom(0.85);
const backbone = sheet.select('backbone');
backbone.atoms.radius({ value: 0.3 }).color({ model: 'element' });
backbone.bonds.diameter(0.15);

// 4. Inter-strand H-bonds — Mol*'s chemistry-aware detector run on the
//    backbone-only sub-structure, so only N…O pairs anchored on drawn
//    atoms get cylinders.
backbone.hbonds.show();

// 5. Slow rotation so the parallel donor/acceptor pattern is easy to see.
ms.rotate({ degrees: 360, speed: 45 });

// 6. Side-chain bonds — include the .CA atom so the CA-CB bond stays
//    in-selection (otherwise the side chain renders as a floating stub).
sheet.select('sidechain or .CA').bonds.diameter(0.15);
`;

const RAMACHANDRAN = `// Five-step Ramachandran tour:
//   1. show the protein cartoon for context
//   2. swap to a synthetic Cα-only model where each Cα sits at (φ, ψ, ω);
//      the chain ID of each Cα encodes its (φ, ψ) region — :H α-helix,
//      :S β-sheet, :C coil — so we colour by chain to colour by SS
//   3. rotate 90° about y to bring the ω axis face-on (cis vs trans)
//   4. rotate -90° about y back to the canonical (φ, ψ) face
//   5. switch back to the protein
const ms = new MolStar();
const pdb = ms.loadPDB(text);
const stats = pdb.dihedralStats();

// Step 1 — protein cartoon.
pdb.all.ribbon.color({ model: 'structure' });
ms.echo(
  '1/5 · Protein cartoon · ' + stats.total + ' residues with full (φ,ψ,ω)',
  { size: 20, italic: true },
);
delay(2);

// Step 2 — switch to the 'rama' model. The synthetic PDB is loaded into
// Mol* but empty of representations; what we paint below is all you see.
// Coordinates are scaled (1° = 0.1 Å) so the cloud fits a normal protein
// bounding box. The 'orthographic' camera removes perspective scaling so
// the dihedral cube reads as a flat scatter plot regardless of depth.
pdb.createModel('rama', {
  pdb: pdb.ramachandranPdb(),
  camera: 'orthographic',
});

pdb.select(':H').atoms.radius({ value: 0.45 }).color({ value: 'crimson' });
pdb.select(':S').atoms.radius({ value: 0.45 }).color({ value: 'goldenrod' });
pdb.select(':C').atoms.radius({ value: 0.35 }).color({ value: 'lightgray' });

// Full-length axes drawn as Mol*-shape arrows — shaft cylinder + cone tip.
// World axes match the synthetic PDB: φ = +X, ψ = +Y (Mol* is Y-up, so
// +ψ ends up at the top of the canvas — literature Ramachandran), ω = +Z
// (perpendicular to the canonical face, projects to the centre under
// orthographic projection).
const arrowOpts = { radius: 0.2, headLength: 2, headRadius: 1 };
ms.arrow([-18, 0, 0], [18, 0, 0], { ...arrowOpts, color: 'red' });
ms.arrow([0, -18, 0], [0, 18, 0], { ...arrowOpts, color: 'green' });
ms.arrow([0, 0, -18], [0, 0, 18], { ...arrowOpts, color: 'blue' });

// Axis labels — free-floating Greek letters drawn at each +tip via the
// ms.text helper (Mol* Text-geometry shape). Mol-star's residue-anchored
// label rep would render the resName + resNum, which is not what we want.
const labelOpts = { size: 4, bold: true };
ms.text([20, 0, 0], 'φ', { ...labelOpts, color: 'red' });
ms.text([0, 20, 0], 'ψ', { ...labelOpts, color: 'green' });
ms.text([0, 0, 20], 'ω', { ...labelOpts, color: 'blue' });

pdb.all.focus();
ms.echo(
  '2/5 · Ramachandran (φ × ψ) · α ' +
    stats.helix +
    ' · β ' +
    stats.sheet +
    ' · coil ' +
    stats.coil,
  { size: 20, italic: true },
);
delay(2);

// Step 3 — rotate -90° about y so the ω axis comes to the front (cis vs
// trans separates into two sheets).
ms.echo(
  '3/5 · Rotate −90° about y → ω axis · cis bonds: ' +
    stats.cis +
    ' / trans: ' +
    stats.trans,
  { size: 20, italic: true },
);
ms.rotate({ axis: 'y', degrees: -90, speed: 45 });

// Step 4 — rotate +90° back to the canonical (φ, ψ) face.
ms.echo('4/5 · Rotate +90° about y · back to (φ × ψ) face', {
  size: 20,
  italic: true,
});
ms.rotate({ axis: 'y', degrees: 90, speed: 45 });

// Step 5 — restore the original protein view.
ms.echo('5/5 · Back to the protein cartoon', { size: 22, italic: true });
pdb.switchModel('initial');
`;

const INTERACTION = `// HEC binding-site walkthrough: faded protein cartoon for context,
// HEC as clean ball-and-stick (element colors, small spheres), every
// residue with at least one atom within 3.5 Å of HEC revealed with its
// sidechain plus a SHORT orange line between the closest HEC ↔ residue
// atom pair (so the labelled distance is the actual close contact, not
// a misleading centroid-to-CA shortcut). Ends with Mol*'s chemistry-
// aware H-bond detector layered on top as yellow dashed cylinders.
const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('HEC binding site — residues within 3.5 Å', {
  size: 22,
  italic: true,
});

ms.hideDefaults();

// 1. Faded protein cartoon for context, HEC as small-radius ball-and-
//    stick. The bonds channel automatically adds element-coloured spheres
//    at atom endpoints, so we don't need a separate spacefill rep — that
//    one made the heme look like a fat orange blob.
pdb.all.ribbon.color({ color: { model: 'structure' }, alpha: 0.25 });
const ligand = pdb.select('HEC');
ligand.bonds.diameter(0.2).color({ model: 'element' });
ms.rotate({ degrees: 360 });

// 2. Find every non-HEC, non-water residue with at least one atom within
//    3.5 Å of HEC, and for each such residue keep the CLOSEST HEC ↔
//    residue atom pair so step 4 can draw the actual close contact.
const cutoffSq = 3.5 * 3.5;
const ligandAtoms = pdb.atoms.filter((a) => a.resName === 'HEC');
const contactMap = new Map();
for (const atom of pdb.atoms) {
  if (atom.resName === 'HEC') continue;
  if (atom.resName === 'HOH') continue;
  for (const p of ligandAtoms) {
    const dx = atom.x - p.x;
    const dy = atom.y - p.y;
    const dz = atom.z - p.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 > cutoffSq) continue;
    const key = atom.chainId + ':' + atom.resNum;
    const previous = contactMap.get(key);
    if (!previous || d2 < previous.d2) {
      contactMap.set(key, {
        chainId: atom.chainId,
        resNum: atom.resNum,
        resName: atom.resName,
        residueAtom: atom.name,
        ligandAtom: p.name,
        d2,
      });
    }
  }
}
const contacts = [...contactMap.values()].sort((a, b) =>
  a.chainId === b.chainId ? a.resNum - b.resNum : a.chainId < b.chainId ? -1 : 1,
);

// 3. Frame HEC plus a 4-Å shell — wide enough that contact residues fit
//    and HEC stays centred.
pdb.select('HEC or within 4 of HEC').zoom(0.75);
ms.echo(contacts.length + ' contact residues — closest-atom distance to HEC', {
  size: 18,
  italic: true,
});
delay(1);

// 4. Reveal each contact residue one at a time: sidechain ball-and-stick
//    + CA label + a short orange line between the closest HEC atom and
//    the closest residue atom. The line lies inside the 3.5 Å shell so
//    its length matches what the title promises.
for (const r of contacts) {
  const sel = pdb.select(r.resNum + ':' + r.chainId);
  sel.select('sidechain or .CA').bonds.diameter(0.15).color({ model: 'element' });
  sel.select('.CA').label('\${residue.name}\${residue.number}', {
    size: 1.3,
    bold: true,
  });
  const residueAtomSel = sel.select('.' + r.residueAtom);
  const ligandAtomSel = pdb.select('HEC').select('.' + r.ligandAtom);
  residueAtomSel.distances.to(ligandAtomSel, {
    color: 'orange',
    diameter: 0.05,
  });
  delay(0.6);
}

// 5. Chemistry-aware H-bond cylinders (yellow dashed) overlaid on the
//    short orange distance labels for any HEC ↔ residue pair Mol*'s
//    contact detector flags as a hydrogen bond.
const shell = pdb.select('within 3.5 of HEC and not HEC');
ligand.contactsWith(shell, { kinds: ['hydrogen-bond'] });

ms.echo('HEC — H-bonds (yellow dashed) + closest-atom orange distances', {
  size: 18,
  italic: true,
});
`;

const MODELS = `// Demonstrate the model API. 'pdb' is one handle that follows the active
// model; createModel allocates a new model (same PDB by default, fresh op
// log) and activates it. Channel calls record into the active model, so
// switching between models tears down representations and replays the
// target's recorded ops.
const ms = new MolStar();
const pdb = ms.loadPDB(text);

// 'initial' model: structure-coloured ribbon + ligands as spheres.
pdb.all.ribbon.color({ model: 'structure' });
pdb.select('hetero and not water').atoms.color({ model: 'element' });
ms.echo("Active model: 'initial' — structure colouring", {
  size: 22,
  italic: true,
});
delay(3);

// 'rainbow' model — same PDB, fresh op log. We re-paint everything we
// want visible (each model is its own visual scene).
pdb.createModel('rainbow');
pdb.all.ribbon.color({ model: 'sequence' });
pdb.select('hetero and not water').atoms.color({ model: 'element' });
ms.echo("Active model: 'rainbow' — N→C terminus gradient", {
  size: 22,
  italic: true,
});
delay(3);

// Switch back. Mol* keeps the same loaded structure (same PDB), but the
// rep tree is rebuilt from 'initial'.ops — ribbon back to structure
// colouring; the rainbow recolour is gone.
pdb.switchModel('initial');
ms.echo("Switched back: 'initial' restored", { size: 22, italic: true });
`;

export const SCENES: Scene[] = [
  { id: 'global', label: 'Global view', code: GLOBAL_VIEW },
  { id: 'helix', label: 'Display helix', code: DISPLAY_HELIX },
  { id: 'sheet', label: 'Display β-sheet', code: DISPLAY_SHEET },
  { id: 'ramachandran', label: 'Ramachandran', code: RAMACHANDRAN },
  { id: 'interaction', label: 'Interaction 3.5 Å', code: INTERACTION },
  { id: 'models', label: 'Models', code: MODELS },
];

export const DEFAULT_SCENE_CODE = GLOBAL_VIEW;
