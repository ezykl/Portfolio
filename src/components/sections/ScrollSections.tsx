import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContactForm } from "../Contact/ContactForm";
import { ContactLinks } from "../Contact/ContactLinks";
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
  "Adobe Illustrator": "adobeillustrator",
  Photoshop: "photoshop",
  InDesign: "indesign",
  Canva: "canva",
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

/** Large featured chip for Design Tools — enlarged logo, same warm theme. */
const DesignToolChip: React.FC<{ label: string }> = ({ label }) => {
  const icon = TECH_ICON_MAP[label];
  return (
    <span className="inline-flex items-center gap-2.5 rounded-2xl border border-zyk-brown/10 bg-white/85 px-5 py-3 font-body text-sm font-medium text-zyk-heading shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md md:text-base">
      {icon && (
        <TechIcon name={icon} className="h-8 w-8 shrink-0 md:h-10 md:w-10" />
      )}
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

const ABOUT_BLURB =
  "Hi, I’m Ezekiel Villadolid, a Graphic Designer and UI/UX Designer creating clear, purposeful, and engaging visuals across digital and print. I enjoy turning ideas into thoughtful designs that communicate effectively, look great, and create meaningful experiences.";

const ABOUT_FACTS = [
  "Digital & Print Design",
  "UI/UX & Prototyping",
  "Open to roles & freelance",
];

interface ExperienceEntry {
  period: string;
  role: string;
  org: string;
  blurb: string;
  /** Concise, role-specific skills and workflow highlights. */
  highlights: string[];
}

const WORK_EXPERIENCE: ExperienceEntry[] = [
  {
    period: "Aug 2021 — Sep 2023",
    role: "Graphics Artist",
    org: "Island Artz Printing and Services",
    blurb:
      "Produced marketing collateral, signage, apparel graphics, mockups, and print-ready artwork while coordinating revisions and production.",
    highlights: [
      "Print Design",
      "Product Mockups",
      "Prepress",
      "Production Coordination",
    ],
  },
  {
    period: "2024 — 2025",
    role: "Graphics Artist",
    org: "Upwork / Freelance",
    blurb:
      "Created digital marketing materials while managing client communication, revisions, deadlines, and design quality.",
    highlights: ["Digital Design", "Client Collaboration", "Quality Control"],
  },
];

const LEADERSHIP_EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2023 — 2024",
    role: "UI/UX Lead",
    org: "Google Developer Student Clubs, CTU",
    blurb:
      "Led UI/UX initiatives, created Figma prototypes, facilitated workshops, and collaborated with student developers and designers.",
    highlights: ["Figma", "Prototyping", "Workshops", "Team Leadership"],
  },
  {
    period: "2022 — 2023",
    role: "Graphics Design Lead",
    org: "Google Developer Student Clubs, CTU",
    blurb:
      "Directed promotional design and event branding, maintaining visual consistency through cross-functional collaboration.",
    highlights: [
      "Event Branding",
      "Visual Direction",
      "Cross-functional Collaboration",
    ],
  },
];

interface ToolCategory {
  label: string;
  tools: string[];
}

