import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Placeholder } from "../ui/Placeholder";
import { useReveal } from "./ScrollSections";

/**
 * Featured Projects chapter (Priority 1). Case-study cards laid out with the
 * project's placeholder-asset convention: artwork is a described <Placeholder>
 * so the layout is functional before final illustrations exist. Content here is
 * intentionally placeholder — swap `PROJECTS` for real case studies later.
 *
 * Motion (§4): the header uses the shared fade+rise reveal; the card grid
 * staggers its children in, all reduced-motion safe.
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

const TagChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-full bg-zyk-secondary/40 px-3 py-1 font-body text-xs font-medium text-zyk-heading">
    {children}
  </span>
);

const ProjectCard: React.FC<{ project: Project; reduce: boolean }> = ({
  project,
  reduce,
}) => (
  <motion.article
    variants={{
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    className="flex flex-col overflow-hidden rounded-3xl border border-zyk-brown/10 bg-zyk-bg-end/80 p-4 shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl"
  >
    <Placeholder label={project.art} aspect="4 / 3" />
    <h3 className="mt-4 font-display text-2xl text-zyk-heading">
      {project.title}
    </h3>
    <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-zyk-brown/80">
      {project.blurb}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <TagChip key={tag}>{tag}</TagChip>
      ))}
    </div>
    <a
      href={project.href ?? "#projects"}
      className="mt-5 inline-flex items-center gap-1 font-display text-sm text-zyk-accent transition-colors hover:text-zyk-primary"
    >
      Read case study &rarr;
    </a>
  </motion.article>
);

export const ProjectsSection: React.FC = () => {
  const reveal = useReveal();
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="projects"
      style={{ scrollMarginTop: "5rem" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <motion.div {...reveal} className="max-w-2xl">
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          Things I&apos;ve built
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          Featured Projects
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
          A handful of things I&apos;ve made — each one a small world of its own.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
        }}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} reduce={reduce} />
        ))}
      </motion.div>
    </section>
  );
};
