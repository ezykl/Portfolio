import type { MotionProps } from 'framer-motion';
import type { BehaviorId, PopupContent } from './types';
import {
  COLLECTIBLE_FOUND_EVENT,
  MUSIC_TOGGLE_EVENT,
  OPEN_MINIGAME_EVENT,
  POPUP_OPEN_EVENT,
} from './events';
import { playClickSound } from './clickSound';

export const ALL_BEHAVIOR_IDS: BehaviorId[] = [
  'clickGlow',
  'huntItem',
  'tooltip',
  'popup',
  'hoverGlow',
  'toggle',
  'openMinigame',
  'music',
  'listenMusicToggle',
  'opacity',
];

/** Runtime state a resolver may need, e.g. clickGlow's on/off flag. */
export interface BehaviorContext {
  glowOn: boolean;
  toggleGlow: () => void;
  layerId?: string;
  emitEvent?: (eventName: string, detail: unknown) => void;
  /** The layer's `tooltip` text, surfaced to the `tooltip` resolver. */
  tooltip?: string;
  /** The layer's `popup` content, surfaced to the `popup` resolver. */
  popup?: PopupContent;
  /** Flips the layer's `toggle` media state; provided to the `toggle` resolver. */
  onToggle?: () => void;
  /** Opacity of the layer (0-1), used by the `opacity` behavior. */
  opacity?: number;
}

export interface ResolvedBehaviors {
  motionProps: MotionProps;
  onClick?: () => void;
  /** Tooltip text to show on hover, set by the `tooltip` behavior. InteractiveLayer renders it. */
  tooltip?: string;
}

// A tight bright core plus a wide soft halo, layered, reads clearly as "lit up"
// regardless of the warm pastel background it sits on — a single soft
// drop-shadow at low opacity tended to blend into the palette instead.
// Exported so InteractiveLayer can centralize glow rendering (it composes the
// persistent click glow with the transient hover glow, which the resolvers
// can't do alone since hover is per-render local state).
export const GLOW_OFF = 'drop-shadow(0 0 0px rgba(255, 200, 80, 0)) brightness(1)';
export const GLOW_ON =
  'drop-shadow(0 0 6px rgba(255, 210, 90, 1)) drop-shadow(0 0 26px rgba(255, 170, 40, 0.95)) brightness(1.15)';
// A softer, single-halo version for the transient on-hover light.
export const GLOW_HOVER =
  'drop-shadow(0 0 6px rgba(255, 214, 110, 0.85)) brightness(1.06)';
const HUNT_SCALE = 1.03;

/**
 * One resolver per behavior id, each folding its own Motion props into the
 * accumulator. Adding a new behavior means adding one entry here — nothing
 * in InteractiveLayer, LayerRenderer, or SceneRenderer needs to change.
 */
const BEHAVIOR_RESOLVERS: Record<
  BehaviorId,
  (acc: ResolvedBehaviors, ctx: BehaviorContext) => ResolvedBehaviors
> = {
  // Persistent, one-at-a-time selection glow on click. The glow *filter* itself
  // is applied centrally by InteractiveLayer (so it can blend with hover glow);
  // this resolver just owns the click → toggle selection + sound.
  clickGlow: (acc, ctx) => ({
    ...acc,
    onClick: () => {
      acc.onClick?.();
      ctx.toggleGlow();
      playClickSound();
    },
  }),
  // Marker: opts a layer into the transient on-hover glow without making it
  // click-selectable. InteractiveLayer reads the flag; there's nothing to fold
  // into motion/click here.
  hoverGlow: (acc) => acc,
  huntItem: (acc, ctx) => {
    const prevInitial = (acc.motionProps.initial ?? {}) as Record<string, unknown>;
    const prevAnimate = (acc.motionProps.animate ?? {}) as Record<string, unknown>;
    return {
      ...acc,
      motionProps: {
        ...acc.motionProps,
        initial: { ...prevInitial, scale: 1 },
        animate: { ...prevAnimate, scale: ctx.glowOn ? HUNT_SCALE : 1 },
        transition: { duration: 0.25, ...acc.motionProps.transition },
      },
      onClick: () => {
        acc.onClick?.();
        ctx.toggleGlow();
        ctx.emitEvent?.(COLLECTIBLE_FOUND_EVENT, { id: ctx.layerId });
        playClickSound();
      },
    };
  },
  // Surfaces the layer's `tooltip` text; InteractiveLayer renders the floating
  // label on hover. (No hover-scale — hover feedback is the glow, per design.)
  tooltip: (acc, ctx) => ({
    ...acc,
    tooltip: ctx.tooltip,
  }),
  // Opens a centered message popup on click by emitting POPUP_OPEN_EVENT with
  // the layer's `popup` content; an app-level PopupHost listens and renders it.
  // Sound is left to clickGlow so a glow+popup asset doesn't double up.
  popup: (acc, ctx) => ({
    ...acc,
    onClick: () => {
      acc.onClick?.();
      ctx.emitEvent?.(POPUP_OPEN_EVENT, {
        id: ctx.layerId,
        content: ctx.popup,
      });
    },
  }),
  // Swaps the layer between its base media and its `toggle` media on click
  // (e.g. cold �� ⇄ hot coffee). InteractiveLayer owns the toggled state and the
  // actual media swap; this resolver just flips it and plays the click sound.
  toggle: (acc, ctx) => ({
    ...acc,
    onClick: () => {
      acc.onClick?.();
      ctx.onToggle?.();
    },
  }),
  // Opens the AllScene find-the-object mini-game by emitting OPEN_MINIGAME_EVENT;
  // an app-level MinigameHost listens and renders the modal.
  openMinigame: (acc, ctx) => ({
    ...acc,
    onClick: () => {
      acc.onClick?.();
      ctx.emitEvent?.(OPEN_MINIGAME_EVENT, { id: ctx.layerId });
      playClickSound();
    },
  }),
  // In-scene music control (e.g. a desk music player): each click swaps the
  // asset's media (via `toggle`: still png �� ⇄ playing webp) and emits
  // MUSIC_TOGGLE_EVENT so an app-level MusicHost play/pauses the track. Both
  // start "off" and flip together, so the art stays in sync with the audio.
  music: (acc, ctx) => ({
    ...acc,
    onClick: () => {
      acc.onClick?.();
      ctx.emitEvent?.(MUSIC_TOGGLE_EVENT, {});
    },
  }),
  // Marker: opts a layer into toggling visibility when MUSIC_TOGGLE_EVENT is received.
  // InteractiveLayer manages the event listener and opacity/motion animation.
  listenMusicToggle: (acc) => acc,
  // Sets the layer's opacity (0-1) via motionProps.opacity.
  opacity: (acc, ctx) => ({
    ...acc,
    motionProps: {
      ...acc.motionProps,
      opacity: ctx.opacity ?? 1,
    },
  }),
};

/** Folds a layer's `behaviors` list into the Motion props + click handler InteractiveLayer applies. */
export function resolveBehaviors(
  behaviors: BehaviorId[] | undefined,
  ctx: BehaviorContext
): ResolvedBehaviors {
  const list = behaviors ?? [];
  return list.reduce<ResolvedBehaviors>(
    (acc, id) => BEHAVIOR_RESOLVERS[id]?.(acc, ctx) ?? acc,
    { motionProps: {} }
  );
}