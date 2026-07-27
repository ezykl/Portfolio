import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import logoSrc from "/assets/logo.svg";
/**
 * Floating, transparent-over-gradient navigation (§2b UI chrome).
 * A small rounded logo mark sits top-left; all-caps display-font links sit
 * top-right and smooth-scroll to the single-page section anchors (§3).
 *
 * Kept intentionally minimal — Home · Projects · Designs · About — folding
 * Expo/Contributions into About to avoid a 5th stop.
 */

interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Designs", href: "#designs" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const FADE_DISTANCE = 300;

export const NavBar: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const backgroundOpacity = useTransform(scrollY, [0, FADE_DISTANCE], [0, 1]);

  const backgroundColor = useTransform(
    backgroundOpacity,
    (opacity) => `rgba(242, 191, 131, ${opacity})`, // #f2bf83
  );

  const boxShadow = useTransform(
    backgroundOpacity,
    (opacity) => `0 4px 20px rgba(0, 0, 0, ${opacity * 0.08})`,
  );

  // Anchor scroll is handled by CSS `scroll-behavior: smooth` (disabled under
  // prefers-reduced-motion in index.css), so a plain hash link is enough — we
  // only intercept to keep the URL clean and update focus for a11y.
  const handleClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.querySelector(href);
      if (!target) return; // let the browser handle it if the anchor is missing
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    };

  return (
    <motion.nav
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ backgroundColor, boxShadow }}
      className="fixed inset-x-0 top-0 z-100"
    >
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#home"
          onClick={handleClick("#home")}
          aria-label="Back to top"
          className="flex h-11 w-11 items-center justify-center transition-transform hover:scale-105"
        >
          <img src={logoSrc} alt="Logo" className="h-11 w-11 object-contain" />
        </a>

        {/* Links — all-caps display face, warm brown, amber on hover. */}
        <ul className="flex items-center gap-5 font-display text-sm tracking-wide text-zyk-heading md:gap-8 md:text-base">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleClick(link.href)}
                className="uppercase transition-colors hover:text-zyk-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};
