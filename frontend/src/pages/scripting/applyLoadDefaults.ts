/**
 * Apply the Scripting page's default themes after a fresh Mol* preset load.
 *
 * Defaults:
 *   - Polymer cartoon (the ribbon) → `secondary-structure`.
 *   - Ligand / non-standard / water / ion / lipid → Mol*'s built-in
 *     `element-symbol` theme, which renders ball-and-stick atoms with the
 *     usual element colors (carbon grey, oxygen red, …) and half-bond
 *     cylinders coloured to match each end's atom. Achieved by *not*
 *     passing a `globalName` to `applyPreset` — only the polymer needs an
 *     explicit override.
 *
 * Called from both the initial `PdbViewer` load and from
 * `models.ts` `loadInMolstar` (the script-driven model-swap path) so the two
 * paths land on the same visual baseline.
 */

import type { PluginContext } from './molstarTypes.ts';

/**
 * Re-theme the polymer cartoon to `secondary-structure`. Other components
 * keep whatever theme Mol*'s `auto` preset assigned (typically
 * `element-symbol` for ligands and waters).
 * @param plugin - The Mol* plugin to operate on.
 */
export async function applyScriptingLoadDefaults(
  plugin: PluginContext,
): Promise<void> {
  const structureRef =
    plugin.managers.structure.hierarchy.current.structures[0];
  if (!structureRef) return;
  await plugin.managers.structure.component.updateRepresentationsTheme(
    structureRef.components,
    (_component, representation) =>
      representation.cell.transform.tags?.includes('polymer')
        ? { color: 'secondary-structure' }
        : {},
  );
}
