import type { MotionProps } from 'framer-motion';
import type { BehaviorId } from './types';

export const ALL_BEHAVIOR_IDS: BehaviorId[] = ['clickGlow'];

/** Runtime state a resolver may need, e.g. clickGlow's on/off flag. */
export interface BehaviorContext {
  glowOn: boolean;
  toggleGlow: () => void;
}

export interface ResolvedBehaviors {
  motionProps: MotionProps;
  onClick?: () => void;
}

// A tight bright core plus a wide soft halo, layered, reads clearly as "lit up"
// regardless of the warm pastel background it sits on — a single soft
// drop-shadow at low opacity tended to blend into the palette instead.
const GLOW_OFF = 'drop-shadow(0 0 0px rgba(255, 200, 80, 0)) brightness(1)';
const GLOW_ON =
  'drop-shadow(0 0 6px rgba(255, 210, 90, 1)) drop-shadow(0 0 26px rgba(255, 170, 40, 0.95)) brightness(1.15)';

/**
 * One resolver per behavior id, each folding its own Motion props into the
 * accumulator. Adding a new behavior means adding one entry here — nothing
 * in InteractiveLayer, LayerRenderer, or SceneRenderer needs to change.
 */
const BEHAVIOR_RESOLVERS: Record<
  BehaviorId,
  (acc: ResolvedBehaviors, ctx: BehaviorContext) => ResolvedBehaviors
> = {
  clickGlow: (acc, ctx) => {
    // `initial`/`animate` are typed as unions (object | boolean | variant
    // label), so spreading them directly isn't valid unless narrowed to an
    // object first — they're always object-shaped in practice here since
    // no other resolver sets them to anything else.
    const prevInitial = (acc.motionProps.initial ?? {}) as Record<string, unknown>;
    const prevAnimate = (acc.motionProps.animate ?? {}) as Record<string, unknown>;
    return {
      ...acc,
      motionProps: {
        ...acc.motionProps,
        initial: { ...prevInitial, filter: GLOW_OFF },
        animate: { ...prevAnimate, filter: ctx.glowOn ? GLOW_ON : GLOW_OFF },
        transition: { duration: 0.35, ...acc.motionProps.transition },
      },
      onClick: () => {
        acc.onClick?.();
        ctx.toggleGlow();
      },
    };
  },
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
