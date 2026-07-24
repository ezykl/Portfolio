import type { MouseEvent, VideoHTMLAttributes } from 'react';

/**
 * Declarative interaction hooks a layer can opt into. InteractiveLayer
 * interprets these — see `behaviors.ts` for the registry. Add a new
 * behavior by adding a resolver there; nothing else needs to change.
 */
export type BehaviorId = 'clickGlow';

export interface LayerEvents {
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
}

/**
 * A continuous, non-interactive idle animation — e.g. a cloud drifting
 * across the scene. Independent of `behaviors` (which are user-interaction
 * driven) since this runs unconditionally on a timer, not in response to
 * hover/click/drag.
 */
export interface LoopAnimation {
  /** Starting `left`, in the same percentage units as the layer's own `left`. */
  fromLeft: number;
  /** Ending `left` before the loop restarts. */
  toLeft: number;
  /** `left` value (between fromLeft and toLeft) at which opacity begins fading from 1 to 0, reaching 0 exactly at `toLeft`. */
  fadeStartLeft: number;
  /** Seconds for one full fromLeft -> toLeft cycle. */
  duration: number;
}

/**
 * A single independently-addressable scene asset.
 *
 * `left/top/width/height` are percentages of the owning scene's aspect-ratio
 * box — same semantics as the original `AssetItem`. When `parent` is set,
 * they're percentages of the parent layer's resolved box instead (see
 * `resolveWorldBox` in `transforms.ts`); no current scene sets `parent`, so
 * this is inert today but load-bearing for nested assets later.
 */
export interface SceneLayer {
  /** Unique within its scene. Used for the React key, the refs registry, and the DOM `id`. */
  id: string;
  src: string;
  type: 'image' | 'video';
  alt?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  /** Id of another layer in the same scene this one is positioned relative to. Optional, unused by any current scene. */
  parent?: string;
  behaviors?: BehaviorId[];
  events?: LayerEvents;
  videoAttrs?: VideoHTMLAttributes<HTMLVideoElement>;
  loop?: LoopAnimation;
}

/** @deprecated Kept so pre-refactor imports of `AssetItem` keep compiling. Use {@link SceneLayer}. */
export type AssetItem = SceneLayer;

export interface Scene {
  id: string;
  layers: SceneLayer[];
  aspectRatio: string;
}
