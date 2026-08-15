import React from "react";

/**
 * Cozy game-style loading screen, now sharing the site's actual design
 * tokens (font-display, text-zyk-heading/accent, the f2bf83→fef5eb wash)
 * instead of its own standalone palette — so it reads as the same app as
 * the Hero, not a separate splash screen.
 *
 * Shows a storybook dialog panel with a chunky progress bar, a moving
 * shimmer, and a looping coffee-cup clip. `progress` is a 0–100 percentage;
 * when it is undefined the bar animates in an indeterminate "warming up"
 * state.
 */

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
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-b from-zyk-bg-start] to-zyk-bg-end">
      {/* Keyframes are scoped to this screen and injected once — bob/shimmer/
          indeterminate aren't default Tailwind utilities. */}
      <style>{keyframes}</style>

      <div className="w-[min(420px,90vw)] rounded-[28px] border-2 border-[#BC693A] bg-linear-to-b from-[#FBF1E7] to-[#F6E7D6] px-8 pb-7 pt-9 text-center shadow-[0_18px_40px_rgba(90,58,38,0.28),inset_0_1px_0_rgba(255,255,255,0.7)]">
        <video
          src={"/assets/me/Coffe.webm"}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="mx-auto mb-2 h-30 w-30 object-contain animate-[cozy-bob_2.2s_ease-in-out_infinite] drop-shadow-[0_6px_10px_rgba(90,58,38,0.35)]"
        />

        <h1 className="mb-5 font-display text-lg text-zyk-heading">
          Setting up your cozy space
        </h1>

        <div className="mb-2 flex items-baseline justify-between text-[0.85rem] font-bold uppercase tracking-wider text-[#A9795E]">
          <span className="opacity-90">Loading</span>
          <span className="font-display tabular-nums text-zyk-accent">
            {hasProgress ? `${pct}%` : "…"}
          </span>
        </div>

        {/* Progress track */}
        <div className="relative h-[22px] w-full overflow-hidden rounded-full border-2 border-[rgba(90,58,38,0.3)] bg-[#E7CCB4] shadow-[inset_0_2px_5px_rgba(90,58,38,0.35)]">
          <div
            className="relative h-full overflow-hidden rounded-full bg-linear-to-b from-[#ffcf85] via-zyk-accent to-[#c9791f] shadow-[0_0_12px_rgba(201,161,90,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]"
            style={{
              width: hasProgress ? `${raw}%` : "40%",
              animation: hasProgress
                ? undefined
                : "cozy-indeterminate 1.4s ease-in-out infinite",
              transition: "none", // width is eased frame-by-frame in App's rAF loop
            }}
          >
            <div className="absolute left-0 top-0 h-full w-2/5 bg-linear-to-r from-transparent via-[rgba(201,161,90,0.75)] to-transparent [animation:cozy-shimmer_1.6s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* key={message} remounts the node on each change so it fades in. */}
        <p
          key={message}
          className="mx-auto mt-4 min-h-[1.2em] max-w-[28ch] text-[0.85rem] italic text-[rgba(90,58,38,0.7)] [animation:cozy-fade_0.45s_ease-out]"
        >
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
