import React, { useRef } from "react";
import { motion } from "framer-motion";

// Derived from the actual asset pixel sizes (toggle-base.png is 214x84,
// toggle-round.png is 60x60) rather than guessed — the knob is designed to
// sit flush within the track's height with equal padding on all sides:
// (84 - 60) / 2 = 12px, i.e. 12/214 horizontally and 12/84 vertically.
const KNOB_SIZE_PCT = (60 / 214) * 100; // knob width, as % of the track's width
const KNOB_HEIGHT_PCT = (60 / 84) * 100; // knob height, as % of the track's height
const KNOB_TOP_PCT = ((84 - 60) / 2 / 84) * 100;
const KNOB_INSET_PCT = (12 / 214) * 100; // left position when off, and the track's own edge inset
const KNOB_FAR_EDGE_PCT = KNOB_INSET_PCT + KNOB_SIZE_PCT; // the knob's other edge
const KNOB_ON_LEFT_PCT = 100 - KNOB_FAR_EDGE_PCT; // left position when on

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Rendered centered on the sliding knob. */
  icon: React.ReactNode;
  /** Accessible name; not shown visually. */
  label: string;
  /** Short word shown in the track's empty half — the space the knob just vacated. */
  stateText?: string;
  /** Tint blended onto the knob's wood texture for the current state. */
  knobTint?: string;
}

/**
 * A reusable on/off switch built from toggle-base.png (track) and
 * toggle-round.png (the knob that slides left→right). Purely a controlled
 * UI primitive — it doesn't know what "checked" means; that's up to
 * whoever renders it (see the Light/Music toggles in Hero.tsx).
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  icon,
  label,
  stateText,
  knobTint,
}) => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    const sound = clickSoundRef.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // ignore — playback can't be blocked
    }
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={handleClick}
      style={{
        position: "relative",
        width: "6rem",
        aspectRatio: "214 / 84",
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      <img
        src="/assets/ui/toggle-base.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {stateText && (
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            // The knob sits on one side; the label lives in the empty half
            // on the other side — flips with `checked` since the knob does.
            ...(checked
              ? { left: `${KNOB_INSET_PCT}%`, right: `${KNOB_FAR_EDGE_PCT}%` }
              : { left: `${KNOB_FAR_EDGE_PCT}%`, right: `${KNOB_INSET_PCT}%` }),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            color: "#3a2b22",
            pointerEvents: "none",
          }}
        >
          {stateText}
        </span>
      )}

      <motion.div
        initial={false}
        animate={{ left: `${checked ? KNOB_ON_LEFT_PCT : KNOB_INSET_PCT}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          position: "absolute",
          top: `${KNOB_TOP_PCT}%`,
          width: `${KNOB_SIZE_PCT}%`,
          height: `${KNOB_HEIGHT_PCT}%`,
          filter: checked
            ? "drop-shadow(0 0 6px rgba(255, 200, 80, 0.9))"
            : "none",
        }}
      >
        <img
          src="/assets/ui/toggle-round.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {knobTint && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: knobTint,
              mixBlendMode: "multiply",
              opacity: 0.5,
            }}
          />
        )}
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3a2b22",
          }}
        >
          {icon}
        </span>
      </motion.div>
      <audio ref={clickSoundRef} src="/assets/music/click.wav" preload="auto" />
    </button>
  );
};
