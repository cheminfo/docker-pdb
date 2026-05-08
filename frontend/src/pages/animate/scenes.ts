/**
 * Demonstration scenes ported from the historical JSmol teaching tool. Each
 * `code` string is exactly what gets loaded into the editor when the user
 * clicks the matching button on the Animate page.
 */
export interface Scene {
  id: string;
  label: string;
  code: string;
}

const GLOBAL_VIEW = `// Global view: everything but the PLP cofactor as a ribbon coloured
// by secondary structure, and the PLP rendered as a translucent surface.
api.echo('Global View', { size: 30, italic: true });

const protein = api.select('not PLP');
await api.ribbon(protein, { color: { by: 'structure' } });
await api.spin('y');

const ligand = api.select('PLP');
await api.dots(ligand, { color: 'limegreen' });
`;

const DISPLAY_HELIX = `// Alpha helix on chain A, residues 108-122. Highlights the helix in
// translucent magenta then zooms in on its side chains.
api.echo('Alpha Helix: residues 108-122, chain A', { size: 26, italic: true });

await api.ribbon(api.select('not PLP'), { color: { by: 'structure', alpha: 0.4 } });

const helix = api.select('108-122:A');
await api.ribbon(helix, { color: { color: 'magenta', alpha: 0.8 } });
await api.spin('y');
await api.delay(2);

await api.focus(helix);
await api.cpk(helix, { scale: 0.3, color: { by: 'element' } });
await api.wireframe(helix, { scale: 0.15 });
await api.delay(3);
`;

const DISPLAY_SHEET = `// Two beta strands on chain A (residues 99-105 and 267-274) highlighted
// in translucent lime, then zoomed in.
api.echo('Beta Strands: 99-105 and 267-274, chain A', { size: 24, italic: true });

await api.ribbon(api.select('not PLP'), { color: { by: 'structure', alpha: 0.4 } });

const sheets = api.select('99-105:A or 267-274:A');
await api.ribbon(sheets, { color: { color: 'limegreen', alpha: 0.7 } });
await api.spin('y');
await api.delay(2);

await api.focus(sheets);
await api.cpk(sheets, { scale: 0.3, color: { by: 'element' } });
await api.wireframe(sheets, { scale: 0.15 });
await api.delay(3);
`;

const RAMACHANDRAN = `// Ramachandran (φ × ψ) + ω rotated 90° about the y-axis (cis / trans).
// Both panels are drawn as a 2D overlay on top of the Mol* canvas. Five
// residues are highlighted in blue on both panels and rendered as
// ball-and-stick in the 3D view to make them easy to locate.
api.echo('Ramachandran + ω (cis / trans)', { size: 22, italic: true });

await api.ribbon(api.all, { color: { by: 'structure', alpha: 0.5 } });

const targets = api.select('29:A or 166:A or 192:A or 296:A or 358:A');
await api.cpk(targets, { scale: 0.3, color: { by: 'element' } });
await api.wireframe(targets, { scale: 0.15 });

api.ramachandran({
  position: 'bottom-right',
  highlight: ['29:A', '166:A', '192:A', '296:A', '358:A'],
});

await api.focus(targets);
`;

const INTERACTION = `// Show every atom within 3.5 Å of the PLP cofactor with a ball-and-stick
// detail and draw a labeled distance from PLP to that contact shell.
api.echo('Atoms within 3.5 Å of PLP', { size: 22, italic: true });

await api.ribbon(api.select('not PLP'), { color: { by: 'structure', alpha: 0.4 } });

const ligand = api.select('PLP');
await api.cpk(ligand, { scale: 0.4, color: 'limegreen' });

const close = api.select('within 3.5 of PLP and not PLP');
await api.cpk(close, { scale: 0.3, color: { by: 'element' } });
await api.wireframe(close, { scale: 0.15 });

await api.focus(api.select('PLP or within 3.5 of PLP'));
await api.distance(ligand, close);
`;

export const SCENES: Scene[] = [
  { id: 'global', label: 'Global view', code: GLOBAL_VIEW },
  { id: 'helix', label: 'Display helix', code: DISPLAY_HELIX },
  { id: 'sheet', label: 'Display β-sheet', code: DISPLAY_SHEET },
  { id: 'ramachandran', label: 'Ramachandran', code: RAMACHANDRAN },
  { id: 'interaction', label: 'Interaction 3.5 Å', code: INTERACTION },
];

export const DEFAULT_SCENE_CODE = GLOBAL_VIEW;
