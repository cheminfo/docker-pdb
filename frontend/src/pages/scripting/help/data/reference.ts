/**
 * The scripting API reference, grouped by the object you are holding.
 * Mirrors the runtime surface in `MolStar.ts` and the editor's ambient types
 * in `scriptApiDts.ts` — keep all three in sync when the API changes.
 *
 * Content file: it is deliberately long, and prose is the payload. Rendered
 * by `HelpReference.tsx`, indexed by `search.ts`.
 */

export interface MethodEntry {
  signature: string;
  description: string;
  example: string;
}

export interface ReferenceGroup {
  id: string;
  title: string;
  /** What this object is, in one plain-language sentence. */
  intro: string;
  entries: MethodEntry[];
}

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    id: 'globals',
    title: 'Globals — what every script starts with',
    intro:
      'Three names exist before you write anything. Every script begins by turning `text` into a `pdb` handle through a viewer.',
    entries: [
      {
        signature: 'text',
        description:
          'The raw PDB file of the structure you are looking at, as text. You rarely read it yourself — you hand it to `loadPDB`.',
        example: 'const pdb = ms.loadPDB(text);',
      },
      {
        signature: 'new MolStar()',
        description:
          'Create the viewer. Do this once, at the top of the script. `ms` is the conventional name for it.',
        example: 'const ms = new MolStar();',
      },
      {
        signature: 'delay(seconds)',
        description:
          'Pause the script. Pairs with `ms.spin(...)` to let the camera turn before the next change lands.',
        example: "ms.spin('y');\ndelay(2);\nms.spin('off');",
      },
    ],
  },
  {
    id: 'ms-camera',
    title: 'ms — the viewer and the camera',
    intro:
      'Everything about *how you look* at the structure, plus on-screen titles. Nothing here changes what is drawn — only the point of view.',
    entries: [
      {
        signature: 'ms.loadPDB(text)',
        description:
          'Parse PDB text and hand back a `pdb` handle — your entry point to `.select`, `.chains`, `.all`, and the rest.',
        example: 'const pdb = ms.loadPDB(text);',
      },
      {
        signature: 'ms.spin(axis, speedDegreesPerSecond?)',
        description:
          "Rotate continuously until told to stop. `axis` is 'x', 'y', 'z' or 'off'. Default speed is 30 deg/s. Spin persists between scenes — stop it with `ms.spin('off')`.",
        example: "ms.spin('y', 60);",
      },
      {
        signature: 'ms.rotate(options?)',
        description:
          "A rotation of a fixed size that finishes before the next line runs. Options: `{ axis, degrees, speed }`, defaulting to `'y'`, 360°, 60 deg/s. Use this rather than `spin` + `delay` when you want a predictable end position.",
        example: "ms.rotate({ axis: 'y', degrees: 180, speed: 90 });",
      },
      {
        signature: 'ms.fit(factor?, options?)',
        description:
          'Frame the whole structure. `factor` is how much of the viewport it should fill (0–1, default 0.85). Pins the camera, so later drawing does not silently re-frame your shot. Pass `{ seconds }` to glide instead of snapping.',
        example: 'ms.fit(0.85, { seconds: 1.5 });',
      },
      {
        signature: 'ms.resetCamera()',
        description: "Back to Mol*'s default view of the structure.",
        example: 'ms.resetCamera();',
      },
      {
        signature: 'ms.echo(text, options?)',
        description:
          "A title drawn flat on the canvas, independent of the molecule. Options: `{ position: 'top' | 'middle' | 'bottom', size, bold, italic, color }`. Ideal for narrating a scene step by step.",
        example: "ms.echo('Active site', { size: 30, color: 'navy' });",
      },
      {
        signature: 'ms.clearEcho()',
        description: 'Remove the current on-canvas title.',
        example: 'ms.clearEcho();',
      },
      {
        signature: 'ms.fullscreen(on?)',
        description:
          'Expand the viewer to the whole window, hiding the editor. `true` enters, `false` exits, no argument flips. Good for a cinematic beat mid-animation.',
        example: 'ms.fullscreen(true);\ndelay(3);\nms.fullscreen(false);',
      },
      {
        signature: 'ms.selectionHalos(on)',
        description: "Show or hide Mol*'s yellow halos around the clicked selection.",
        example: 'ms.selectionHalos(true);',
      },
      {
        signature: 'ms.hideDefaults() / ms.showDefaults()',
        description:
          'Hide everything the viewer drew on its own before your script ran (the default cartoon, ligand sticks and waters). Call `hideDefaults()` first whenever you want complete control of the canvas — otherwise the default cartoon shows through your scene.',
        example: 'ms.hideDefaults();',
      },
      {
        signature: 'ms.clear()',
        description:
          'Wipe every representation, measurement and title. Runs automatically before each Run, so you seldom need it.',
        example: 'ms.clear();',
      },
      {
        signature: 'ms.reset()',
        description:
          'Back to the freshly-loaded state: drop everything the script drew and reset the camera. Same as the page’s Reset button.',
        example: 'ms.reset();',
      },
    ],
  },
  {
    id: 'ms-visibility',
    title: 'ms — showing and hiding by kind',
    intro:
      'Master switches. Each one hides every visual of that kind across every selection at once, without forgetting its colours and sizes — so hiding and re-showing restores exactly what you had.',
    entries: [
      {
        signature:
          'ms.atoms / ms.bonds / ms.ribbon / ms.surface / ms.label / ms.hbonds / ms.distances / ms.contacts',
        description:
          'Each carries `.show()` and `.hide()`. Handy for revealing a scene layer by layer: draw everything up front, hide it all, then show one kind at a time.',
        example: 'ms.hbonds.hide();\ndelay(1);\nms.hbonds.show();',
      },
    ],
  },
  {
    id: 'pdb-data',
    title: 'pdb — the structure and what is in it',
    intro:
      'Your handle on the loaded molecule. The fields are plain facts you can read (no parentheses); `select` is the action that turns them into something you can draw.',
    entries: [
      {
        signature: 'pdb.select(expression)',
        description:
          'Turn a selection expression into a Selection you can draw, measure or zoom to. This is the workhorse of the whole API — see the Selections tab for the grammar.',
        example: "const helix = pdb.select('108-122:A');",
      },
      {
        signature: 'pdb.all  /  pdb.none',
        description: 'Ready-made Selections covering every atom, or no atoms.',
        example: "pdb.all.ribbon.color({ model: 'structure' });",
      },
      {
        signature: 'pdb.chains',
        description: "The list of chain names, e.g. `['A', 'B']`. Loop over it to colour per chain.",
        example: "ms.echo('Chains: ' + pdb.chains.join(', '));",
      },
      {
        signature: 'pdb.ligands',
        description:
          'The list of ligand codes present in the file. Check this first when a `select` comes up empty.',
        example: "ms.echo('Ligands: ' + pdb.ligands.join(' '));",
      },
      {
        signature: 'pdb.atoms  /  pdb.residues',
        description:
          'The parsed atoms and residues. An atom carries `serial`, `name`, `element`, `resName`, `resNum`, `chainId`, `x`, `y`, `z`, `altLoc`; a residue carries `resName`, `resNum`, `chainId`.',
        example: "ms.echo(pdb.atoms.length + ' atoms, ' + pdb.residues.length + ' residues');",
      },
      {
        signature: 'pdb.helices  /  pdb.sheets',
        description:
          'One entry per HELIX / SHEET record, each `{ chainId, fromResNum, toResNum }`. Note that one entry of `sheets` is a single β-strand — a β-sheet is usually several of them.',
        example: "ms.echo(pdb.helices.length + ' helices');",
      },
      {
        signature: 'pdb.text',
        description: 'The raw PDB text this handle was built from.',
        example: 'const raw = pdb.text;',
      },
      {
        signature: 'pdb.dihedralStats()',
        description:
          'Tally the backbone geometry: `{ total, helix, sheet, coil, cis, trans }`. Counts residues by (φ, ψ) region, and peptide bonds as cis (|ω| < 30°) or trans (|ω| > 150°). Only residues with all three angles defined are counted.',
        example:
          "const stats = pdb.dihedralStats();\nms.echo(stats.helix + ' helical of ' + stats.total + ' residues');",
      },
      {
        signature: 'pdb.ramachandranPdb()',
        description:
          'Build a synthetic PDB in which each residue becomes one Cα placed at its (φ, ψ, ω) in degrees, plus X / Y / Z axis chains. Feed it to `createModel` to swap the protein for its dihedral-space cloud.',
        example: "pdb.createModel('rama', { pdb: pdb.ramachandranPdb() });",
      },
    ],
  },
  {
    id: 'pdb-models',
    title: 'pdb — models (several views of one structure)',
    intro:
      'A model is a named, self-contained scene. Use them to flip between two views — the protein and its Ramachandran cloud, say — without rebuilding either. Each model records its own drawing steps and replays them when you switch back.',
    entries: [
      {
        signature: 'pdb.createModel(name, options?)',
        description:
          "Create a named view and make it active. It inherits the current structure unless `{ pdb }` supplies a different one. `{ camera: 'orthographic' }` removes perspective, so distant atoms stay the same on-screen size — the honest choice for a scatter plot such as the Ramachandran cloud. The new model starts blank: re-draw whatever you want to see.",
        example: "pdb.createModel('rama', { pdb: pdb.ramachandranPdb(), camera: 'orthographic' });",
      },
      {
        signature: 'pdb.switchModel(name)',
        description:
          'Go back to a model you made earlier. Reloads the structure if it differs, then replays that model’s drawing steps.',
        example: "pdb.switchModel('initial');",
      },
      {
        signature: 'pdb.currentModel()',
        description: "The active model's name. Starts out as 'initial'.",
        example: 'const name = pdb.currentModel();',
      },
      {
        signature: 'pdb.listModels()',
        description: 'Every model name, in the order they were created.',
        example: "ms.echo(pdb.listModels().join(' → '));",
      },
      {
        signature: 'pdb.deleteModel(name)',
        description:
          "Remove a model. 'initial' can never be deleted, and you cannot delete the active one — switch away first.",
        example: "pdb.deleteModel('rama');",
      },
    ],
  },
  {
    id: 'selection',
    title: 'Selection — a group of atoms',
    intro:
      'What `pdb.select(...)` gives you. A Selection draws nothing by itself: you either paint it through one of its channels, or point the camera at it, or measure from it.',
    entries: [
      {
        signature: 'selection.select(expression)',
        description:
          'Narrow further, within what you already have. `pdb.select(\'[CYS]\').select(\'.CA\')` is the α-carbons of the cysteines — the same as intersecting the two.',
        example: "const cAlpha = pdb.select('[CYS]').select('.CA');",
      },
      {
        signature: 'selection.focus(options?)',
        description:
          'Centre and zoom on this selection. Pass `{ seconds }` to glide there instead of snapping.',
        example: "pdb.select('within 5 of PLP').focus({ seconds: 1.5 });",
      },
      {
        signature: 'selection.zoom(factor?, options?)',
        description:
          'Like `focus`, but you choose how much of the viewport to fill (default 0.75 — that is 75%, leaving a comfortable margin). Framing survives `ms.spin(...)`, so use it for anything that rotates. `{ seconds }` animates the move.',
        example: "pdb.select('108-122:A').zoom(0.6, { seconds: 2 });",
      },
      {
        signature: 'selection.label(template, options?)',
        description:
          'Label these atoms in 3D. Custom label *text* is not supported yet — the viewer draws its own standard text — so `template` only chooses how fine-grained the labels are, by the words it contains: say “atom” and you get atom names, “chain” and you get chain ids, anything else gives residue name + number. `label(\'residue\')` is therefore all you need. Options: `{ size, bold, italic, color }`, where `size` multiplies the default text size.',
        example:
          "cys.select('.CA').label('residue', { size: 1.5, bold: true, color: 'red' });",
      },
      {
        signature: 'selection.show() / selection.hide()',
        description:
          'Toggle every channel already drawn on this selection at once, keeping their colours and sizes. Both return the selection, so calls chain.',
        example: "pdb.select('water').hide();",
      },
      {
        signature: 'selection.distance(other)',
        description:
          'Draw one labelled distance line between the centres of two selections. Shorthand for `selection.distances.to(other)`.',
        example: "pdb.select('LYS.NZ').distance(pdb.select('PLP.C4A'));",
      },
      {
        signature: 'selection.contactsWith(other, options?)',
        description:
          'Find and draw the real chemical contacts between two selections — donor and acceptor typing, geometry and all — coloured by kind: yellow for hydrogen bonds, light blue for ionic, grey for hydrophobic. `{ kinds: [...] }` narrows it down. This is the tool for a ligand binding site; for hydrogen bonds *inside* one chain use `selection.hbonds` instead, because this detector deliberately skips contacts within a group.',
        example:
          "const pocket = pdb.select('within 4 of PLP and not PLP');\npdb.select('PLP').contactsWith(pocket, { kinds: ['hydrogen-bond', 'hydrophobic'] });",
      },
    ],
  },
  {
    id: 'channels',
    title: 'Channels — the four ways to draw atoms',
    intro:
      'Every Selection carries four drawing layers, and they stack: the same atoms can wear spheres, sticks, a ribbon and a surface at once. Calling a channel twice updates that one layer — it never stacks a second copy — and every method hands the channel back so you can chain.',
    entries: [
      {
        signature: 'selection.atoms.color(spec)',
        description:
          'Spheres, one per atom. The first call creates them; later calls just recolour. See the Colours section for what `spec` accepts.',
        example: "pdb.select('PLP').atoms.color({ value: 'limegreen' });",
      },
      {
        signature: 'selection.atoms.radius({ value })',
        description:
          'Sphere size, as a multiple of the Van der Waals radius. `1.0` is full space-filling; `0.3` is about ball-and-stick.',
        example: "pdb.select('[CYS]').atoms.radius({ value: 1.4 });",
      },
      {
        signature: 'selection.bonds.color(spec)',
        description:
          "Bonds as cylinders, with the atoms themselves hidden. `{ model: 'atoms' }` paints each half of the bond in its own atom's colour — the classic ball-and-stick look.",
        example: "pdb.select('[CYS]').bonds.color({ model: 'atoms', alpha: 0.8 });",
      },
      {
        signature: 'selection.bonds.diameter(value)',
        description: 'Cylinder thickness. About 0.15 for standard sticks; 0.4 is chunky.',
        example: "pdb.select('108-122:A').bonds.diameter(0.15);",
      },
      {
        signature: 'selection.ribbon.color(spec)',
        description: 'The cartoon ribbon along the polymer backbone.',
        example: "pdb.all.ribbon.color({ model: 'structure' });",
      },
      {
        signature: 'selection.ribbon.tube() / .cartoon()',
        description:
          '`tube()` renders a smooth, uniform tube that ignores secondary structure, so helices and strands look like plain coil — the honest way to show a backbone *before* revealing where the helices are. `cartoon()` restores the usual shape-aware ribbon.',
        example: "pdb.select('protein').ribbon.tube().color({ model: 'chain' });",
      },
      {
        signature: 'selection.surface.color(spec)',
        description:
          "The solid molecular surface. Pair it with `{ model: 'hydrophobicity' }` and some transparency to show a pocket's character.",
        example: "pdb.select('protein').surface.color({ model: 'hydrophobicity', alpha: 0.7 });",
      },
      {
        signature: 'selection.surface.dots()',
        description:
          'Switch the surface to dots (the closest thing to JSmol’s `dots ON`). Later `color(...)` calls keep it dotted.',
        example: "pdb.select('PLP').surface.dots();",
      },
      {
        signature: 'selection.<channel>.show() / .hide()',
        description:
          'Hide or reveal one layer of one selection, keeping its colour and size. Works on `atoms`, `bonds`, `ribbon`, `surface`, `hbonds` and `distances`.',
        example: "pdb.select('water').atoms.hide();",
      },
    ],
  },
  {
    id: 'measurements',
    title: 'Measurements — hydrogen bonds and distances',
    intro:
      'Two more channels on every Selection, for the numbers rather than the shapes.',
    entries: [
      {
        signature: 'selection.hbonds.show()',
        description:
          'Find the hydrogen bonds *within* this selection and draw them as dashed cylinders. It uses the viewer’s real chemistry — donor and acceptor typing plus geometry — so it catches backbone and side-chain bonds alike, with no false pairs from naive N···O distance matching. Default yellow, diameter 0.3.',
        example: "pdb.select('108-122:A').hbonds.show();",
      },
      {
        signature: 'selection.hbonds.color(spec) / .diameter(value) / .hide()',
        description: 'Restyle or hide the hydrogen bonds without recomputing them.',
        example: "helix.hbonds.color('cyan').diameter(0.2);",
      },
      {
        signature: 'selection.distances.to(other, options?)',
        description:
          'Add one labelled distance line to `other`, and keep adding as many as you like. `{ customText }` overrides the label — pass `\'\'` to hide it entirely.',
        example:
          "pdb.select('PLP').distances.color('orange')\n   .to(pdb.select('within 3.5 of PLP and not PLP'));",
      },
      {
        signature: 'selection.distances.color(spec) / .diameter(value)',
        description:
          'Set the style for the lines you add *next*. Lines already drawn keep the style they were given.',
        example: "pdb.select('PLP').distances.color('orange').diameter(0.1);",
      },
    ],
  },
  {
    id: 'shapes',
    title: 'ms — free-floating 3D shapes',
    intro:
      'Annotations that are not tied to any atom: arrows, spheres and text placed at coordinates you choose (in ångströms, in the structure’s own frame). Use them for axes, reaction arrows and Greek letters the atom-anchored labels cannot express. Each one is recorded in the active model, so it replays on `switchModel`.',
    entries: [
      {
        signature: 'ms.arrow(from, to, options?)',
        description:
          'An arrow (shaft plus cone head) between two points. Options: `{ radius, color, label, headLength, headRadius }`. Defaults: radius 0.4, head 4× the radius long and 2.4× wide.',
        example: "ms.arrow([0, 0, 0], [10, 0, 0], { color: 'crimson', label: 'φ' });",
      },
      {
        signature: 'ms.cylinder(from, to, options?)',
        description: 'A plain cylinder of constant radius. Options: `{ radius, color, label }`.',
        example: "ms.cylinder([0, 0, 0], [0, 12, 0], { radius: 0.2, color: 'gray' });",
      },
      {
        signature: 'ms.sphere(center, options?)',
        description:
          'A sphere at a point. Options: `{ radius, color, label }`. Useful to mark a centroid or a predicted site.',
        example: "ms.sphere([4.2, 1.8, -3.1], { radius: 1.5, color: 'gold' });",
      },
      {
        signature: 'ms.text(position, text, options?)',
        description:
          'Text floating at a coordinate. Options: `{ color, size, bold, italic, label }`. This is how you get φ / ψ / ω onto an axis.',
        example: "ms.text([11, 0, 0], 'φ', { size: 2, bold: true, color: 'crimson' });",
      },
    ],
  },
];

