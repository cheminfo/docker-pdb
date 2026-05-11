import type { PluginContext } from './molstarTypes.ts';

interface ResetSceneArg {
  boundingSphereVisible: { center: unknown; radius: number };
}

interface ResetCameraArg {
  getInvariantFocus: (
    target: unknown,
    radius: number,
    up: unknown,
    dir: unknown,
  ) => unknown;
}

/**
 * Snapshot factory passed to `plugin.managers.camera.reset(fn, 0)` so that
 * the reset truly snaps back to the canonical orientation: target = scene
 * center, up = +Y, look direction = -Z. Using `getInvariantFocus` (rather
 * than the default `getFocus`) is essential — it copies `up` and `dir`
 * directly instead of preserving whatever the camera was doing.
 * @param scene - Mol*'s scene; we read `boundingSphereVisible` for framing.
 * @param camera - Mol*'s `Camera` instance; exposes `getInvariantFocus`.
 * @returns A camera-state snapshot suitable for `requestCameraReset`.
 */
export function buildResetSnapshotFn(
  scene: ResetSceneArg,
  camera: ResetCameraArg,
): unknown {
  return camera.getInvariantFocus(
    scene.boundingSphereVisible.center,
    scene.boundingSphereVisible.radius,
    Float32Array.of(0, 1, 0),
    Float32Array.of(0, 0, -1),
  );
}

/**
 * Configure Mol*'s built-in trackball animation. Pass `'off'` to stop;
 * otherwise the camera spins around the chosen axis at the given speed.
 * @param plugin - Mol* plugin context.
 * @param axis - Axis of rotation, or `'off'` to disable the animation.
 * @param speedDegreesPerSecond - Rotation speed in degrees per second.
 */
export function applyTrackball(
  plugin: PluginContext,
  axis: 'x' | 'y' | 'z' | 'off',
  speedDegreesPerSecond: number,
) {
  const animate =
    axis === 'off'
      ? { name: 'off', params: {} }
      : {
          name: 'spin',
          params: {
            speed: speedDegreesPerSecond / 360,
            axis: axisVector(axis),
          },
        };
  plugin.canvas3d?.setProps({ trackball: { animate } });
}

/**
 * Unit vector for one of the three principal axes.
 * @param axis - `'x'`, `'y'`, or `'z'`.
 * @returns 3-component unit vector pointing along the axis.
 */
export function axisVector(axis: 'x' | 'y' | 'z'): [number, number, number] {
  if (axis === 'x') return [1, 0, 0];
  if (axis === 'y') return [0, 1, 0];
  return [0, 0, 1];
}
