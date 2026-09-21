import React from "react";

/**
 * Capsule button from §2b: full pill shape, solid fill, no border, soft drop
 * shadow. `primary` = peach fill / white label; `secondary` = honey fill /
 * dark-brown label. Renders as an <a> when `href` is given, else a <button>.
 */

type Variant = "primary" | "secondary";

interface PillButtonProps {
  variant?: Variant;
  href?: string;
  onClick?: React.MouseEventHandler;
  /** Button type when rendered as a <button> (ignored when `href` is set). */
  type?: "button" | "submit";
  disabled?: boolean;
  /** When true (or a filename string), the anchor triggers a download. */
  download?: boolean | string;
  children: React.ReactNode;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-zyk-primary text-white hover:bg-indigo-500 font-semibold shadow-indigo-500/25",
  secondary: "bg-zyk-secondary text-slate-950 font-bold hover:bg-cyan-300 shadow-cyan-500/25",
};

export const PillButton: React.FC<PillButtonProps> = ({
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled = false,
  download,
  children,
  className = "",
}) => {
  const classes =
    "inline-flex items-center justify-center rounded-full px-7 py-3 font-display text-base " +
    "shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg " +
    "active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 " +
    VARIANTS[variant] +
    (className ? ` ${className}` : "");

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        {...(download
          ? {
              download: download === true ? "" : download,
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};

