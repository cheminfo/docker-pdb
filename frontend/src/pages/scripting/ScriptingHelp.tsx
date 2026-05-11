/**
 * Static help panel rendered in the Help floating window. Documents the
 * three script globals (`text`, `MolStar`, `delay`), the `ms` viewer they
 * produce, the `pdb` handle returned by `ms.loadPDB(text)`, and the
 * channel objects (`.atoms`, `.bonds`, `.ribbon`, `.surface`) that hang
 * off every Selection.
 */

import { HTMLTable } from '@blueprintjs/core';

const SELECTION_EXAMPLES: Array<[string, string]> = [
  ['all', 'every atom'],
  ['none', 'no atoms'],
  ['protein', 'all amino-acid residues'],
  ['ligand', 'non-polymer / non-water entities (e.g. PLP, HEM)'],
  ['water', 'every water molecule'],
  ['polymer', 'protein + nucleic acid (any polymer)'],
  ['nucleic', 'DNA + RNA residues'],
  ['hetero', 'everything that is not a polymer'],
  ['helix', 'every residue covered by a HELIX record'],
  ['sheet', 'every residue covered by a SHEET record'],
  ['backbone', 'protein backbone atoms (N, CA, C, O, OXT, H, HA)'],
  ['sidechain', 'protein non-backbone atoms'],
  ['PLP', 'every residue whose 3-letter code is PLP'],
  ['[CYS]', 'bracketed residue label (same as `CYS`)'],
  ['[H2O]', 'all waters by name'],
  ['.CA', 'every atom whose name is CA'],
  ['[CYS].CA', 'CA atoms of every cysteine (compound shorthand)'],
  ['CYS.SG', 'bare-form compound: SG atoms of every cysteine'],
  ['_C', 'every carbon atom (element symbol)'],
  ['_Fe', 'every iron atom'],
  [':A', 'everything on chain A'],
  ['108-122:A', 'residues 108 through 122 on chain A'],
  ['119:A', 'residue 119 on chain A'],
  ['within 3.5 of PLP', 'every atom within 3.5 Å of any PLP atom'],
  ['not PLP', 'everything except PLP residues'],
  ['protein and within 5 of HEM', 'protein atoms within 5 Å of HEM'],
  ['(108-122:A or 130-140:A) and not water', 'composite expression'],
];

interface MethodEntry {
  signature: string;
  description: string;
  example: string;
}

