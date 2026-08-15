import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContactForm } from "../Contact/ContactForm";
import { ContactLinks } from "../Contact/ContactLinks";
import { Placeholder } from "../ui/Placeholder";
import { TechIcon, type TechIconName } from "../ui/techIcons";

// Maps our human-readable tech labels to vendored tech-logo icon names. Labels
// with no entry here (e.g. placeholder tags like "Tech") just render as
// plain text — TechChip below falls back gracefully.
const TECH_ICON_MAP: Partial<Record<string, TechIconName>> = {
  React: "react",
  TypeScript: "typescript",
  Tailwind: "tailwindcss",
  "Framer Motion": "framer",
  Figma: "figma",
  Vite: "vitejs",
  Git: "git",
  Node: "nodejs",
  HTML: "html5",
  CSS: "css3",
};

/** A tag pill with an optional tech-stack-icons logo in front of the label. */
const TechChip: React.FC<{ label: string; className?: string }> = ({
  label,
  className = "",
}) => {
  const icon = TECH_ICON_MAP[label];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body font-medium ${className}`}
    >
      {icon && <TechIcon name={icon} className="h-4 w-4 shrink-0" />}
      {label}
    </span>
  );
};

/**
 * Anchor scaffolding for the single-page scroll (§3). These are intentionally
 * light placeholders — they establish the section ids the NavBar links to
 * (#projects, #designs, #about, #contact) and the shared §2b visual language
 * (warm palette, display headings, soft on-appear fade) so real content can be
 * dropped in later without re-deciding layout or motion.
 */

/** Shared on-appear reveal (§4): fade + slight rise, once, reduced-motion safe. */
export const useReveal = () => {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? undefined : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };
};

interface DesignPiece {
  title: string;
  blurb: string;
  tags: string[];
  art: string;
}

const DESIGN_PIECES: DesignPiece[] = [
  {
    title: "UI / UX Thinking",
    blurb:
      "Figma flows, interface systems, and screen-level storytelling that feel like part of the same world as the portfolio itself.",
    tags: ["Figma", "UX", "Interaction"],
    art: "Warm illustrated wireframe board with hand-drawn UI notes pinned to a wooden wall",
  },
  {
    title: "Illustration & Motion",
    blurb:
      "Character-led scenes, cozy compositions, and light motion ideas that bring a handcrafted feel to digital work.",
    tags: ["Illustration", "Motion", "Storybook"],
    art: "Cozy poster-style illustration of a small desk scene with layered paper textures and soft lighting",
  },
  {
    title: "Brand & Visual Direction",
    blurb:
      "Visual systems that balance playfulness, clarity, and warmth — designed to feel like a place you want to step into.",
    tags: ["Brand", "Visual", "Identity"],
    art: "Handcrafted moodboard collage with paper scraps, color swatches, and a tiny painted frame",
  },
];

const TagChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-full bg-zyk-secondary/40 px-3 py-1 font-body text-xs font-medium text-zyk-heading">
    {children}
  </span>
);

const DesignCard: React.FC<{ piece: DesignPiece; reduce: boolean }> = ({
  piece,
  reduce,
}) => (
  <motion.article
    variants={{
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    }}
    className="flex flex-col overflow-hidden rounded-3xl border border-zyk-brown/10 bg-zyk-bg-end/80 p-4 shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl"
  >
    <Placeholder label={piece.art} aspect="4 / 3" />
    <h3 className="mt-4 font-display text-2xl text-zyk-heading">
      {piece.title}
    </h3>
    <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-zyk-brown/80">
      {piece.blurb}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {piece.tags.map((tag) => (
        <TagChip key={tag}>{tag}</TagChip>
      ))}
    </div>
  </motion.article>
);

export const DesignsSection: React.FC = () => {
  const reveal = useReveal();
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="designs"
      style={{ scrollMarginTop: "5rem" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <motion.div {...reveal} className="max-w-3xl">
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          Things I&apos;ve drawn
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          Design Collection
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
          A cozy collection of visual work — UX thinking, illustration, and
          playful direction that all belong to the same handmade world.
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
        className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {DESIGN_PIECES.map((piece) => (
          <DesignCard key={piece.title} piece={piece} reduce={reduce} />
        ))}
      </motion.div>
    </section>
  );
};

// ▶ EDIT ME: 2-4 sentences on who you are beyond the résumé — background,
// personality, what drives you. Keep it personal and cozy, not corporate.
const ABOUT_BLURB =
  "[Personal bio placeholder — a couple of sentences about who you are outside of the work: your background, what you're curious about, and what makes you, you.]";

// ▶ EDIT ME: quick scannable facts — where you're based, hobbies, fun details.
const ABOUT_FACTS = ["[Based in ...]", "[A hobby you love]", "[Something playful about you]"];

interface ExperienceEntry {
  period: string;
  role: string;
  org: string;
  blurb: string;
  /** Tech / skills used in this role — the stack, told over time. */
  tech: string[];
}

// ▶ EDIT ME: your real roles, in order — internships, jobs, leadership
// positions, freelance work. Replace every bracketed placeholder below.
const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "[20XX — 20XX]",
    role: "[Your Role]",
    org: "[Company / Organization]",
    blurb:
      "[One or two sentences on what you did and the impact you made.]",
    tech: ["Tech", "Used", "Here"],
  },
  {
    period: "[20XX — 20XX]",
    role: "[Your Role]",
    org: "[Company / Organization]",
    blurb:
      "[One or two sentences on what you did and the impact you made.]",
    tech: ["Tech", "Used", "Here"],
  },
  {
    period: "[20XX — Present]",
    role: "[Your Role]",
    org: "[Company / Organization]",
    blurb:
      "[One or two sentences on what you did and the impact you made.]",
    tech: ["Tech", "Used", "Here"],
  },
];

// At-a-glance current stack, shown as a strip below Experience.
const TECH_STACK = [
  "React",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Figma",
  "Vite",
  "Git",
  "Node",
];

export const JourneySection: React.FC = () => {
  const reveal = useReveal();
  const reduce = useReducedMotion() ?? false;

  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="journey"
      style={{ scrollMarginTop: "5rem" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {/* About Me */}
      <motion.div {...reveal} className="max-w-3xl">
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          Who I am
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          About Me
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
          {ABOUT_BLURB}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ABOUT_FACTS.map((fact) => (
            <span
              key={fact}
              className="rounded-full bg-zyk-secondary/35 px-3 py-1 font-body text-xs font-medium text-zyk-heading"
            >
              {fact}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Experience: a line crossing left→right (top→bottom on mobile) with a
          dot per role. */}
      <div className="mt-20">
        <motion.p
          {...reveal}
          className="font-display text-sm uppercase tracking-widest text-zyk-accent"
        >
          Where I&apos;ve been
        </motion.p>
        <motion.h3
          {...reveal}
          className="mt-2 font-display text-3xl text-zyk-heading md:text-4xl"
        >
          Experience
        </motion.h3>

        <div className="relative mt-12">
          {/* Horizontal connector (desktop) — draws in left→right. */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-2 hidden h-0.5 bg-zyk-brown/20 md:block"
          />
          {/* Vertical connector (mobile). */}
          <div
            aria-hidden
            className="absolute bottom-0 left-2 top-2 w-0.5 bg-zyk-brown/20 md:hidden"
          />

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.15 } },
            }}
            className="grid gap-10 md:grid-cols-3 md:gap-6"
          >
            {EXPERIENCE.map((entry) => (
              <motion.li
                key={`${entry.role}-${entry.org}`}
                variants={item}
                className="relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
              >
                {/* Dot on the line */}
                <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full bg-zyk-primary ring-4 ring-zyk-bg-end md:mt-0" />

                <div className="md:mt-6">
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent">
                    {entry.period}
                  </p>
                  <p className="mt-1 font-display text-lg text-zyk-heading">
                    {entry.role}
                  </p>
                  <p className="font-body text-sm font-medium text-zyk-brown/60">
                    {entry.org}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-zyk-brown/80">
                    {entry.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 md:justify-center">
                    {entry.tech.map((t) => (
                      <TechChip
                        key={t}
                        label={t}
                        className="rounded-full bg-zyk-secondary/35 px-2.5 py-1 text-xs text-zyk-heading"
                      />
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>

      {/* Tech Stack summary */}
      <motion.div
        {...reveal}
        className="mt-16 rounded-[2rem] border border-zyk-brown/10 bg-zyk-bg-end/80 p-6 text-center shadow-sm"
      >
        <p className="font-display text-sm uppercase tracking-[0.2em] text-zyk-accent">
          Tech Stack
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tool) => (
            <TechChip
              key={tool}
              label={tool}
              className="rounded-full bg-white/70 px-3 py-1.5 text-sm text-zyk-brown/80 shadow-sm"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/** Contact / footer — the §2b brown footer band with a hire-me call to action,
 *  a faint patterned texture, and a closing footer bar. */
export const ContactSection: React.FC = () => {
  const reveal = useReveal();
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      style={{ scrollMarginTop: "5rem" }}
      className="relative mt-12 overflow-hidden bg-zyk-brown px-6 py-20 text-center text-zyk-bg-end"
    >
      {/* bg-pattern.svg overlaid and recoloured to a soft cream via CSS mask
          (the source SVG is solid black — masking lets us tint it without
          editing the shared asset). Sits behind the content as faint texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundColor: "#FEF5EB",
          WebkitMaskImage: "url(/assets/ui/bg-pattern.svg)",
          maskImage: "url(/assets/ui/bg-pattern.svg)",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
          WebkitMaskSize: "300px",
          maskSize: "300px",
        }}
      />

      <motion.div {...reveal} className="relative z-10 mx-auto max-w-2xl">
        <h2 className="font-display text-4xl md:text-5xl">
          Let&apos;s work together.
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body text-lg text-zyk-bg-end/80">
          Open to roles and freelance. If the diorama made you smile, let&apos;s
          talk.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>

        {/* Or reach me directly */}
        <div className="mt-10">
          <p className="mb-4 font-display text-xs uppercase tracking-[0.24em] text-zyk-bg-end/70">
            Or find me here
          </p>
          <ContactLinks />
        </div>
      </motion.div>

      {/* Closing footer bar */}
      <div className="relative z-10 mx-auto mt-16 flex max-w-5xl flex-col items-center gap-2 border-t border-zyk-bg-end/15 pt-6 font-body text-sm text-zyk-bg-end/70 sm:flex-row sm:justify-between">
        <p className="font-display tracking-wide">Zyk</p>
        <p>
          &copy; {year} Ezekiel Villadolid · Built with React, Tailwind &amp; a
          lot of coffee ☕
        </p>
        <a
          href="#home"
          className="transition-colors hover:text-zyk-bg-end"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};
