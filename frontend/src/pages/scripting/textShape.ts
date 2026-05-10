/**
 * Custom-shape primitive for free-floating 3D text. Defines the Mol* state
 * transformer `ScriptingTextShape` — a sibling of `ScriptingShape` (mesh)
 * specialised on the `Text` geometry pipeline. Exposed to scripts as
 * `ms.text(position, text, options)`.
 *
 * Mol*'s built-in label representation reads the residue identifier from
 * the structure (`${comp} ${seq}`), which is fine for atom-anchored
 * labels but rules out arbitrary text like Greek letters. The Text-based
 * shape pipeline lets us draw any string at any world coordinate.
 */

import { Text } from 'molstar/lib/mol-geo/geometry/text/text';
import { TextBuilder } from 'molstar/lib/mol-geo/geometry/text/text-builder';
import { Shape } from 'molstar/lib/mol-model/shape';
import {
  PluginStateObject as SO,
  PluginStateTransform,
} from 'molstar/lib/mol-plugin-state/objects';
import { Task } from 'molstar/lib/mol-task';
import { Color } from 'molstar/lib/mol-util/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';

/** A single 3D text label rendered through Mol*'s `Text` geometry. */
export interface TextPrimitive {
  position: readonly [number, number, number];
  text: string;
  colorHex: number;
  /** Size factor (multiplier on the default 3D text size). Defaults to `1`. */
  size?: number;
  /** Render the glyphs in bold. Defaults to `false`. */
  bold?: boolean;
  /** Render the glyphs in italic. Defaults to `false`. */
  italic?: boolean;
  /** Tooltip shown on hover; falls back to the rendered text. */
  label?: string;
}

/**
 * State-tree transformer that consumes a list of {@link TextPrimitive}s
 * and produces a `Shape.Provider` over `Text` geometry. Apply the result
 * with Mol*'s `ShapeRepresentation3D` to render it. Registered with
 * Mol* the first time this module is imported.
 */
/* eslint-disable new-cap -- Mol* exports `BuiltIn` / `Value` / `Text` / `Color` as callable factories */
export const ScriptingTextShape = PluginStateTransform.BuiltIn({
  name: 'scripting-text-shape',
  display: { name: 'Scripting Text Shape' },
  from: SO.Root,
  to: SO.Shape.Provider,
  params: {
    primitives: PD.Value<readonly TextPrimitive[]>([], { isHidden: true }),
    label: PD.Text('Scripting Text'),
  },
})({
  canAutoUpdate() {
    return true;
  },
  apply({ params }) {
    return Task.create('Scripting Text Shape', async () => {
      // Same `Shape.Provider` pattern used by `ScriptingShape` in `shapes.ts`,
      // but the geometry pipeline is `Text` instead of `Mesh`. The text
      // is built lazily inside `getShape`.
      return new SO.Shape.Provider(
        {
          label: params.label,
          data: params,
          params: Text.Params,
          getShape: (_ctx, data) => {
            const built = buildText(data.primitives);
            return Shape.create(
              data.label,
              data.primitives,
              built.text,
              (group: number) => Color(built.colors[group] ?? 0xff_ff_ff),
              () => 1,
              (group: number) => built.labels[group] ?? data.label,
            );
          },
          geometryUtils: Text.Utils,
        },
        { label: params.label },
      );
    });
  },
});
/* eslint-enable new-cap */

function buildText(primitives: readonly TextPrimitive[]) {
  // FontAtlas params (`fontWeight`, `fontStyle`) are baked into the
  // glyph atlas at build time, so they apply to every primitive in this
  // builder. Each `ms.text(...)` call lives in its own `ScriptingTextShape`
  // node, so the first primitive's styling is effectively per-call.
  const first = primitives[0];
  const fontProps: Record<string, unknown> = {};
  if (first?.bold) fontProps.fontWeight = 'bold';
  if (first?.italic) fontProps.fontStyle = 'italic';
  const builder = TextBuilder.create(
    fontProps,
    Math.max(primitives.length, 1) * 8,
    Math.max(primitives.length, 1) * 4,
  );
  const colors: number[] = [];
  const labels: string[] = [];
  let group = 0;
  for (const primitive of primitives) {
    const [x, y, z] = primitive.position;
    const scale = primitive.size ?? 1;
    builder.add(primitive.text, x, y, z, 1, scale, group);
    colors[group] = primitive.colorHex;
    labels[group] = primitive.label ?? primitive.text;
    group += 1;
  }
  return {
    text: builder.getText(),
    colors,
    labels,
  };
}

/**
 * Add a list of text primitives to the plugin state tree as a single
 * Shape representation.
 * @param plugin - Mol* plugin context (loosely typed).
 * @param primitives - Text labels to render.
 * @param shapeRepresentation3D - Mol*'s `ShapeRepresentation3D` transformer
 *   (lazy-loaded once per page; threaded through context).
 * @param options - Optional state-tree options.
 * @param options.label - Display label shown in the Mol* state tree.
 * @param options.tags - State-tree tags. The tag `'scripting'` opts the shape
 *   into the channel-system teardown so model swaps remove it cleanly.
 * @returns The `ref` of the created representation cell.
 */
export async function addTextShape(
  plugin: unknown,
  primitives: readonly unknown[],
  shapeRepresentation3D: unknown,
  options: { label?: string; tags?: string[] } = {},
): Promise<string> {
  const builder = (
    plugin as {
      state: { data: { build: () => MolStateBuilder } };
    }
  ).state.data.build();
  const repr = builder
    .toRoot()
    .apply(
      ScriptingTextShape,
      { primitives, label: options.label ?? 'Scripting Text' },
      { tags: options.tags },
    )
    .apply(shapeRepresentation3D);
  await builder.commit();
  return repr.selector.ref;
}

interface MolStateBuilder {
  toRoot: () => MolStateBuilderNode;
  commit: () => Promise<void>;
}

interface MolStateBuilderNode {
  apply: (
    transformer: unknown,
    params?: Record<string, unknown>,
    options?: { tags?: string[] },
  ) => MolStateBuilderNode & { selector: { ref: string } };
}