const SELECTION_METHODS: MethodEntry[] = [
  {
    signature: 'selection.atoms.color(spec)',
    description:
      'Sphere channel (Mol* spacefill). First call creates the spheres; subsequent calls merge into the same representation.',
    example: "pdb.select('PLP').atoms.color({ value: 'limegreen' });",
  },
  {
    signature: 'selection.atoms.radius({ value })',
    description:
      'Set the spacefill `sizeFactor` (multiplier on Van der Waals radius). 1.0 ≈ full VdW; 0.3 ≈ ball-and-stick size.',
    example: "pdb.select('[CYS]').atoms.radius({ value: 1.4 });",
  },
  {
    signature: 'selection.bonds.color(spec)',
    description:
      "Bond cylinder channel (Mol* ball-and-stick, atoms hidden). `{ model: 'atoms' }` colors each bond half by its endpoint atom.",
    example: "pdb.select('[CYS]').bonds.color({ model: 'atoms', alpha: 0.8 });",
  },
  {
    signature: 'selection.bonds.diameter(value)',
    description:
      'Set the bond cylinder `sizeFactor`. ~0.15 = standard ball-and-stick; 0.4 = thick.',
    example: "pdb.select('108-122:A').bonds.diameter(0.15);",
  },
  {
    signature: 'selection.ribbon.color(spec)',
    description: 'Cartoon / ribbon channel for protein backbone.',
    example: "pdb.all.ribbon.color({ model: 'structure' });",
  },
  {
    signature: 'selection.ribbon.tube() / .cartoon()',
    description:
      "Switch the ribbon channel between Mol*'s `putty` representation — a uniform polymer tube that ignores secondary-structure annotations, so helices and β-strands render as plain coil — and the default SS-aware cartoon. Use `.tube()` to show the backbone shape without revealing where the helices and sheets sit, then `.cartoon()` (or just another `.color(...)` after re-enabling cartoon) to reveal them.",
    example: "pdb.select('protein').ribbon.tube().color({ model: 'chain' });",
  },
  {
    signature: 'selection.surface.color(spec)',
    description:
      'Solid molecular (Connolly) surface — unless `dots()` was called first, then the surface stays dotted.',
    example:
      "pdb.select('protein').surface.color({ model: 'hydrophobicity', alpha: 0.7 });",
  },
  {
    signature: 'selection.surface.dots()',
    description:
      'Switch the surface channel to a dotted Gaussian-surface visual (closest analogue to JSmol `dots ON`).',
    example: "pdb.select('PLP').surface.dots();",
  },
  {
    signature: 'selection.hbonds.show() / .color(spec) / .diameter(value)',
    description:
      "Run Mol*'s chemistry-aware `computeInteractions` (donor type, acceptor type, geometric constraints — Kabsch-Sander-style) on a sub-structure built from the selection's atoms with `skipIntraContacts: false`, then render the H-bond pairs as Mol*-styled dashed cylinders. Catches backbone **and** side-chain H-bonds. Defaults: yellow, `diameter` 0.3. `.hide()` toggles visibility. **Tip:** narrow the selection to just the atoms you've drawn (e.g. `helix.select('backbone').hbonds.show()`) to avoid cylinders anchored on side-chain atoms that aren't visible.",
    example: "pdb.select('108-122:A').hbonds.show();",
  },
  {
    signature: 'selection.contactsWith(other, options?)',
    description:
      "Compute and render contacts between two selections via Mol*'s chemistry-aware `extensions/interactions` pipeline (donor type, acceptor type, geometry). Coloured per kind: yellow = hydrogen-bond, light blue = ionic, gray = hydrophobic, etc. Pass `{ kinds: [...] }` to filter (default: every chemistry kind). Use for ligand binding sites — `selection.hbonds.show()` is the right choice for intra-chain backbone H-bonds.",
    example:
      "pdb.select('PLP').contactsWith(pdb.select('within 4 of PLP and not PLP'), { kinds: ['hydrogen-bond', 'hydrophobic'] });",
  },
  {
    signature:
      'selection.distances.to(other, options?) / .color(spec) / .diameter(value)',
    description:
      "Add labeled distance lines from this selection to `other`. `color` and `diameter` set the default style for subsequent `.to(...)` calls; existing lines keep their original style. `options.customText` overrides the auto-generated distance label (pass `''` to hide it). `selection.distance(other)` is kept as a one-shot shorthand.",
    example:
      "pdb.select('PLP').distances.color('orange').to(pdb.select('within 3.5 of PLP and not PLP'));",
  },
  {
    signature: 'selection.<channel>.show() / .hide()',
    description:
      'Toggle the visibility of one rendering channel (`atoms`, `bonds`, `ribbon`, `surface`) for this selection without dropping its color/size state. Both methods return the channel so calls can be chained.',
    example: "pdb.select('water').atoms.hide();",
  },
  {
    signature: 'selection.label(template, options?)',
    description:
      "Add residue/element/chain labels using Mol*'s built-in label rep. The renderer picks a level based on which fields the template references (atom → element, chain → chain, otherwise residue). Custom-text templates are not yet supported — Mol* draws the level's default text. `options` mirror `ms.echo(...)`'s font preferences: `{ size, bold, italic, color }` (no `position` — labels are anchored to atoms). `size` is a Mol* size-factor multiplier on the default 3D text size.",
    example:
      // eslint-disable-next-line no-template-curly-in-string -- this string documents the template syntax
      "cys.select('.CA').label('${residue.name}${residue.number}', { size: 1.5, bold: true, color: 'red' });",
  },
  {
    signature: 'selection.select(expression)',
    description: 'Sub-select within this selection (intersection).',
    example: "const cAlpha = pdb.select('[CYS]').select('.CA');",
  },
  {
    signature: 'selection.focus()',
    description:
      'Zoom + center the camera on the bounding sphere of this selection (≈ JSmol `zoomto`).',
    example: "pdb.select('within 5 of PLP').focus();",
  },
  {
    signature: 'selection.zoom(factor?)',
    description:
      "Center + frame the camera on this selection's bounding sphere so it fills `factor` of the viewport. Defaults to `0.75` (75% of the viewport, with 25% margin). Because the bounding sphere is rotation-invariant, the framing is preserved while `ms.spin(...)` is active.",
    example: "pdb.select('108-122:A').zoom(0.6);",
  },
  {
    signature: 'selection.distance(other)',
    description:
      'Draw a labeled distance line between the centroids of this selection and `other`.',
    example:
      "pdb.select('PLP').distance(pdb.select('within 3.5 of PLP and not PLP'));",
  },
];

