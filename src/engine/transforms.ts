import type { SceneLayer } from './types';

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Resolves a layer's percentage box into scene-space.
 *
 * Today every layer's box is already scene-space (no layer sets `parent`),
 * so this is the identity function in practice. When a layer does set
 * `parent`, its `left/top/width/height` are treated as percentages of the
 * parent's *resolved* box, composed recursively — so nesting can be
 * introduced later without touching the renderer.
 */
export function resolveWorldBox(
  layer: SceneLayer,
  layersById: Map<string, SceneLayer>
): Box {
  if (!layer.parent) {
    return { left: layer.left, top: layer.top, width: layer.width, height: layer.height };
  }
  const parent = layersById.get(layer.parent);
  if (!parent) {
    // Dangling parent reference — fall back to treating the box as scene-space
    // rather than silently dropping the layer.
    return { left: layer.left, top: layer.top, width: layer.width, height: layer.height };
  }
  const parentBox = resolveWorldBox(parent, layersById);
  return {
    left: parentBox.left + (layer.left * parentBox.width) / 100,
    top: parentBox.top + (layer.top * parentBox.height) / 100,
    width: (layer.width * parentBox.width) / 100,
    height: (layer.height * parentBox.height) / 100,
  };
}
