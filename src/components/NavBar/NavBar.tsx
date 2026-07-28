import React from "react";
import {
  motion,
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
  { label: "Projects", href: "#projects" },
  { label: "Designs", href: "#designs" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const TOP_THRESHOLD = 20;

export const NavBar: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [atTop, setAtTop] = React.useState(true);
  const [active, setActive] = React.useState<string>("home");
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

  const handleClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    };

  return (
    <motion.nav
      ref={navRef}
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-100 transition-colors duration-300"
      style={{
        backgroundColor: atTop
          ? "rgba(242, 191, 131, 0)"
          : "rgba(242, 191, 131, 1)",
        boxShadow: atTop
          ? "0 4px 20px rgba(0,0,0,0)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
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

        <ul className="flex items-center gap-5 font-display text-sm tracking-wide text-zyk-heading md:gap-8 md:text-base">
          {LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  onClick={handleClick(link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`uppercase transition-colors ${
                    isActive ? "text-zyk-accent" : "hover:text-zyk-accent"
                  }`}
                >
                  {link.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-zyk-text-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};
