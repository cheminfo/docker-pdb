/**
 * Static help panel rendered below the editor on the Animate page. Documents
 * every helper available on the `api` object and the selection grammar
 * accepted by `api.select(...)`. The content is intentionally embedded as
 * TSX (rather than markdown) so it ships in the same bundle as the page
 * and stays in lockstep with the helper surface.
 */

const SELECTION_EXAMPLES: Array<[string, string]> = [
  ['all', 'every atom'],
  ['none', 'no atoms'],
  ['protein', 'all amino-acid residues'],
  ['ligand', 'non-polymer / non-water entities (e.g. PLP, HEM)'],
  ['water', 'every water molecule'],
  ['polymer', 'protein + nucleic acid (any polymer)'],
  ['nucleic', 'DNA + RNA residues'],
  ['hetero', 'everything that is not a polymer'],
  ['PLP', 'every residue whose 3-letter code is PLP'],
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

const REPRESENTATIONS: MethodEntry[] = [
  {
    signature: 'api.cpk(selection, options?)',
    description:
      'CPK / spacefill spheres. `options.scale` sets sphere radius (≈0.3 = bond-and-stick size).',
    example:
      "await api.cpk(api.select('PLP'), { scale: 0.4, color: 'limegreen' });",
  },
  {
    signature: 'api.wireframe(selection, options?)',
    description:
      'Ball-and-stick / bond cylinders. `options.scale` sets bond thickness.',
    example: "await api.wireframe(api.select('108-122:A'), { scale: 0.15 });",
  },
  {
    signature: 'api.cartoon(selection, options?)',
    description: 'Mol*-style cartoon (helices/sheets/loops).',
    example: "await api.cartoon(api.all, { color: { by: 'structure' } });",
  },
  {
    signature: 'api.ribbon(selection, options?)',
    description:
      'Alias for `cartoon` — Mol*’s cartoon already includes ribbons.',
    example:
      "await api.ribbon(api.select('not PLP'), { color: { by: 'chain' } });",
  },
  {
    signature: 'api.surface(selection, options?)',
    description: 'Smooth molecular surface (Connolly).',
    example:
      "await api.surface(api.select('protein'), { color: { by: 'hydrophobicity', alpha: 0.7 } });",
  },
  {
    signature: 'api.dots(selection, options?)',
    description:
      'Dotted Gaussian surface — closest analogue to JSmol `dots ON`.',
    example: "await api.dots(api.select('PLP'), { color: 'limegreen' });",
  },
];

const CAMERA: MethodEntry[] = [
  {
    signature: 'api.focus(selection)',
    description:
      'Zoom + center on the bounding sphere of `selection` (≈ JSmol `zoomto`).',
    example: "await api.focus(api.select('within 5 of PLP'));",
  },
  {
    signature: 'api.resetCamera()',
    description: 'Reset to the default Mol* view of the loaded structure.',
    example: 'await api.resetCamera();',
  },
  {
    signature: 'api.spin(axis, speedRpm?)',
    description:
      "Continuous rotation. `axis`: 'x' | 'y' | 'z' | 'off'. Default speed: 1 rpm.",
    example: "await api.spin('y', 2);",
  },
];

const OVERLAY: MethodEntry[] = [
  {
    signature: 'api.echo(text, options?)',
    description:
      "On-canvas title (HTML overlay). Options: `{ position: 'top'|'middle'|'bottom', size, bold, italic, color }`.",
    example: "api.echo('Active site', { size: 30, color: 'navy' });",
  },
  {
    signature: 'api.clearEcho()',
    description: 'Remove the current echo overlay.',
    example: 'api.clearEcho();',
  },
  {
    signature: 'api.ramachandran(options?)',
    description:
      "2D overlay with two panels: a standard Ramachandran (φ × ψ) and an ω plot rotated 90° about the y-axis (residue index × ω) so cis vs trans peptide bonds are immediately visible. Each point is colored green (trans, |ω|>150°), red (cis, |ω|<30°), or gray. Options: `{ position: 'top-left'|'top-right'|'bottom-left'|'bottom-right', highlight: string[] }` where each highlight entry is `'resNum:chainId'`.",
    example:
      "api.ramachandran({ position: 'bottom-right', highlight: ['29:A', '166:A'] });",
  },
  {
    signature: 'api.clearRamachandran()',
    description: 'Remove the Ramachandran overlay.',
    example: 'api.clearRamachandran();',
  },
];

const TIMING_AND_OTHER: MethodEntry[] = [
  {
    signature: 'api.delay(seconds)',
    description:
      'Pause the script. Combine with `spin` to give the camera time to rotate before the next change.',
    example: 'await api.delay(2);',
  },
  {
    signature: 'api.selectionHalos(on)',
    description:
      'Show / hide Mol*’s yellow halos around the persistent selection.',
    example: 'await api.selectionHalos(true);',
  },
  {
    signature: 'api.distance(sel1, sel2)',
    description:
      'Draw a labeled distance line between the centroids of two selections.',
    example:
      "await api.distance(api.select('PLP'), api.select('within 3.5 of PLP and not PLP'));",
  },
  {
    signature: 'api.clear()',
    description:
      'Wipe every representation/measurement/echo. Called automatically before each Run.',
    example: 'await api.clear();',
  },
];

/**
 * Render the user guide for the Animate scripting API.
 * @returns JSX element containing the full reference.
 */
export default function AnimateHelp() {
  return (
    <div className="animate-help">
      <section>
        <h3>Quick start</h3>
        <p>
          Each scene is a regular async JavaScript function whose only argument
          is
          <code>api</code>. Every helper that touches Mol* is async, so prefix
          it with <code>await</code>.
        </p>
        <pre className="animate-help-code">{`api.echo('My first scene', { size: 28 });
const protein = api.select('not PLP');
await api.cartoon(protein, { color: { by: 'structure' } });
await api.cpk(api.select('PLP'), { scale: 0.4, color: 'limegreen' });
await api.focus(api.select('within 5 of PLP'));
await api.spin('y');`}</pre>
      </section>

      <section>
        <h3>
          <code>api.select(expression)</code> — selections
        </h3>
        <p>
          Builds an opaque <code>Selection</code> token from a JSmol-flavoured
          expression. Compose with <code>and</code>, <code>or</code>,{' '}
          <code>not</code>, parentheses, and <code>within X of …</code>.
          Shortcuts: <code>api.all</code>, <code>api.none</code>.
        </p>
        <table className="animate-help-table">
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
        </table>
      </section>

      <MethodSection title="Representations" entries={REPRESENTATIONS} />
      <MethodSection title="Camera" entries={CAMERA} />
      <MethodSection title="Overlays" entries={OVERLAY} />
      <MethodSection title="Timing & utilities" entries={TIMING_AND_OTHER} />

      <section>
        <h3>Color spec</h3>
        <p>
          Every representation accepts <code>options.color</code>, which can be
          one of:
        </p>
        <ul>
          <li>
            CSS color name or hex — <code>{`'limegreen'`}</code>,{' '}
            <code>{`'#ff8000'`}</code>, <code>{`'#f80'`}</code>
          </li>
          <li>
            A theme object — <code>{`{ by: 'chain' }`}</code> /{' '}
            <code>{`'element'`}</code> / <code>{`'structure'`}</code> /{' '}
            <code>{`'residue'`}</code> / <code>{`'sequence'`}</code> /{' '}
            <code>{`'hydrophobicity'`}</code> / <code>{`'molecule-type'`}</code>
          </li>
          <li>
            Translucent variant —{' '}
            <code>{`{ color: 'magenta', alpha: 0.6 }`}</code> or{' '}
            <code>{`{ color: { by: 'structure' }, alpha: 0.4 }`}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3>Notes & limitations</h3>
        <ul>
          <li>
            Each Run starts from a clean slate — every helper that adds a
            representation is purely additive. There is no <code>hide</code>{' '}
            verb; just don&apos;t add what you don&apos;t want.
          </li>
          <li>
            <code>spin</code> persists between scenes. Call{' '}
            <code>{`await api.spin('off')`}</code> to stop it.
          </li>
          <li>
            JSmol&apos;s <code>moveto</code> with explicit camera matrices is
            not ported. Use <code>focus(selection)</code> instead.
          </li>
          <li>H-bond rendering is not yet implemented in this v1.</li>
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
      <dl className="animate-help-methods">
        {entries.map((entry) => (
          <div key={entry.signature} className="animate-help-method">
            <dt>
              <code>{entry.signature}</code>
            </dt>
            <dd>
              <p>{entry.description}</p>
              <pre className="animate-help-code">{entry.example}</pre>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
