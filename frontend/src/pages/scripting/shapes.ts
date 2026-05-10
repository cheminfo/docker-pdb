/**
 * Custom-shape primitives for the Scripting page. Defines a single Mol* state
 * transformer (`ScriptingShape`) that turns a list of cylinder / arrow /
 * sphere specs into a `Shape.Provider` node, then chains it into Mol*'s
 * `ShapeRepresentation3D`. Exposed to scripts as `ms.arrow(...)`,
 * `ms.cylinder(...)`, `ms.sphere(...)` — see `MolStar.ts`.
 *
 * Shape construction follows Mol*'s canonical pattern (see
 * `mol-plugin-state/transforms/shape.ts` `BoxShape3D`): the transformer
 * declares `params: Mesh.Params` as the *schema*, and the geometry is
 * built lazily inside `getShape`. Heavy Mol* imports are confined to this
 * module so it can be lazy-loaded by `ScriptingPage.tsx`.
 */

import { addCylinder } from 'molstar/lib/mol-geo/geometry/mesh/builder/cylinder';
import { addSphere } from 'molstar/lib/mol-geo/geometry/mesh/builder/sphere';
import { Mesh } from 'molstar/lib/mol-geo/geometry/mesh/mesh';
import { MeshBuilder } from 'molstar/lib/mol-geo/geometry/mesh/mesh-builder';
import { Vec3 } from 'molstar/lib/mol-math/linear-algebra';
import { Shape } from 'molstar/lib/mol-model/shape';
import {
  PluginStateObject as SO,
  PluginStateTransform,
} from 'molstar/lib/mol-plugin-state/objects';
import { Task } from 'molstar/lib/mol-task';
import { Color } from 'molstar/lib/mol-util/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';

/** A single 3D point as a tuple — what scripts pass for `from` / `to` / etc. */
export type Vec3Tuple = readonly [number, number, number];

/** One primitive in a shape group. Each primitive renders as a sub-mesh. */
export type ShapePrimitive =
  | {
      kind: 'cylinder';
      from: Vec3Tuple;
      to: Vec3Tuple;
      radius: number;
      colorHex: number;
      label?: string;
    }
  | {
      kind: 'arrow';
      from: Vec3Tuple;
      to: Vec3Tuple;
      radius: number;
      colorHex: number;
      label?: string;
      /** Length of the conical head (Å). Defaults to `4 × radius`. */
      headLength?: number;
      /** Base radius of the cone (Å). Defaults to `2.4 × radius`. */
      headRadius?: number;
    }
  | {
      kind: 'sphere';
      center: Vec3Tuple;
      radius: number;
      colorHex: number;
      label?: string;
    };

const RADIAL_SEGMENTS = 16;
const SPHERE_DETAIL = 2;

/**
 * State-tree transformer that consumes a list of {@link ShapePrimitive}s
 * and produces a `Shape.Provider`. Apply the result with Mol*'s
 * `ShapeRepresentation3D` to render it. Registered with Mol* the first
 * time this module is imported.
 */
/* eslint-disable new-cap -- Mol* exports `BuiltIn` / `Value` / `Text` / `Color` as callable factories */
export const ScriptingShape = PluginStateTransform.BuiltIn({
  name: 'scripting-shape',
  display: { name: 'Scripting Shape' },
  from: SO.Root,
  to: SO.Shape.Provider,
  params: {
    primitives: PD.Value<readonly ShapePrimitive[]>([], { isHidden: true }),
    label: PD.Text('Scripting Shapes'),
  },
})({
  canAutoUpdate() {
    return true;
  },
  apply({ params }) {
    return Task.create('Scripting Shape', async () => {
      // Mol*'s canonical Shape.Provider pattern (see
      // `mol-plugin-state/transforms/shape.ts` `BoxShape3D`):
      // - `params` is the param SCHEMA (`Mesh.Params`), not values
      // - the mesh is built inside `getShape`, not outside
      // - the constructor takes (data, options) with a `{ label }` options
      return new SO.Shape.Provider(
        {
          label: params.label,
          data: params,
          params: Mesh.Params,
          getShape: (_ctx, data) => {
            const built = buildMesh(data.primitives);
            return Shape.create(
              data.label,
              data.primitives,
              built.mesh,
              (group: number) => Color(built.colors[group] ?? 0xff_ff_ff),
              () => 1,
              (group: number) => built.labels[group] ?? data.label,
            );
          },
          geometryUtils: Mesh.Utils,
        },
        { label: params.label },
      );
    });
  },
});
/* eslint-enable new-cap */

interface BuiltShape {
  mesh: Mesh;
  colors: number[];
  labels: string[];
}

