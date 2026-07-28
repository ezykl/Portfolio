import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WelcomeOverlayProps {
  /** Flips true once the loading screen has cleared and the scene is actually visible. */
  show: boolean;
  onStart?: () => void;
  onSkip?: () => void;
}

const HOLD_MS = 2200;

/**
 * A brief greeting that fades in over the scene once it's revealed, holds,
 * then fades out on its own. Timed off `show` (not its own mount) so it
 * always plays after the loading screen clears, regardless of how long
 * loading actually took.
 */
export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  show,
  onStart,
  onSkip,
}) => {
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
              color: "#3a2b22",
              textShadow: "0 2px 12px rgba(255,255,255,0.6)",
              background: "rgba(255, 250, 240, 0.6)",
              padding: "1.1rem 1.35rem",
              borderRadius: "1.5rem",
              backdropFilter: "blur(8px)",
              boxShadow: "0 18px 40px rgba(74, 46, 28, 0.13)",
              maxWidth: "min(92vw, 32rem)",
              textAlign: "center",
            }}
          >
            <p className="font-display text-2xl sm:text-3xl">
              Start an exploration?
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-zyk-brown/80 sm:text-base">
              A few hidden memories are tucked around the portfolio. Find them
              and the room slowly comes alive.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="rounded-full bg-zyk-primary px-4 py-2 font-display text-sm text-white shadow-md transition-transform hover:-translate-y-0.5"
              >
                Start Exploration
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="rounded-full bg-zyk-secondary px-4 py-2 font-display text-sm text-zyk-heading shadow-md transition-transform hover:-translate-y-0.5"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
