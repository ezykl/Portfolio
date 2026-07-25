import React, { useEffect, useRef, useState } from "react";
import { isOpaqueAt } from "../../engine";

interface CustomCursorProps {
  /** The element to track pointer position within and hide the native cursor over. */
  containerRef: React.RefObject<HTMLElement | null>;
}

// Source assets are large illustrations (~350-400px) — far too big to use
// directly as a native CSS `cursor: url()` (that renders at the image's own
// pixel size, with no scaling, and most browsers silently ignore anything
// much past ~128px). Rendering our own small `<img>` that follows the
// pointer sidesteps that entirely and gives full control over size.
const CURSOR_SIZE = 34; // px, rendered size

// Fraction of the image's own width/height that is the "active" point (the
// arrow's tip / the hand's fingertip) — keeps the image positioned so that
// point, not the image's top-left corner, sits under the actual pointer.
const ARROW_HOTSPOT = { x: 0.08, y: 0.04 };
const HAND_HOTSPOT = { x: 0.32, y: 0.05 };

/**
 * Is the pointer over something that would actually respond to a click
 * here? Two things this has to account for, both mirroring how
 * InteractiveLayer's own click handling already works:
 *
 * 1. A `[data-clickable]` element's bounding box is not the same as its
 *    visible pixels — a diagonal sprite like the longboard has a lot of
 *    transparent padding in its rectangular box, so this checks the actual
 *    pixel via isOpaqueAt rather than just "is there a clickable element
 *    here at all".
 * 2. The single topmost element at a point isn't necessarily the *right*
 *    one — e.g. zyk-me-coding is a near full-bleed video that's also
 *    clickable and sits on top of the Lamp/Laptop/Notebook/Coffee/Cup
 *    Holder, so `e.target` alone would just test meCoding's own (usually
 *    transparent, there) pixel and never find the asset underneath it.
 *    Walking the full elementsFromPoint stack (topmost first) finds the
 *    next clickable candidate once a covering one turns out transparent —
 *    the same fallback InteractiveLayer's click handler does via its
 *    CLICK_REGISTRY walk.
 *
 * Non-media clickables (e.g. the Toggle button) don't have the letterbox
 * problem — they're normal UI controls, not sprites — so their whole box
 * counts as clickable.
 */
function isOverClickablePixel(clientX: number, clientY: number): boolean {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const el of stack) {
    if (!(el instanceof HTMLElement) || !el.hasAttribute("data-clickable")) continue;
    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
      if (isOpaqueAt(el, clientX, clientY)) return true;
      continue; // transparent here — keep walking down the stack
    }
    return true;
  }
  return false;
}

/**
 * Renders a small illustrated cursor that follows the pointer within
 * `containerRef`, swapping to a pointing-hand image over anything marked
 * `data-clickable` (see InteractiveLayer). The container itself is
 * responsible for `cursor: 'none'` so the OS cursor doesn't show underneath.
 */
export const CustomCursor: React.FC<CustomCursorProps> = ({ containerRef }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isClickable, setIsClickable] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      const { clientX, clientY } = e;
      // The opacity check draws to a canvas — throttle to one per frame so
      // rapid pointermove events don't each force a synchronous read.
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setIsClickable(isOverClickablePixel(clientX, clientY));
      });
    };
    const handleLeave = () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      setPos(null);
      setIsClickable(false);
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);
    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  if (!pos) return null;

  const hotspot = isClickable ? HAND_HOTSPOT : ARROW_HOTSPOT;

  return (
    <img
      src={isClickable ? "/assets/ui/hand.png" : "/assets/ui/cursor.png"}
      alt=""
      style={{
        position: "absolute",
        left: pos.x - CURSOR_SIZE * hotspot.x,
        top: pos.y - CURSOR_SIZE * hotspot.y,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};
