import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Placeholder } from "../ui/Placeholder";

/**
 * Featured Projects chapter (Priority 1) — an editorial, scroll-driven layout.
 * The section header + image sit in a `position: sticky` column that stays put
 * in the viewport; each project's title/blurb/tags scrolls past it in a normal
 * document-flow column. Whichever project's text block currently crosses the
 * vertical center of the viewport becomes "active," and the pinned image
 * cross-fades to match. Content here is intentionally placeholder — swap
 * `PROJECTS` for real case studies later; the mechanism doesn't care how many
 * entries there are.
 *
 * Active-project detection reuses the exact IntersectionObserver "collapse the
 * root to a center line" technique already proven in NavBar's scroll-spy
 * (`rootMargin: "-50% 0px -50% 0px"`), rather than continuous scroll-progress
 * math — simpler, and it's what a discrete "which block is centered" question
 * calls for.
 *
 * No pagination dots: a row of dots reads as "swipe me" (carousel affordance),
 * which is the wrong cue for a scroll-driven layout — the scroll motion itself
 * is the only affordance needed.
 *
 * Accessibility: a pinned, scroll-driven image is a stronger motion effect
 * than a simple fade, so `prefers-reduced-motion` skips the mechanism entirely
 * and falls back to a plain stacked list of image+text cards.
 */

interface Project {
  title: string;
  blurb: string;
  tags: string[];
  /** Description of the illustration/screenshot that belongs on the card. */
  art: string;
  href?: string;
}

const PROJECTS: Project[] = [
  {
    // The site itself is the first showcased project (per the brief).
    title: "This Portfolio World",
    blurb:
      "An interactive, scroll-through diorama built on a custom declarative scene engine — layered scenes, click-glow behaviors, a custom cursor, and ambient motion. The website is the demo.",
    tags: ["React", "TypeScript", "Scene Engine", "Framer Motion"],
    art: "Wide shot of the layered Hero diorama — outside + room + coding desk, softly lit",
    href: "#home",
  },
  {
    title: "[Placeholder Project Two]",
    blurb:
      "One-line hook for a real dev project. What problem it solved, your role, and the standout technical or design decision. Keep it case-study, not résumé.",
    tags: ["Placeholder", "Add", "Real", "Tags"],
    art: "Cozy illustrated mockup of the project's main screen on a wooden desk",
  },
  {
    title: "[Placeholder Project Three]",
    blurb:
      "Another project hook. Aim for range here — if project two was full-stack, make this one design- or interaction-heavy so the two cards show breadth.",
    tags: ["Placeholder", "Add", "Real", "Tags"],
    art: "Hand-drawn UI flow or a small animation still framed like a storybook page",
  },
];

const SECTION_INTRO = {
  eyebrow: "Things I've built",
  title: "Featured Projects",
  blurb: "A handful of things I've made — each one a small world of its own.",
};

const TagChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-full bg-zyk-secondary/40 px-3 py-1 font-body text-xs font-medium text-zyk-heading">
    {children}
  </span>
);

const ProjectText: React.FC<{
  project: Project;
  index: number;
  total: number;
}> = ({ project, index, total }) => (
  <>
    <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent">
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
    <h3 className="mt-2 font-display text-3xl text-zyk-heading md:text-4xl">
      {project.title}
    </h3>
    <p className="mt-3 font-body text-base leading-relaxed text-zyk-brown/80">
      {project.blurb}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <TagChip key={tag}>{tag}</TagChip>
      ))}
    </div>
    <a
      href={project.href ?? "#projects"}
      className="mt-5 inline-flex w-fit items-center gap-1 font-display text-sm text-zyk-accent transition-colors hover:text-zyk-primary"
    >
      Read case study &rarr;
    </a>
  </>
);

/** Plain, non-sticky fallback for prefers-reduced-motion — same content, no scroll-driven pinning. */
const ProjectsStaticList: React.FC = () => (
  <>
    <div className="max-w-2xl">
      <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
        {SECTION_INTRO.eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
        {SECTION_INTRO.title}
      </h2>
      <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
        {SECTION_INTRO.blurb}
      </p>
    </div>
    <div className="mt-12 flex flex-col gap-8">
      {PROJECTS.map((project, i) => (
        <div
          key={project.title}
          className="grid gap-8 rounded-3xl border border-zyk-brown/10 bg-zyk-bg-end/80 p-6 shadow-md md:grid-cols-2 md:items-center"
        >
          <Placeholder label={project.art} aspect="4 / 3" />
          <div>
            <ProjectText project={project} index={i} total={PROJECTS.length} />
          </div>
        </div>
      ))}
    </div>
  </>
);

export const ProjectsSection: React.FC = () => {
  const reduce = useReducedMotion() ?? false;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Same "collapse the viewport to a center line" technique as NavBar's
  // scroll-spy: whichever project's text block currently straddles that
  // line is the active one.
  useEffect(() => {
    if (reduce) return;
    const items = itemRefs.current.filter(
      (el): el is HTMLDivElement => el !== null,
    );
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = items.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1) setActiveIndex(idx);
        });
      },
      {
        rootMargin: "-490px 0px -410px 0px",
        threshold: 0,
      },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <section
      id="projects"
      style={{ scrollMarginTop: "var(--nav-height, 5rem)" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {reduce ? (
        <ProjectsStaticList />
      ) : (
        <>
          {/* Mobile: the pinned-image mechanic needs a tall scrolling column
              to work at all; without it (sticky is md+ only, below), the same
              spacing just becomes dead blank gaps. Reuse the compact static
              list instead — same content, no pin. */}
          <div className="md:hidden">
            <ProjectsStaticList />
          </div>

          <div className="hidden grid-cols-2 gap-16 md:grid">
            {/* Fixed column: header + image, pinned in the viewport while the
                text column (right) scrolls past. The image's own box has a
                constant size (aspect-ratio driven), so a true simultaneous
                cross-fade here is safe — nothing to overflow. */}
            <div
              className="md:sticky md:h-fit md:self-start"
              style={{ top: "var(--nav-height, 5rem)" }}
            >
              <p className="mt-4 font-display text-sm uppercase tracking-widest text-zyk-accent">
                {SECTION_INTRO.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
                {SECTION_INTRO.title}
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
                {SECTION_INTRO.blurb}
              </p>

              <div className="relative mt-8 aspect-4/3 w-full">
                <AnimatePresence>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Placeholder
                      label={PROJECTS[activeIndex].art}
                      aspect="4 / 3"
                      className="h-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Scrolling column: each project's title/blurb/tags in turn, with
                enough vertical room per item for it to travel from the bottom
                of the viewport to the top — the moment it crosses center is
                what triggers the image swap on the left. */}
            <div className="flex flex-col">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="flex min-h-[80vh] flex-col justify-center py-12 first:pt-0"
                >
                  <ProjectText
                    project={project}
                    index={i}
                    total={PROJECTS.length}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