function buildMesh(primitives: readonly ShapePrimitive[]): BuiltShape {
  const builderState = MeshBuilder.createState(
    primitives.length * 64,
    primitives.length * 32,
  );
  const colors: number[] = [];
  const labels: string[] = [];
  const fromVec = Vec3.zero();
  const toVec = Vec3.zero();
  const tipBaseVec = Vec3.zero();
  const dirVec = Vec3.zero();
  let group = 0;
  for (const primitive of primitives) {
    builderState.currentGroup = group;
    colors[group] = primitive.colorHex;
    labels[group] = primitive.label ?? '';
    if (primitive.kind === 'cylinder') {
      Vec3.set(
        fromVec,
        primitive.from[0],
        primitive.from[1],
        primitive.from[2],
      );
      Vec3.set(toVec, primitive.to[0], primitive.to[1], primitive.to[2]);
      addCylinder(builderState, fromVec, toVec, 1, {
        radiusTop: primitive.radius,
        radiusBottom: primitive.radius,
        topCap: true,
        bottomCap: true,
        radialSegments: RADIAL_SEGMENTS,
      });
    } else if (primitive.kind === 'arrow') {
      Vec3.set(
        fromVec,
        primitive.from[0],
        primitive.from[1],
        primitive.from[2],
      );
      Vec3.set(toVec, primitive.to[0], primitive.to[1], primitive.to[2]);
      Vec3.sub(dirVec, toVec, fromVec);
      const length = Vec3.magnitude(dirVec);
      if (length > 0) {
        const headLength = primitive.headLength ?? primitive.radius * 4;
        const headRadius = primitive.headRadius ?? primitive.radius * 2.4;
        const shaftLength = Math.max(0, length - headLength);
        Vec3.scale(dirVec, dirVec, 1 / length);
        Vec3.scaleAndAdd(tipBaseVec, fromVec, dirVec, shaftLength);
        if (shaftLength > 0) {
          addCylinder(builderState, fromVec, tipBaseVec, 1, {
            radiusTop: primitive.radius,
            radiusBottom: primitive.radius,
            topCap: true,
            bottomCap: true,
            radialSegments: RADIAL_SEGMENTS,
          });
        }
        // Cone: narrow point at `toVec` (the +tip), wide base at
        // `tipBaseVec` (shaft side). The canonical Mol* pattern is
        // `radiusBottom = wide, radiusTop = 0` (mirroring `mvs` and
        // `interactions` arrows), but in this Mol* build that visibly
        // produces an inverted cone for arrows whose direction is
        // perpendicular to world +Y (i.e. X / Z axes) — only Y-aligned
        // arrows render correctly with that pattern. We special-case
        // axis-perpendicular cones with the inverse parameter pair so
        // all three arrows read as a tip-pointing-toward-`toVec` shape.
        const isUpAligned = Math.abs(dirVec[1] ?? 0) > 0.99;
        if (isUpAligned) {
          addCylinder(builderState, tipBaseVec, toVec, 1, {
            radiusTop: 0,
            radiusBottom: headRadius,
            topCap: false,
            bottomCap: true,
            radialSegments: RADIAL_SEGMENTS,
          });
        } else {
          addCylinder(builderState, tipBaseVec, toVec, 1, {
            radiusTop: headRadius,
            radiusBottom: 0,
            topCap: true,
            bottomCap: false,
            radialSegments: RADIAL_SEGMENTS,
          });
        }
      }
    } else {
      Vec3.set(
        fromVec,
        primitive.center[0],
        primitive.center[1],
        primitive.center[2],
      );
      addSphere(builderState, fromVec, primitive.radius, SPHERE_DETAIL);
    }
    group += 1;
  }
  return {
    mesh: MeshBuilder.getMesh(builderState),
    colors,
    labels,
  };
}

/**
 * Add a list of shape primitives to the plugin state tree as a single
 * Shape representation. Returns the ref of the resulting representation
 * node so it can be removed later.
 * @param plugin - Mol* plugin context (loosely typed; we cast to access
 *   `state.data.build()`).
 * @param primitives - Geometry to render.
 * @param shapeRepresentation3D - Mol*'s `ShapeRepresentation3D` transformer
 *   (lazy-loaded once per page; threaded through context).
 * @param options - Optional state-tree options.
 * @param options.label - Display label shown in the Mol* state tree.
 * @param options.tags - State-tree tags. The tag `'scripting'` opts the shape
 *   into the channel-system teardown so model swaps remove it cleanly.
 * @returns The `ref` of the created representation cell.
 */
export async function addShape(
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
      ScriptingShape,
      { primitives, label: options.label ?? 'Scripting Shapes' },
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
