import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WelcomeOverlayProps {
  /** Flips true once the loading screen has cleared and the scene is actually visible. */
  show: boolean;
}

const HOLD_MS = 2200;

/**
 * A brief greeting that fades in over the scene once it's revealed, holds,
 * then fades out on its own. Timed off `show` (not its own mount) so it
 * always plays after the loading screen clears, regardless of how long
 * loading actually took.
 */
export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ show }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#3a2b22",
              textShadow: "0 2px 12px rgba(255,255,255,0.6)",
              background: "rgba(255, 250, 240, 0.55)",
              padding: "0.6em 1.1em",
              borderRadius: "999px",
              backdropFilter: "blur(6px)",
            }}
          >
            Hi, I'm Zyk 👋
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
