import React from "react";
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
  const navRef = React.useRef<HTMLElement | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setAtTop(latest < TOP_THRESHOLD);
  });

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

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-slate-950/98 backdrop-blur-2xl md:hidden"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="mb-4"
            >
              <img
                src={logoSrc}
                alt="Zyk"
                className="h-12 w-auto object-contain"
              />
            </motion.div>
            {LINKS.map((link, i) => {
              const isActive = active === link.href.slice(1);
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.05 + i * 0.06,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  onClick={handleClick(link.href)}
                  className={`font-display text-2xl uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-zyk-accent font-semibold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
