import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SceneLayer } from './types';
import { resolveBehaviors } from './behaviors';
import { resolveWorldBox } from './transforms';
import { useSceneRef } from './SceneRefsContext';
import { useSceneGlow } from './SceneGlowContext';
import { isOpaqueAt } from './alphaHitTest';

interface InteractiveLayerProps {
  layer: SceneLayer;
  layersById: Map<string, SceneLayer>;
}

type MediaEl = HTMLImageElement | HTMLVideoElement;

/**
 * Lets a click that lands on one interactive layer's transparent padding
 * fall through to whatever interactive layer is visually underneath it at
 * that same point, instead of the click just being silently swallowed.
 * Populated/cleared by each InteractiveLayer as it mounts/unmounts.
 */
const CLICK_REGISTRY = new Map<string, { tryClick: (x: number, y: number, e?: React.MouseEvent<MediaEl>) => boolean }>();

/**
 * Renders one scene asset and owns everything about it that isn't pure
 * layout: motion, click, refs, and (later) tooltip/sound/GSAP hooks. Every
 * asset in every scene goes through this same component — what it *does*
 * is driven entirely by `layer.behaviors` / `layer.events`, not by which
 * asset it happens to be.
 */
export const InteractiveLayer: React.FC<InteractiveLayerProps> = ({ layer, layersById }) => {
  const setSceneRef = useSceneRef(layer.id);
  const mediaElRef = useRef<MediaEl | null>(null);
  const setRef = useCallback(
    (el: MediaEl | null) => {
      mediaElRef.current = el;
      setSceneRef(el);
    },
    [setSceneRef]
  );

  const { glowOn, toggleGlow } = useSceneGlow(layer.id);

  const resolved = useMemo(
    () => resolveBehaviors(layer.behaviors, { glowOn, toggleGlow }),
    [layer.behaviors, glowOn, toggleGlow]
  );

  const box = useMemo(() => resolveWorldBox(layer, layersById), [layer, layersById]);

  // Every layer captures pointer events by default, so a large, mostly
  // transparent asset (e.g. a full background sprite) rendered after a
  // smaller one can block clicks meant for what's beneath it. Layers with
  // no behaviors/events aren't interactive anyway, so let clicks pass
  // straight through them.
  const isInteractive = (layer.behaviors?.length ?? 0) > 0 || Boolean(layer.events);

  const hasClickHandler = Boolean(resolved.onClick || layer.events?.onClick);

  const style: React.CSSProperties = {
    position: 'absolute',
    // `left` is driven entirely by the loop animation below when present,
    // so it isn't also pinned to a static value here.
    ...(layer.loop ? {} : { left: `${box.left}%` }),
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
    objectFit: 'contain',
    ...(isInteractive ? {} : { pointerEvents: 'none' }),
    ...(hasClickHandler ? { cursor: 'pointer' } : {}),
    ...(layer.zIndex !== undefined ? { zIndex: layer.zIndex } : {}),
    ...(layer.rotation ? { transform: `rotate(${layer.rotation}deg)` } : {}),
  };

  // Registered so a click that misses this asset's own opaque pixels can
  // fall through to it from a layer stacked above (see handleClick below).
  useEffect(() => {
    if (!hasClickHandler) return;
    const entry = {
      tryClick: (x: number, y: number, e?: React.MouseEvent<MediaEl>): boolean => {
        const el = mediaElRef.current;
        if (!el || !isOpaqueAt(el, x, y)) return false;
        resolved.onClick?.();
        if (e) layer.events?.onClick?.(e);
        return true;
      },
    };
    CLICK_REGISTRY.set(layer.id, entry);
    return () => {
      if (CLICK_REGISTRY.get(layer.id) === entry) CLICK_REGISTRY.delete(layer.id);
    };
  }, [hasClickHandler, layer.id, layer.events, resolved.onClick]);

  // Any interactive layer (even one with no click action of its own, e.g. an
  // events-only asset) still gets a click listener: it's `pointer-events:
  // auto`, so the browser hands it the native click whenever it's on top at
  // that point. Without this it would silently swallow clicks meant for a
  // click-enabled asset stacked underneath it.
  const handleClick = isInteractive
    ? (e: React.MouseEvent<MediaEl>) => {
        const el = mediaElRef.current;
        if (hasClickHandler && el && isOpaqueAt(el, e.clientX, e.clientY)) {
          resolved.onClick?.();
          layer.events?.onClick?.(e);
          return;
        }
        // Either this layer has no click action of its own, or its own
        // pixel here is transparent — walk the interactive layers stacked
        // below it at the same point (topmost first, as returned by
        // elementsFromPoint) for the next one that actually handles it.
        const stack = document.elementsFromPoint(e.clientX, e.clientY);
        const myIndex = el ? stack.indexOf(el) : -1;
        for (let i = myIndex + 1; i < stack.length; i++) {
          const candidateId = (stack[i] as HTMLElement).id;
          if (!candidateId || candidateId === layer.id) continue;
          if (CLICK_REGISTRY.get(candidateId)?.tryClick(e.clientX, e.clientY, e)) return;
        }
      }
    : undefined;

  let motionProps = resolved.motionProps;

  // A continuous idle drift, independent of user interaction: left runs
  // fromLeft -> toLeft on a linear loop; opacity holds at 1 until
  // fadeStartLeft, then ramps to 0 by toLeft. `repeat: Infinity` with the
  // default repeatType restarts immediately at fromLeft/opacity 1 — no gap.
  if (layer.loop) {
    const { fromLeft, toLeft, fadeStartLeft, duration } = layer.loop;
    const totalRange = toLeft - fromLeft;
    const fadeStartFraction = totalRange !== 0 ? (fadeStartLeft - fromLeft) / totalRange : 1;
    motionProps = {
      ...motionProps,
      initial: { left: `${fromLeft}%`, opacity: 1 },
      animate: { left: [`${fromLeft}%`, `${toLeft}%`], opacity: [1, 1, 0] },
      transition: {
        left: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
        opacity: {
          duration,
          ease: 'linear',
          times: [0, fadeStartFraction, 1],
          repeat: Infinity,
          repeatType: 'loop',
        },
      },
    };
  }

  const sharedProps = {
    id: layer.id,
    style,
    onClick: handleClick,
    onMouseEnter: layer.events?.onMouseEnter,
    onMouseLeave: layer.events?.onMouseLeave,
  };

  if (layer.type === 'image') {
    // framer-motion v10's HTML element prop types (e.g. `src`, `alt`) don't
    // resolve against this project's React 19 type defs — the same
    // pre-existing mismatch already worked around for motion.div in Hero.tsx.
    return (
      <motion.img
        ref={setRef as React.Ref<HTMLImageElement>}
        // @ts-ignore
        src={layer.src}
        alt={layer.alt ?? ''}
        {...sharedProps}
        {...motionProps}
      />
    );
  }

  const { videoAttrs = {} } = layer;
  return (
    // @ts-ignore — see the motion.img note above; same framer-motion/React 19 type mismatch.
    <motion.video
      ref={setRef as React.Ref<HTMLVideoElement>}
      src={layer.src}
      {...videoAttrs}
      {...sharedProps}
      {...motionProps}
    />
  );
};