const PDB_METHODS: MethodEntry[] = [
  {
    signature: 'pdb.select(expression)',
    description:
      'Build a Selection from a JSmol-flavoured expression (see grammar table above).',
    example: "const helix = pdb.select('108-122:A');",
  },
  {
    signature: 'pdb.all  /  pdb.none',
    description:
      'Shortcut Selections covering every atom or no atoms, respectively.',
    example: "pdb.all.ribbon.color({ model: 'structure' });",
  },
  {
    signature: 'pdb.ramachandranPdb()',
    description:
      "Build a synthetic PDB string with one Cα per residue placed at `(φ, ψ, ω)` in degrees, plus three axis chains `X` / `Y` / `Z` connected by `CONECT` records. Pass to `pdb.createModel('rama', { pdb: ... })` to swap the protein view for the dihedral-space cloud.",
    example: "pdb.createModel('rama', { pdb: pdb.ramachandranPdb() });",
  },
  {
    signature: 'pdb.createModel(name, options?)',
    description:
      "Create a named view. The active model's PDB is inherited unless `{ pdb }` overrides it. The new model's op log **starts empty** — re-paint anything you want visible. The new model becomes active and `pdb` follows it; channel calls record into this model. Returns the same `pdb` handle.",
    example: "pdb.createModel('rainbow');",
  },
  {
    signature: 'pdb.switchModel(name)',
    description:
      "Activate a previously-created model. Tears down current `scripting` representations, reloads Mol* when the target PDB differs, then replays the target model's op log. Returns the same `pdb` handle.",
    example: "pdb.switchModel('initial');",
  },
  {
    signature: 'pdb.currentModel()',
    description: "Active model name — defaults to `'initial'`.",
    example: 'const name = pdb.currentModel();',
  },
  {
    signature: 'pdb.deleteModel(name)',
    description:
      "Remove a model by name. The `'initial'` model cannot be deleted, and the active model cannot be deleted (switch first).",
    example: "pdb.deleteModel('rainbow');",
  },
  {
    signature: 'pdb.listModels()',
    description: 'List every registered model name in creation order.',
    example: 'const names = pdb.listModels();',
  },
];

const MS_METHODS: MethodEntry[] = [
  {
    signature: 'ms.loadPDB(text)',
    description:
      'Parse PDB text and return a `pdb` handle exposing `.select`, `.chains`, `.all`, `.createModel`, …',
    example: 'const pdb = ms.loadPDB(text);',
  },
  {
    signature: 'ms.spin(axis, speedDegreesPerSecond?)',
    description:
      "Continuous rotation. `axis`: 'x' | 'y' | 'z' | 'off'. Default speed: 30 deg/s.",
    example: "ms.spin('y', 60);",
  },
  {
    signature: 'ms.rotate(options?)',
    description:
      "Finite rotation that returns when finished. `options`: `{ axis: 'x' | 'y' | 'z', degrees, speed }`. Defaults: `axis: 'y'`, `degrees: 360`, `speed: 60` (deg/s).",
    example: "ms.rotate({ axis: 'y', degrees: 180, speed: 90 });",
  },
  {
    signature: 'ms.resetCamera()',
    description: 'Reset to the default Mol* view of the loaded structure.',
    example: 'ms.resetCamera();',
  },
  {
    signature: 'ms.fit(factor?, options?)',
    description:
      "Frame every atom of the currently-loaded structure with a comfortable margin. `factor` is the fraction (0–1) of the viewport the bounding sphere should fill (default `0.85`). Pins the camera so subsequent rep additions don't undo the framing. Pass `{ seconds }` to animate. Useful after `pdb.switchModel(...)` to centre on the protein once a synthetic model (e.g. the Ramachandran cloud) has gone away.",
    example: 'ms.fit(0.85, { seconds: 1.5 });',
  },
  {
    signature: 'ms.selectionHalos(on)',
    description:
      'Show / hide Mol*’s yellow halos around the persistent selection.',
    example: 'ms.selectionHalos(true);',
  },
  {
    signature: 'ms.echo(text, options?)',
    description:
      "On-canvas title (HTML overlay). Options: `{ position: 'top'|'middle'|'bottom', size, bold, italic, color }`. Independent of any loaded molecule.",
    example: "ms.echo('Active site', { size: 30, color: 'navy' });",
  },
  {
    signature: 'ms.clearEcho()',
    description: 'Remove the current echo overlay.',
    example: 'ms.clearEcho();',
  },
  {
    signature: 'ms.clear()',
    description:
      'Wipe every representation/measurement/echo. Called automatically before each Run.',
    example: 'ms.clear();',
  },
  {
    signature: 'ms.reset()',
    description:
      "Restore the freshly-loaded view: clear every script-added representation and measurement, drop the persistent selection, and reset the camera to Mol*'s initial auto-frame (center, zoom, orientation). Same as the page's Reset button.",
    example: 'ms.reset();',
  },
  {
    signature: 'ms.hideDefaults() / ms.showDefaults()',
    description:
      'Toggle visibility of every component Mol* added through its default preset (polymer cartoon, ligand ball-and-stick, water spheres). Scripting-managed components are untouched. Call `hideDefaults()` at the start of a scene that needs full control of the canvas (e.g. truly hiding non-target helices).',
    example: 'ms.hideDefaults();',
  },
  {
    signature: 'ms.<kind>.show() / .hide()',
    description:
      'Hierarchical visibility aggregators. `ms.atoms` / `ms.bonds` / `ms.ribbon` / `ms.surface` / `ms.label` / `ms.hbonds` / `ms.distances` each toggle every cell of that kind across every selection without dropping color/size state — so `ms.hbonds.hide()` followed by `ms.hbonds.show()` restores the prior visual exactly.',
    example: 'ms.hbonds.hide();',
  },
];