export interface ColorOption {
  spec: string;
  description: string;
}

export const COLOR_FORMS: ColorOption[] = [
  {
    spec: "'limegreen' / '#ff8000' / '#f80'",
    description:
      'Any CSS colour name or hex code, written directly. The shortest form, and the one to reach for first.',
  },
  {
    spec: "{ value: 'limegreen' }",
    description: 'The same thing spelled out. Identical result — use whichever reads better.',
  },
  {
    spec: "{ model: 'chain' }",
    description: 'A different colour per chain — the fastest way to show subunit organisation.',
  },
  {
    spec: "{ model: 'element' }",
    description: 'The CPK convention you already know: carbon grey, oxygen red, nitrogen blue.',
  },
  {
    spec: "{ model: 'atoms' }",
    description:
      'Bonds only: each half of the bond takes its own atom’s colour. This is what makes ball-and-stick read correctly.',
  },
  {
    spec: "{ model: 'structure' }",
    description: 'By secondary structure — helices, strands and coil each get their own colour.',
  },
  {
    spec: "{ model: 'residue' }",
    description: 'A colour per residue type.',
  },
  {
    spec: "{ model: 'sequence' }",
    description:
      'A rainbow along the chain, N-terminus to C-terminus. Good for showing the fold’s path.',
  },
  {
    spec: "{ model: 'hydrophobicity' }",
    description:
      'By residue hydrophobicity. Put it on a surface to make a binding pocket’s character obvious.',
  },
  {
    spec: "{ model: 'molecule-type' }",
    description: 'Protein, nucleic acid, ligand and water each get their own colour.',
  },
  {
    spec: "{ color: 'magenta', alpha: 0.6 }",
    description:
      'Any of the above, made see-through. `alpha` runs 0 (invisible) to 1 (solid). Essential for surfaces — an opaque one hides everything inside it.',
  },
];
