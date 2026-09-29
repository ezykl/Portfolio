import React from "react";

/**
 * Terminal-window-styled loading screen. Shares the site's design language
 * (dark dev-theme, indigo/cyan radial blobs, subtle grid) so it reads as the
 * same app as the Hero — not a separate splash page.
 *
 * The card looks like a macOS terminal window (traffic-light dots, chrome bar,
 * monospace title). The coffee animation is progressively enhanced: Coffee.png
 * is shown immediately and seamlessly swapped to the animated Coffee.webm once
 * the video has loaded.
 *
 * `progress` is a 0–100 percentage; when undefined, the bar animates in an
 * indeterminate "warming up" state.
 */

/** Portfolio one-liners. One is picked at random per load and held the whole
 *  time so it's actually readable; "Come on in!" is reserved for 100%. */
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

  // --- Progressive Coffee: start with PNG, swap to WebM once ready ----------
  const [videoReady, setVideoReady] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setVideoReady(true);
    // `canplaythrough` fires when the browser estimates it can play the video
    // all the way through without buffering stalls.
    video.addEventListener("canplaythrough", onReady);
    // In case the video was already ready before the listener attached.
    if (video.readyState >= 4) setVideoReady(true);

    return () => video.removeEventListener("canplaythrough", onReady);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{
        backgroundColor: "#020617",
        backgroundImage: [
          "radial-gradient(circle at 90% 0%, rgba(99,102,241,0.20), transparent 42%)",
          "radial-gradient(circle at 10% 100%, rgba(34,211,238,0.16), transparent 48%)",
          "repeating-linear-gradient(0deg, rgba(148,163,184,0.05) 0px, rgba(148,163,184,0.05) 1px, transparent 1px, transparent 24px)",
          "repeating-linear-gradient(90deg, rgba(148,163,184,0.05) 0px, rgba(148,163,184,0.05) 1px, transparent 1px, transparent 24px)",
        ].join(", "),
      }}
    >
      <style>{keyframes}</style>

      {/* Terminal window card */}
      <div
        className="w-[min(440px,90vw)] overflow-hidden rounded-xl"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.20), 0 0 40px rgba(99,102,241,0.10), 0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Window chrome bar ── */}
        <div
          className="flex items-center px-4 py-3"
          style={{
            backgroundColor: "#0a0f1e",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-[10px] w-[10px] rounded-full" style={{ backgroundColor: "#f87171" }} />
            <span className="inline-block h-[10px] w-[10px] rounded-full" style={{ backgroundColor: "#fbbf24" }} />
            <span className="inline-block h-[10px] w-[10px] rounded-full" style={{ backgroundColor: "#4ade80" }} />
          </div>

          {/* Tab title */}
          <span
            className="flex-1 text-center font-display text-[11px] tracking-wider"
            style={{ color: "#64748b" }}
          >
            workspace.init
          </span>

          {/* Spacer to balance the traffic lights */}
          <div className="w-[52px]" />
        </div>

        {/* ── Card body ── */}
        <div className="px-8 pb-7 pt-7 text-center">
          {/* Coffee animation — PNG placeholder + progressive WebM swap */}
          <div className="relative mx-auto mb-2 h-30 w-30">
            {/* Static PNG — always visible until video is ready */}
            <img
              src="/assets/me/Coffee.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain animate-[cozy-bob_2.2s_ease-in-out_infinite]"
              style={{
                opacity: videoReady ? 0 : 1,
                transition: "opacity 0.5s ease-out",
              }}
            />

            {/* Animated WebM — loads in background, fades in when ready */}
            <video
              ref={videoRef}
              src="/assets/me/Coffee.webm"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain animate-[cozy-bob_2.2s_ease-in-out_infinite]"
              style={{
                opacity: videoReady ? 1 : 0,
                transition: "opacity 0.5s ease-out",
              }}
            />
          </div>

          <h1 className="mb-5 font-display text-lg text-zyk-heading">
            Initializing workspace
          </h1>

          <div className="mb-2 flex items-baseline justify-between text-[0.85rem] font-bold uppercase tracking-wider text-zyk-accent/70">
            <span className="opacity-90">Loading</span>
            <span className="font-display tabular-nums text-zyk-accent">
              {hasProgress ? `${pct}%` : "…"}
            </span>
          </div>

          {/* Progress track */}
          <div className="relative h-[22px] w-full overflow-hidden rounded-full border-2 border-zyk-accent/20 bg-[#0d1321] shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
            <div
              className="relative h-full overflow-hidden rounded-full bg-linear-to-b from-[#818cf8] via-zyk-primary to-[#4338ca] shadow-[0_0_12px_rgba(99,102,241,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
              style={{
                width: hasProgress ? `${raw}%` : "40%",
                animation: hasProgress
                  ? undefined
                  : "cozy-indeterminate 1.4s ease-in-out infinite",
                transition: "none", // width is eased frame-by-frame in App's rAF loop
              }}
            >
              <div className="absolute left-0 top-0 h-full w-2/5 bg-linear-to-r from-transparent via-[rgba(129,140,248,0.55)] to-transparent [animation:cozy-shimmer_1.6s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* key={message} remounts the node on each change so it fades in. */}
          <p
            key={message}
            className="mx-auto mt-4 min-h-[1.2em] max-w-[28ch] text-[0.85rem] italic text-zyk-heading/50 [animation:cozy-fade_0.45s_ease-out]"
          >
            {message}
          </p>
        </div>
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