const CREATIVE_TOOLKIT: ToolCategory[] = [
  {
    label: "Design Tools",
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "InDesign", "Canva"],
  },
  {
    label: "UI/UX Skills",
    tools: ["Wireframing", "Prototyping", "Mobile UI Design"],
  },
  {
    label: "Print & Production",
    tools: [
      "Print-ready Artwork",
      "Prepress",
      "Product Mockups",
      "Signage",
      "Apparel Graphics",
    ],
  },
  {
    label: "Creative Services",
    tools: [
      "Branding",
      "Marketing Materials",
      "Digital Content",
      "Client Revisions",
    ],
  },
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
      style={{ scrollMarginTop: "76px" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {/* About Me */}
      <motion.div
        {...reveal}
        className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)] md:items-center lg:gap-16"
      >
        <div className="max-w-3xl">
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
        </div>

        <figure className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="absolute inset-x-[4%] bottom-[3%] top-[18%] rotate-2 rounded-[2rem] bg-zyk-secondary/35"
          />
          <img
            src="/assets/me-longhair.png"
            alt="Portrait of Zyk"
            loading="lazy"
            decoding="async"
            className="relative h-auto w-full object-contain drop-shadow-[0_20px_28px_rgba(140,84,56,0.18)]"
          />
        </figure>
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

        <motion.h4
          {...reveal}
          className="mt-8 font-display text-xl text-zyk-heading md:text-2xl"
        >
          Work Experience
        </motion.h4>

        <div className="relative mt-8">
          {/* Horizontal connector (desktop) — draws in left→right. */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "right" }}
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
            className="grid gap-10 md:grid-cols-2 md:gap-8"
          >
            {WORK_EXPERIENCE.map((entry) => (
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
                    {entry.highlights.map((highlight) => (
                      <TechChip
                        key={highlight}
                        label={highlight}
                        className="rounded-full bg-zyk-secondary/35 px-2.5 py-1 text-xs text-zyk-heading"
                      />
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <motion.h4
          {...reveal}
          className="mt-16 font-display text-xl text-zyk-heading md:text-2xl"
        >
          Leadership Experience
        </motion.h4>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.15 } },
          }}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          {LEADERSHIP_EXPERIENCE.map((entry) => (
            <motion.article
              key={`${entry.role}-${entry.org}`}
              variants={item}
              className="rounded-[1.5rem] border border-zyk-brown/10 bg-zyk-bg-end/70 p-6 shadow-sm"
            >
              <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent">
                {entry.period}
              </p>
              <h5 className="mt-1 font-display text-lg text-zyk-heading">
                {entry.role}
              </h5>
              <p className="font-body text-sm font-medium text-zyk-brown/60">
                {entry.org}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-zyk-brown/80">
                {entry.blurb}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {entry.highlights.map((highlight) => (
                  <TechChip
                    key={highlight}
                    label={highlight}
                    className="rounded-full bg-zyk-secondary/35 px-2.5 py-1 text-xs text-zyk-heading"
                  />
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Design-focused tools and capabilities. */}
      <motion.div
        {...reveal}
        className="mt-16 rounded-[2rem] border border-zyk-brown/10 bg-zyk-bg-end/80 p-6 shadow-sm md:p-8"
      >
        <p className="text-center font-display text-sm uppercase tracking-[0.2em] text-zyk-accent">
          Creative Toolkit
        </p>
        <h4 className="mt-2 text-center font-display text-2xl text-zyk-heading">
          Tools &amp; Capabilities
        </h4>
        <p className="mx-auto mt-2 max-w-3xl text-center font-body text-sm leading-relaxed text-zyk-brown/75">
          A focused set of tools and practical skills used across digital
          design, UI/UX, branding, and print production.
        </p>
        {/* Featured Design Tools — enlarged, centered. */}
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <h5 className="font-display text-base tracking-wide text-zyk-heading md:text-lg">
            {CREATIVE_TOOLKIT[0].label}
          </h5>
          <div className="mt-4 flex flex-wrap justify-center gap-3 md:gap-4">
            {CREATIVE_TOOLKIT[0].tools.map((tool) => (
              <DesignToolChip key={tool} label={tool} />
            ))}
          </div>
        </div>
        {/* Remaining skills — centered below the featured row. */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
          {CREATIVE_TOOLKIT.slice(1).map((category) => (
            <div key={category.label} className="text-center">
              <h5 className="font-display text-sm text-zyk-heading">
                {category.label}
              </h5>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {category.tools.map((tool) => (
                  <TechChip
                    key={tool}
                    label={tool}
                    className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-zyk-brown/80 shadow-sm"
                  />
                ))}
              </div>
            </div>
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
          &copy; {year} Ezekiel Villadolid · Designed and built with care and a
          little coffee ☕
        </p>
        <a href="#home" className="transition-colors hover:text-zyk-bg-end">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};
