import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SceneLayer } from "./types";
import {
  resolveBehaviors,
  GLOW_OFF,
  GLOW_ON,
  GLOW_HOVER,
} from "./behaviors";
import { resolveWorldBox } from "./transforms";
import { useSceneRef } from "./SceneRefsContext";
import { useSceneGlow } from "./SceneGlowContext";
import { isOpaqueAt } from "./alphaHitTest";
import { Tooltip } from "./Tooltip";
import { LAYER_CLICK_EVENT, ERROR_CLICK_EVENT, MUSIC_TOGGLE_EVENT } from "./events";

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
const CLICK_REGISTRY = new Map<
  string,
  { tryClick: (x: number, y: number, e?: React.MouseEvent<MediaEl>) => boolean }
>();

/** Announces a genuine (opaque-pixel) click so app-level features (e.g. the
 *  mini-game) can react to which asset was clicked. */
function emitLayerClick(id: string) {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent(LAYER_CLICK_EVENT, { detail: { id } }));
}

/**
 * Hover fall-through, mirroring CLICK_REGISTRY for pointer hover. A large,
 * mostly-transparent asset (e.g. the full-scene "me" sprite) sits on top of
 * smaller ones and would otherwise swallow their hover. Instead, whichever
 * layer receives the mousemove resolves the *topmost opaque* hoverable at that
 * point and drives its hover — so the lamp/coffee/etc. underneath still light
 * up when the cursor is actually over their visible pixels.
 */
const HOVER_REGISTRY = new Map<
  string,
  {
    hitTest: (x: number, y: number) => boolean;
    setHovered: (hovered: boolean, x: number, y: number) => void;
  }
>();
// The single layer currently hovered (one cursor → one hovered layer globally).
const HOVERED = { current: null as string | null };

function resolveHoverAt(x: number, y: number) {
  const stack = document.elementsFromPoint(x, y);
  let winner: string | null = null;
  for (const el of stack) {
    const id = (el as HTMLElement).id;
    const entry = id ? HOVER_REGISTRY.get(id) : undefined;
    if (entry && entry.hitTest(x, y)) {
      winner = id;
      break;
    }
  }
  if (winner !== HOVERED.current) {
    if (HOVERED.current)
      HOVER_REGISTRY.get(HOVERED.current)?.setHovered(false, x, y);
    HOVERED.current = winner;
  }
  if (winner) HOVER_REGISTRY.get(winner)?.setHovered(true, x, y);
}

function clearHover(x: number, y: number) {
  if (HOVERED.current) {
    HOVER_REGISTRY.get(HOVERED.current)?.setHovered(false, x, y);
    HOVERED.current = null;
  }
}

/**
 * Renders one scene asset and owns everything about it that isn't pure
 * layout: motion, click, hover, refs, tooltip, glow, and media toggling.
 * Every asset in every scene goes through this same component — what it
 * *does* is driven entirely by `layer.behaviors` / `layer.events`, not by
 * which asset it happens to be.
 */