const GLOBAL_METHODS: MethodEntry[] = [
  {
    signature: 'delay(seconds)',
    description:
      'Pause the script. Combine with `ms.spin` to give the camera time to rotate before the next change.',
    example: 'delay(2);',
  },
];

/**
 * Render the user guide for the scripting API.
 * @returns JSX element containing the full reference.
 */
export default function ScriptingHelp() {
  return (
    <div className="scripting-help">
      <section>
        <h3>Quick start</h3>
        <p>Three globals are available to every script:</p>
        <ul>
          <li>
            <code>text</code> — raw PDB text of the loaded structure.
          </li>
          <li>
            <code>MolStar</code> — class for the 3D viewer (Mol*). Build a
            viewer with <code>{`const ms = new MolStar();`}</code>, then load
            the structure with <code>{`const pdb = ms.loadPDB(text);`}</code>.
          </li>
          <li>
            <code>delay(seconds)</code> — <code>{`delay(2);`}</code> to pause
            the script.
          </li>
        </ul>
        <p>
          A Selection (returned by <code>pdb.select(...)</code>) carries four
          channel objects — <code>.atoms</code>, <code>.bonds</code>,{' '}
          <code>.ribbon</code>, <code>.surface</code> — plus{' '}
          <code>.label(template)</code>, <code>.select(sub)</code>,{' '}
          <code>.focus()</code>, <code>.zoom()</code>,{' '}
          <code>.distance(other)</code>. Channel calls are idempotent: calling{' '}
          <code>{`bonds.diameter(0.4)`}</code> then{' '}
          <code>{`bonds.color({...})`}</code> updates the same Mol*
          representation, it does not stack two visuals.
        </p>
        <p>
          Scripts run in <em>linear</em> mode: the runner inserts{' '}
          <code>await</code> automatically before every call to a{' '}
          <code>Promise</code>-returning method, so you can write the script as
          a flat sequence of statements. Explicit <code>await</code> is also
          accepted (the rewrite is idempotent) for power users.
        </p>
        <p>
          Channel methods (<code>color</code>, <code>radius</code>,{' '}
          <code>diameter</code>, <code>dots</code>, <code>show</code>,{' '}
          <code>hide</code>) return the channel itself so you can chain them:{' '}
          <code>{`bonds.diameter(0.4).color({ model: 'atoms' })`}</code> sets
          both attributes in one statement. Each channel keeps its own internal
          queue, so awaiting the chain waits for every queued op.
        </p>
        <pre className="scripting-help-code">{`const ms = new MolStar();
const pdb = ms.loadPDB(text);
ms.echo('My first scene', { size: 28 });

const protein = pdb.select('not PLP');
protein.ribbon.color({ model: 'structure' });

const cys = pdb.select('[CYS]');
cys.bonds.diameter(0.4).color({ model: 'atoms', alpha: 0.8 });
cys.atoms.radius({ value: 1.4 });

pdb.select('PLP').focus();
ms.spin('y');`}</pre>
        <p>
          The <code>pdb</code> handle also exposes parsed-data fields:{' '}
          <code>pdb.atoms</code>, <code>pdb.residues</code>,{' '}
          <code>pdb.chains</code>, <code>pdb.ligands</code>,{' '}
          <code>pdb.helices</code>, <code>pdb.sheets</code>,{' '}
          <code>pdb.text</code>. <code>pdb.helices</code> is one entry per HELIX
          record (so <code>pdb.helices.length</code> is the helix count);{' '}
          <code>pdb.sheets</code> is one entry per SHEET record (each entry is a
          β-strand — a single β-sheet usually contains several).
        </p>
      </section>

      <section>
        <h3>Selection grammar</h3>
        <p>
          <code>pdb.select(expression)</code> compiles a JSmol-flavoured
          expression. Compose with <code>and</code>, <code>or</code>,{' '}
          <code>not</code>, parentheses, and <code>within X of …</code>.
        </p>
        <HTMLTable className="scripting-help-table" compact striped>
          <thead>
            <tr>
              <th>Expression</th>
              <th>Selects</th>
            </tr>
          </thead>
          <tbody>
            {SELECTION_EXAMPLES.map(([expression, description]) => (
              <tr key={expression}>
                <td>
                  <code>{expression}</code>
                </td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </section>

      <MethodSection
        title="Selection — channels and helpers"
        entries={SELECTION_METHODS}
      />
      <MethodSection title="pdb — structure-level" entries={PDB_METHODS} />
      <MethodSection title="ms — viewer / camera" entries={MS_METHODS} />
      <MethodSection title="Global helpers" entries={GLOBAL_METHODS} />

      <section>
        <h3>Color spec</h3>
        <p>
          Every <code>color(spec)</code> call accepts one of:
        </p>
        <ul>
          <li>
            CSS color name or hex shortcut — <code>{`'limegreen'`}</code>,{' '}
            <code>{`'#ff8000'`}</code>, <code>{`'#f80'`}</code>
          </li>
          <li>
            Explicit value — <code>{`{ value: 'limegreen' }`}</code>
          </li>
          <li>
            A theme — <code>{`{ model: 'chain' }`}</code> /{' '}
            <code>{`'element'`}</code> / <code>{`'atoms'`}</code> (= per-bond
            endpoint atoms) / <code>{`'structure'`}</code> /{' '}
            <code>{`'residue'`}</code> / <code>{`'sequence'`}</code> /{' '}
            <code>{`'hydrophobicity'`}</code> / <code>{`'molecule-type'`}</code>
          </li>
          <li>
            Translucent variant —{' '}
            <code>{`{ color: 'magenta', alpha: 0.6 }`}</code> or{' '}
            <code>{`{ color: { model: 'structure' }, alpha: 0.4 }`}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3>Notes &amp; limitations</h3>
        <ul>
          <li>
            Each Run starts from a clean slate — every channel is purely
            additive. There is no <code>hide</code> verb; just don&apos;t add
            what you don&apos;t want.
          </li>
          <li>
            <code>label(template)</code> currently uses Mol*&apos;s built-in
            level-based label text (chain id; residue name + seq; atom name).
            The template chooses the level but does not yet drive custom text.
          </li>
          <li>
            <code>ms.spin</code> persists between scenes. Call{' '}
            <code>{`ms.spin('off')`}</code> to stop it.
          </li>
          <li>
            JSmol&apos;s <code>moveto</code> with explicit camera matrices is
            not ported. Use <code>{`selection.focus()`}</code> instead.
          </li>
          <li>
            <code>selection.hbonds</code> drives Mol*&apos;s chemistry-aware
            <code> computeInteractions</code> on a sub-structure built from the
            selection&apos;s atoms with <code>skipIntraContacts: false</code>,
            then translates the donor/acceptor pairs to{' '}
            <code>CustomInteractions</code> schemas so{' '}
            <code>InteractionsShape</code> renders them as dashed cylinders.
            Reusing Mol*&apos;s detector means we get donor/acceptor typing,
            geometric scoring, and side-chain donors / acceptors for free — no
            naive N…O matching, no bifurcated artefacts.
          </li>
          <li>
            <code>selection.contactsWith(other)</code> uses a different entry
            point (<code>ComputeContacts</code>) that only emits inter-group
            edges. Right tool for ligand binding sites; wrong tool for inside
            one chain.
          </li>
          <li>
            <code>helix</code> / <code>sheet</code> selections rely on the HELIX
            / SHEET records present in the PDB text — files without those
            records will return an empty selection.
          </li>
        </ul>
      </section>
    </div>
  );
}

interface MethodSectionProps {
  title: string;
  entries: MethodEntry[];
}

function MethodSection({ title, entries }: MethodSectionProps) {
  return (
    <section>
      <h3>{title}</h3>
      <dl className="scripting-help-methods">
        {entries.map((entry) => (
          <div key={entry.signature} className="scripting-help-method">
            <dt>
              <code>{entry.signature}</code>
            </dt>
            <dd>
              <p>{entry.description}</p>
              <pre className="scripting-help-code">{entry.example}</pre>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
