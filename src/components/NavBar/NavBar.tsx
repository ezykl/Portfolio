import React from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import logoSrc from "/assets/logo.svg";

interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#projects" },
  { label: "Creative Lab", href: "#gallery" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const TOP_THRESHOLD = 20;

export const NavBar: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = React.useState(true);
  const [active, setActive] = React.useState<string>("home");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const navRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setAtTop(latest < TOP_THRESHOLD);
  });

  // Close mobile drawer on desktop breakpoint resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Scroll-spy: highlight the link whose section currently crosses the middle
  // of the viewport. The -50%/-50% rootMargin collapses the root to a center
  // line, so exactly one section is "intersecting" at a time.
  React.useEffect(() => {
    const sections = LINKS.map((l) =>
      document.getElementById(l.href.slice(1)),
    ).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Publish the nav's real rendered height so sections can use it for
  // scroll-margin-top instead of a hardcoded guess. Re-measures on resize
  // (e.g. logo/font/padding changes at different breakpoints).
  React.useEffect(() => {
    const node = navRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const setVar = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${node.offsetHeight}px`,
      );
    };

    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      // Unlock mobile body overflow immediately
      document.body.style.overflow = "";
      setMobileOpen(false);

      const target = document.querySelector(href);
      if (!target) return;

      // Small delay on mobile ensures the drawer unmounts and viewport unfreezes before scrolling
      setTimeout(() => {
        const navHeight = navRef.current?.getBoundingClientRect().height ?? 64;
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navHeight,
        );
        window.scrollTo({
          top,
          behavior: reduce ? "auto" : "smooth",
        });
      }, 50);
    };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-100 transition-colors duration-300"
        style={{
          backgroundColor: atTop ? "rgba(2, 6, 23, 0)" : "rgba(2, 6, 23, 0.85)",
          backdropFilter: atTop ? "none" : "blur(12px)",
          WebkitBackdropFilter: atTop ? "none" : "blur(12px)",
          borderBottom: atTop
            ? "1px solid rgba(255, 255, 255, 0)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: atTop
            ? "none"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4 md:px-10">
          <a
            href="#home"
            onClick={handleClick("#home")}
            aria-label="Back to top"
            className="flex items-center justify-center transition-transform hover:scale-105"
          >
            <img src={logoSrc} alt="Zyk" className="h-9 w-auto object-contain" />
          </a>

          {/* Desktop Nav Links — clean, elegant typography */}
          <ul className="hidden items-center gap-6 font-display text-sm tracking-wide md:flex md:gap-8 md:text-base">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href} className="relative py-1">
                  <a
                    href={link.href}
                    onClick={handleClick(link.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={`uppercase transition-colors duration-200 ${
                      isActive
                        ? "text-zyk-accent font-semibold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-zyk-accent shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Hamburger toggle — visible only on mobile with generous touch target */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: 45, y: 8, backgroundColor: "#38bdf8" }
                  : { rotate: 0, y: 0, backgroundColor: "#e2e8f0" }
              }
              transition={{ duration: 0.25 }}
              className="block h-0.5 w-6 rounded-full bg-zyk-heading"
            />
            <motion.span
              animate={
                mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
              }
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-6 rounded-full bg-zyk-heading"
            />
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: -45, y: -8, backgroundColor: "#38bdf8" }
                  : { rotate: 0, y: 0, backgroundColor: "#e2e8f0" }
              }
              transition={{ duration: 0.25 }}
              className="block h-0.5 w-6 rounded-full bg-zyk-heading"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen drawer rendered via React Portal directly into document.body.
          This ensures the fixed overlay is NEVER trapped or clipped by header transforms
          or backdropFilter when scrolled deep down the page. */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={
                  reduce
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 320, damping: 30 }
                }
                className="fixed inset-0 z-9999 flex flex-col bg-[#020617]/98 backdrop-blur-2xl md:hidden overflow-y-auto"
                style={{
                  backgroundImage: [
                    "repeating-linear-gradient(0deg, rgba(148,163,184,0.04) 0px, rgba(148,163,184,0.04) 1px, transparent 1px, transparent 24px)",
                    "repeating-linear-gradient(90deg, rgba(148,163,184,0.04) 0px, rgba(148,163,184,0.04) 1px, transparent 1px, transparent 24px)",
                  ].join(", "),
                }}
              >
                {/* Header row inside drawer with Logo and Close button */}
                <div className="flex w-full items-center justify-between px-6 py-4 border-b border-white/5">
                  <a
                    href="#home"
                    onClick={handleClick("#home")}
                    aria-label="Back to top"
                    className="flex items-center"
                  >
                    <img src={logoSrc} alt="Zyk" className="h-9 w-auto object-contain" />
                  </a>

                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-1 flex-col items-center justify-center gap-7 py-12 px-6">
                  {LINKS.map((link, i) => {
                    const isActive = active === link.href.slice(1);
                    return (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: reduce ? 0 : 0.05 + i * 0.05,
                          duration: 0.25,
                          ease: "easeOut",
                        }}
                        onClick={handleClick(link.href)}
                        className={`font-display text-2xl uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-zyk-accent font-semibold drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </motion.a>
                    );
                  })}
                </div>

                {/* Subtle minimalist bottom branding */}
                <div className="flex w-full items-center justify-center pb-8 pt-4 text-xs font-mono tracking-widest text-slate-500">
                  ZYK // PORTFOLIO
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
