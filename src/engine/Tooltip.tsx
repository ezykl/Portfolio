import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A small floating label that follows the cursor, rendered via a portal to
 * `document.body` so it's never clipped by the scene's `overflow: hidden` box
 * and always sits above everything. Purely presentational and pointer-through;
 * InteractiveLayer owns when/where it shows (driven by the `tooltip` behavior).
 *
 * Styles are inline (warm palette, not Tailwind) so the engine stays
 * self-contained and doesn't depend on the app's design tokens.
 */
interface TooltipProps {
  text: string;
  /** Cursor position in viewport coordinates (clientX/clientY). */
  x: number;
  y: number;
  visible: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, x, y, visible }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && text ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: x,
            top: y - 16,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 9999,
            background: "rgba(140, 84, 56, 0.96)", // zyk brown
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: '"Poppins", ui-sans-serif, system-ui, sans-serif',
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
