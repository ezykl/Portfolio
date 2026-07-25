import React from "react";

/**
 * Cozy game-style loading screen, themed after the warm "coding room" scene.
 *
 * Shows a storybook dialog panel with a chunky progress bar, a moving shimmer,
 * and a bobbing coffee cup. `progress` is a 0–100 percentage; when it is
 * undefined the bar animates in an indeterminate "warming up" state.
 */

/** Room palette — see the reference scene (peach walls, wood, moss sweater). */
const palette = {
  sandyPeach: "#F2DAC6", // main wall / dominant background
  blushPink: "#F8D7CA", // sky in the window → lamp glow
  tanBrown: "#A9795E", // wood ceiling & lamp details → secondary text
  terracotta: "#BC693A", // bookshelf wood → borders & accents
  walnut: "#5A3A26", // deep shadow grain → headings & deep shadow
  mossGreen: "#3D4D3D", // the sweater, main pop of colour → progress fill
  charcoal: "#1D1D1D", // laptop screen & hair → darkest text
  brass: "#C9A15A", // aged-brass desk lamp → highlight accents
} as const;

/**
 * Portfolio one-liners. One is picked at random per load and held the whole
 * time so it's actually readable; "Come on in!" is reserved for 100%.
 */
const messages = [
  "AI is a plus, but creativity is a must.",
  "Where logic meets a little bit of art.",
  "Clean code, warm coffee, big ideas.",
  "Design with intention, not just instruction.",
  "Building experiences, not just pages.",
];

export const LoadingScreen: React.FC<{ progress?: number }> = ({
  progress,
}) => {
  const hasProgress = progress != null;
  // Raw (fractional) value drives the bar width for frame-smooth motion; the
  // rounded value is only used for the on-screen percentage.
  const raw = Math.max(0, Math.min(100, progress ?? 0));
  const pct = Math.round(raw);

  // Pick a single line once, at mount, and keep it for the whole load.
  const [line] = React.useState(
    () => messages[Math.floor(Math.random() * messages.length)],
  );
  const message = pct >= 100 ? "Come on in!" : line;

  return (
    <div style={styles.overlay}>
      {/* Keyframes are scoped to this screen and injected once. */}
      <style>{keyframes}</style>

      <div style={styles.panel}>
        <div style={styles.cup} aria-hidden>
          ☕
        </div>

        <h1 style={styles.title}>Setting up your cozy space</h1>

        <div style={styles.barRow}>
          <span style={styles.hint}>Loading</span>
          <span style={styles.percent}>{hasProgress ? `${pct}%` : "…"}</span>
        </div>

        {/* Progress track */}
        <div style={styles.track}>
          <div
            style={{
              ...styles.fill,
              width: hasProgress ? `${raw}%` : "40%",
              animation: hasProgress
                ? undefined
                : "cozy-indeterminate 1.4s ease-in-out infinite",
            }}
          >
            <div style={styles.shimmer} />
          </div>
        </div>

        {/* key={message} remounts the node on each change so it fades in. */}
        <p key={message} style={styles.flavor}>
          {message}
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const keyframes = `
@keyframes cozy-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
@keyframes cozy-shimmer {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(220%); }
}
@keyframes cozy-indeterminate {
  0%   { margin-left: 0%;  width: 30%; }
  50%  { margin-left: 35%; width: 45%; }
  100% { margin-left: 100%; width: 30%; }
}
@keyframes cozy-fade {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Sandy-peach wall with a soft blush-pink lamp glow in the middle.
    background:
      `radial-gradient(60% 55% at 50% 40%, ${palette.blushPink}, rgba(248,215,202,0) 72%), ` +
      `linear-gradient(160deg, ${palette.sandyPeach} 0%, #E9CBB1 100%)`,
    fontFamily:
      "'Segoe UI', system-ui, -apple-system, 'Trebuchet MS', sans-serif",
  },

  panel: {
    width: "min(420px, 90vw)",
    padding: "2.25rem 2rem 1.75rem",
    borderRadius: 20,
    textAlign: "center",
    // Warm cream card, like a storybook dialog box.
    background: "linear-gradient(180deg, #FBF1E7 0%, #F6E7D6 100%)",
    border: `2px solid ${palette.terracotta}`,
    boxShadow:
      "0 18px 40px rgba(90,58,38,0.28), inset 0 1px 0 rgba(255,255,255,0.7)",
  },

  cup: {
    fontSize: "3rem",
    lineHeight: 1,
    display: "inline-block",
    marginBottom: "0.5rem",
    animation: "cozy-bob 2.2s ease-in-out infinite",
    filter: "drop-shadow(0 6px 10px rgba(90,58,38,0.35))",
  },

  title: {
    margin: "0 0 1.25rem",
    fontSize: "1.15rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: palette.walnut,
  },

  barRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "0.5rem",
    color: palette.tanBrown,
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },

  hint: { opacity: 0.9 },

  percent: {
    fontSize: "1rem",
    color: palette.terracotta,
    fontVariantNumeric: "tabular-nums",
  },

  track: {
    position: "relative",
    height: 22,
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    // Recessed peach groove so the moss-green fill pops.
    background: "#E7CCB4",
    border: `2px solid rgba(90,58,38,0.3)`,
    boxShadow: "inset 0 2px 5px rgba(90,58,38,0.35)",
  },

  fill: {
    position: "relative",
    height: "100%",
    borderRadius: 999,
    // Deep moss green — the room's pop of colour — with a lit top edge.
    background: `linear-gradient(180deg, #6E8A6A 0%, #4E634A 55%, ${palette.mossGreen} 100%)`,
    boxShadow:
      "0 0 12px rgba(61,77,61,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
    // No CSS transition: the width is eased frame-by-frame in App's rAF loop,
    // so the bar moves in lockstep with the % text (a transition would lag it).
    transition: "none",
    overflow: "hidden",
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "40%",
    // Warm brass-tinted sweep of light across the fill.
    background:
      "linear-gradient(100deg, transparent, rgba(201,161,90,0.75), transparent)",
    animation: "cozy-shimmer 1.6s ease-in-out infinite",
  },

  flavor: {
    margin: "1rem auto 0",
    minHeight: "1.2em", // reserve a line so the panel doesn't jump on swap
    maxWidth: "28ch",
    fontSize: "0.85rem",
    fontStyle: "italic",
    color: "rgba(90,58,38,0.7)",
    animation: "cozy-fade 0.45s ease-out",
  },
};
