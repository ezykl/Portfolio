import React from "react";

/**
 * A described stand-in for artwork that doesn't exist yet (per the project's
 * placeholder philosophy: never depend on final assets). Renders a warm dashed
 * frame with a "[ Placeholder ]" tag and a plain-language description of the
 * illustration that belongs here, so the layout stays functional and future
 * artists know exactly what to draw.
 *
 * Example:
 *   <Placeholder label="Cozy isometric workspace with a glowing monitor" />
 */

interface PlaceholderProps {
  /** Plain-language description of the intended illustration. */
  label: string;
  /** CSS aspect-ratio (e.g. "16 / 9", "4 / 3", "1 / 1"). Default 16/9. */
  aspect?: string;
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  label,
  aspect = "16 / 9",
  className = "",
}) => (
  <div
    role="img"
    aria-label={`Placeholder illustration: ${label}`}
    style={{ aspectRatio: aspect }}
    className={
      "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed " +
      "border-zyk-brown/30 bg-zyk-secondary/20 p-4 text-center" +
      (className ? ` ${className}` : "")
    }
  >
    <span className="rounded-full bg-zyk-brown/10 px-3 py-1 font-display text-xs uppercase tracking-widest text-zyk-brown/60">
      Placeholder
    </span>
    <span className="max-w-[85%] font-body text-sm leading-snug text-zyk-brown/70">
      {label}
    </span>
  </div>
);