export const InteractiveLayer: React.FC<InteractiveLayerProps> = ({
  layer,
  layersById,
}) => {
  const setSceneRef = useSceneRef(layer.id);
  const mediaElRef = useRef<MediaEl | null>(null);
  const setRef = useCallback(
    (el: MediaEl | null) => {
      mediaElRef.current = el;
      setSceneRef(el);
    },
    [setSceneRef],
  );

  const { glowOn, toggleGlow } = useSceneGlow(layer.id);

  // `toggle` behavior state (e.g. cold ⇄ hot coffee). Stable setter so it
  // doesn't churn the behavior resolution below.
  const [toggled, setToggled] = useState(false);
  const onToggle = useCallback(() => setToggled((v) => !v), []);

  const listensMusic = layer.behaviors?.includes("listenMusicToggle") ?? false;
  const [musicActive, setMusicActive] = useState(false);

  // `errorClick` behavior: each click bumps a counter that the Tooltip turns
  // into a shake of the hovering label. The asset itself never moves.
  const hasErrorClick = layer.behaviors?.includes("errorClick") ?? false;
  const [tooltipShake, setTooltipShake] = useState(0);

  useEffect(() => {
    if (!hasErrorClick) return;
    const onErrorClick = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id?: string } | undefined;
      if (detail?.id === layer.id) setTooltipShake((s) => s + 1);
    };
    window.addEventListener(ERROR_CLICK_EVENT, onErrorClick);
    return () => window.removeEventListener(ERROR_CLICK_EVENT, onErrorClick);
  }, [hasErrorClick, layer.id]);

  useEffect(() => {
    if (!listensMusic) return;
    const onMusicToggle = () => setMusicActive((prev) => !prev);
    window.addEventListener(MUSIC_TOGGLE_EVENT, onMusicToggle);
    return () => window.removeEventListener(MUSIC_TOGGLE_EVENT, onMusicToggle);
  }, [listensMusic]);

  // If this layer is a video (e.g. animated music notes webm), play/pause in sync with music
  useEffect(() => {
    if (!listensMusic) return;
    const el = mediaElRef.current;
    if (el instanceof HTMLVideoElement) {
      if (musicActive) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [listensMusic, musicActive]);

  const resolved = useMemo(
    () =>
      resolveBehaviors(layer.behaviors, {
        glowOn,
        toggleGlow,
        layerId: layer.id,
        // Toggled assets can carry a different tooltip per state (e.g. coffee:
        // "isn't hot yet" → "already hot").
        tooltip:
          toggled && layer.toggle?.tooltip
            ? layer.toggle.tooltip
            : layer.tooltip,
        popup: layer.popup,
        onToggle,
        opacity: layer.opacity ?? 1,
        emitEvent: (eventName, detail) => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(eventName, { detail }));
          }
        },
      }),
    [
      layer.behaviors,
      glowOn,
      toggleGlow,
      layer.id,
      layer.tooltip,
      layer.toggle,
      toggled,
      layer.popup,
      onToggle,
    ],
  );

  const box = useMemo(
    () => resolveWorldBox(layer, layersById),
    [layer, layersById],
  );

  // Every layer captures pointer events by default, so a large, mostly
  // transparent asset rendered after a smaller one can block clicks meant for
  // what's beneath it. Layers with no interactive behaviors/events aren't
  // interactive anyway, so let clicks pass straight through them.
  const isInteractive =
    (layer.behaviors?.some(
      (b) => b !== "listenMusicToggle" && b !== "opacity",
    ) ?? false) || Boolean(layer.events);

  const hasClickHandler = Boolean(resolved.onClick || layer.events?.onClick);

  // Glow capability, read straight off the behavior flags. `clickGlow` implies
  // hover glow too (a selectable asset also lights up on hover); `hoverGlow`
  // adds only the transient hover light without click-selection.
  const hasClickGlow = layer.behaviors?.includes("clickGlow") ?? false;
  const hasHoverGlow =
    hasClickGlow || (layer.behaviors?.includes("hoverGlow") ?? false);

  // Pixel-perfect hover: `hovered` is true only over the asset's opaque pixels
  // (same alpha test as clicks), never its transparent padding. Drives both the
  // hover glow and the floating tooltip. Set via HOVER_REGISTRY so a covering
  // layer can hand hover down to the opaque layer beneath it.
  const hasTooltip = Boolean(resolved.tooltip);
  const isHoverable = hasHoverGlow || hasTooltip;
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isHoverable) return;
    const entry = {
      hitTest: (x: number, y: number) => {
        const el = mediaElRef.current;
        return !!el && isOpaqueAt(el, x, y);
      },
      setHovered: (h: boolean, x: number, y: number) => {
        setHovered(h);
        if (h && hasTooltip) setPointer({ x, y });
      },
    };
    HOVER_REGISTRY.set(layer.id, entry);
    return () => {
      if (HOVER_REGISTRY.get(layer.id) === entry) {
        HOVER_REGISTRY.delete(layer.id);
        if (HOVERED.current === layer.id) HOVERED.current = null;
      }
    };
  }, [isHoverable, hasTooltip, layer.id]);

  const style: React.CSSProperties = {
    position: "absolute",
    // `left` is driven entirely by the loop animation below when present.
    ...(layer.loop ? {} : { left: `${box.left}%` }),
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
    objectFit: "contain",
    ...(isInteractive ? {} : { pointerEvents: "none" }),
    // Clickable assets show the native pointer cursor as a plain "this does
    // something" affordance.
    ...(hasClickHandler ? { cursor: "pointer" } : {}),
    ...(layer.zIndex !== undefined ? { zIndex: layer.zIndex } : {}),
    ...(layer.rotation ? { transform: `rotate(${layer.rotation}deg)` } : {}),
  };

  // Registered so a click that misses this asset's own opaque pixels can fall
  // through to it from a layer stacked above (see handleClick below).
  useEffect(() => {
    if (!hasClickHandler) return;
    const entry = {
      tryClick: (
        x: number,
        y: number,
        e?: React.MouseEvent<MediaEl>,
      ): boolean => {
        const el = mediaElRef.current;
        if (!el || !isOpaqueAt(el, x, y)) return false;
        resolved.onClick?.();
        if (e) layer.events?.onClick?.(e);
        emitLayerClick(layer.id);
        return true;
      },
    };
    CLICK_REGISTRY.set(layer.id, entry);
    return () => {
      if (CLICK_REGISTRY.get(layer.id) === entry)
        CLICK_REGISTRY.delete(layer.id);
    };
  }, [hasClickHandler, layer.id, layer.events, resolved.onClick]);

  const handleClick = isInteractive
    ? (e: React.MouseEvent<MediaEl>) => {
        const el = mediaElRef.current;
        if (hasClickHandler && el && isOpaqueAt(el, e.clientX, e.clientY)) {
          resolved.onClick?.();
          layer.events?.onClick?.(e);
          emitLayerClick(layer.id);
          return;
        }
        // Either this layer has no click action, or its own pixel here is
        // transparent — walk the interactive layers stacked below it at the
        // same point (topmost first) for the next one that actually handles it.
        const stack = document.elementsFromPoint(e.clientX, e.clientY);
        const myIndex = el ? stack.indexOf(el) : -1;
        for (let i = myIndex + 1; i < stack.length; i++) {
          const candidateId = (stack[i] as HTMLElement).id;
          if (!candidateId || candidateId === layer.id) continue;
          if (
            CLICK_REGISTRY.get(candidateId)?.tryClick(e.clientX, e.clientY, e)
          )
            return;
        }
      }
    : undefined;

  let motionProps = resolved.motionProps;

  // A continuous idle drift, independent of user interaction (e.g. a cloud).
  if (layer.loop) {
    const { fromLeft, toLeft, fadeStartLeft, duration } = layer.loop;
    const totalRange = toLeft - fromLeft;
    const fadeStartFraction =
      totalRange !== 0 ? (fadeStartLeft - fromLeft) / totalRange : 1;
    motionProps = {
      ...motionProps,
      initial: { left: `${fromLeft}%`, opacity: 1 },
      animate: { left: [`${fromLeft}%`, `${toLeft}%`], opacity: [1, 1, 0] },
      transition: {
        left: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
        opacity: {
          duration,
          ease: "linear",
          times: [0, fadeStartFraction, 1],
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    };
  }

  // Reactive visibility & gentle floating animation for layers that sync with music
  if (listensMusic) {
    const targetOpacity = layer.opacity ?? 0.85;
    const floatDuration = layer.floatDuration ?? 10;
    const prevInitial = (motionProps.initial ?? {}) as Record<string, unknown>;
    const prevAnimate = (motionProps.animate ?? {}) as Record<string, unknown>;
    motionProps = {
      ...motionProps,
      initial: { opacity: 0, scale: 0.9, y: 6, ...prevInitial },
      animate: musicActive
        ? {
            ...prevAnimate,
            opacity: targetOpacity,
            scale: [1, 1.05, 1],
            y: [0, -5, 0],
          }
        : {
            ...prevAnimate,
            opacity: 0,
            scale: 0.9,
            y: 6,
          },
      transition: musicActive
        ? {
            opacity: { duration: 1, ease: "easeOut" },
            scale: { duration: floatDuration, repeat: Infinity, ease: "easeInOut" },
            y: { duration: floatDuration, repeat: Infinity, ease: "easeInOut" },
            ...motionProps.transition,
          }
        : {
            duration: 0.35,
            ease: "easeIn",
            ...motionProps.transition,
          },
    };
  }

  // Centralized glow: the persistent click-selection glow (glowOn) wins;
  // otherwise a transient hover glow while the cursor is over opaque pixels.
  // Folded in here — not in the resolvers — so both sources compose into the
  // single `filter` property and animate smoothly.
  if (hasClickGlow || hasHoverGlow) {
    const glowFilter = glowOn
      ? GLOW_ON
      : hasHoverGlow && hovered
        ? GLOW_HOVER
        : GLOW_OFF;
    const prevInitial = (motionProps.initial ?? {}) as Record<string, unknown>;
    const prevAnimate = (motionProps.animate ?? {}) as Record<string, unknown>;
    motionProps = {
      ...motionProps,
      initial: { filter: GLOW_OFF, ...prevInitial },
      animate: { ...prevAnimate, filter: glowFilter },
      transition: { duration: 0.3, ...motionProps.transition },
    };
  }

  const sharedProps = {
    id: layer.id,
    style,
    onClick: handleClick,
    onMouseEnter: (e: React.MouseEvent<MediaEl>) => {
      resolveHoverAt(e.clientX, e.clientY);
      layer.events?.onMouseEnter?.(e);
    },
    onMouseMove: isInteractive
      ? (e: React.MouseEvent<MediaEl>) => resolveHoverAt(e.clientX, e.clientY)
      : undefined,
    onMouseLeave: (e: React.MouseEvent<MediaEl>) => {
      clearHover(e.clientX, e.clientY);
      layer.events?.onMouseLeave?.(e);
    },
    // Plain marker for "hovering something clickable" (usable via closest()).
    ...(hasClickHandler ? { "data-clickable": true } : {}),
  };

  // The `toggle` behavior swaps which media is shown (base vs `layer.toggle`).
  const active =
    toggled && layer.toggle
      ? layer.toggle
      : { src: layer.src, type: layer.type, videoAttrs: layer.videoAttrs };

  const media =
    active.type === "image" ? (
      // framer-motion v10's HTML element prop types (e.g. `src`, `alt`) don't
      // resolve against this project's React 19 type defs — the same
      // pre-existing mismatch already worked around for motion.div in Hero.tsx.
      <motion.img
        ref={setRef as React.Ref<HTMLImageElement>}
        // @ts-ignore
        src={active.src}
        alt={layer.alt ?? ""}
        {...sharedProps}
        {...motionProps}
      />
    ) : (
      // @ts-ignore — see the motion.img note above; same framer-motion/React 19 type mismatch.
      <motion.video
        ref={setRef as React.Ref<HTMLVideoElement>}
        src={active.src}
        {...(active.videoAttrs ?? {})}
        {...sharedProps}
        {...motionProps}
      />
    );

  return (
    <>
      {media}
      {hasTooltip && (
        <Tooltip
          text={resolved.tooltip ?? ""}
          x={pointer.x}
          y={pointer.y}
          visible={hovered}
          shake={tooltipShake}
        />
      )}
    </>
  );
};
