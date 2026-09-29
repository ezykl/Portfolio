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
  "React Native": "react",
  "Next.js": "react",
  TypeScript: "typescript",
  Tailwind: "tailwindcss",
  "Tailwind CSS": "tailwindcss",
  "Framer Motion": "framer",
  Figma: "figma",
  Vite: "vitejs",
  Git: "git",
  GitHub: "git",
  Node: "nodejs",
  "Node.js": "nodejs",
  HTML: "html5",
  HTML5: "html5",
  CSS: "css3",
  CSS3: "css3",
  "Adobe Illustrator": "adobeillustrator",
  Illustrator: "adobeillustrator",
  Photoshop: "photoshop",
  "Adobe Photoshop": "photoshop",
  InDesign: "indesign",
  Canva: "canva",
  Express: "nodejs",
  Firebase: "vitejs",
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
    <span className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-3 font-body text-sm font-medium text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md md:text-base">
      {icon && (
        <TechIcon name={icon} className="h-8 w-8 shrink-0 md:h-10 md:w-10" />
      )}
      {label}
    </span>
  );
};

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
  "Hi, I’m Ezekiel Villadolid, a Full-Stack Developer and Mobile App Developer crafting fast, modern, and thoughtfully architected web and mobile applications. I combine clean code with design sensibility to build seamless digital experiences.";

const ABOUT_FACTS = [
  "Full-Stack Development",
  "Mobile App Development",
  "UI/UX Design",
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
    period: "Feb 2026 — Apr 2026",
    role: "Data Annotator Intern",
    org: "Innodata Knowledge Services, Inc.",
    blurb:
      "Reviewed and validated image and video datasets according to detailed project guidelines. Investigated inconsistencies while maintaining accuracy, quality, and productivity standards.",
    highlights: [
      "Dataset Validation",
      "Image & Video QA",
      "Data Integrity",
      "Quality Assurance",
    ],
  },
  {
    period: "2024 — 2025",
    role: "Graphics Artist",
    org: "Upwork / Freelance",
    blurb:
      "Created digital marketing materials while managing client communication, revisions, deadlines, and high-volume photo restorations.",
    highlights: [
      "Digital Design",
      "Client Collaboration",
      "Photo Restoration",
      "Quality Control",
    ],
  },
  {
    period: "Feb 2024 — May 2024",
    role: "Content Operations Support",
    org: "Project-Based",
    blurb:
      "Processed digital content using internal TTS tools and web-based content management systems. Performed quality checks, verified content accuracy, and investigated discrepancies within structured workflows.",
    highlights: ["CMS", "TTS Tools", "Content QA", "Process Workflows"],
  },
  {
    period: "Aug 2021 — Sep 2023",
    role: "Graphics Artist",
    org: "Island Artz Printing and Services",
    blurb:
      "Produced marketing collateral, signage, apparel graphics, mockups, and print-ready prepress artwork while coordinating production specifications.",
    highlights: [
      "Print Design",
      "Product Mockups",
      "Prepress",
      "Production Coordination",
    ],
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

interface SkillGroup {
  category: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C#", "C"],
  },
  {
    category: "Frontend & Mobile",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Vite",
      "Tailwind CSS",
      "Shadcn UI",
      "HTML5",
      "CSS3",
    ],
  },
  {
    category: "Backend & Systems",
    skills: ["Node.js", "Express", "Flask", "RESTful APIs", ".NET"],
  },
  {
    category: "Databases & Storage",
    skills: ["Firebase", "Firestore", "MySQL", "NoSQL"],
  },
  {
    category: "Developer & AI Tools",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "Claude Code",
      "GitHub Copilot",
      "Antigravity",
    ],
  },
  {
    category: "UI/UX & Creative",
    skills: [
      "Figma",
      "UI Prototyping",
      "Interface Design",
      "Photoshop",
      "Illustrator",
      "InDesign",
      "Canva",
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
      style={{ scrollMarginTop: "var(--nav-height, 5rem)" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {/* About Me */}
      <motion.div
        {...reveal}
        className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)] md:items-center lg:gap-16"
      >
        <div className="max-w-3xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold">
            // 04. JOURNEY &amp; TIMELINE
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
            About Me
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-slate-300">
            {ABOUT_BLURB}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ABOUT_FACTS.map((fact) => (
              <span
                key={fact}
                className="rounded-full border border-zyk-accent/30 bg-zyk-accent/10 px-3.5 py-1 font-display text-xs font-medium text-zyk-accent"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-[4%] bottom-[3%] top-[18%] rotate-2 rounded-[2rem] bg-gradient-to-tr from-zyk-primary/30 to-zyk-accent/30 blur-2xl"
          />
          <img
            src="/assets/me-longhair.png"
            alt="Portrait of Zyk"
            loading="lazy"
            decoding="async"
            className="relative h-auto w-full object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.5)]"
          />
        </figure>
      </motion.div>

      {/* Experience Timeline */}
      <div className="mt-24">
        <motion.p
          {...reveal}
          className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold"
        >
          // CAREER TIMELINE
        </motion.p>
        <motion.h3
          {...reveal}
          className="mt-2 font-display text-3xl font-bold text-white md:text-4xl"
        >
          Work Experience
        </motion.h3>

        <div className="relative mt-12 pl-6 sm:pl-8 border-l border-slate-800">
          {/* Animated vertical spine that scales on scroll */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-zyk-accent via-indigo-500 to-transparent"
          />

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.15 } },
            }}
            className="space-y-10"
          >
            {WORK_EXPERIENCE.map((entry) => (
              <motion.li
                key={`${entry.role}-${entry.org}`}
                variants={item}
                className="relative group"
              >
                {/* Milestone Node Dot with pulse ring */}
                <span className="absolute -left-[31px] sm:-left-[39px] top-2 flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-full w-full rounded-full bg-zyk-accent/30 animate-ping group-hover:scale-125" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-zyk-accent ring-4 ring-[#020617] group-hover:bg-cyan-300" />
                </span>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 group-hover:border-zyk-accent/40 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-zyk-accent">
                      {entry.period}
                    </span>
                    <span className="font-body text-xs font-medium text-slate-400">
                      {entry.org}
                    </span>
                  </div>

                  <h4 className="mt-2 font-display text-xl font-bold text-white group-hover:text-zyk-accent transition-colors">
                    {entry.role}
                  </h4>

                  <p className="mt-2.5 font-body text-sm leading-relaxed text-slate-300">
                    {entry.blurb}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 pt-1">
                    {entry.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-display text-[0.7rem] font-medium text-slate-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* Leadership Experience */}
        <motion.h4
          {...reveal}
          className="mt-16 font-display text-xl font-bold text-white md:text-2xl"
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
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-zyk-accent/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]"
            >
              <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold">
                {entry.period}
              </p>
              <h5 className="mt-1 font-display text-lg font-bold text-white">
                {entry.role}
              </h5>
              <p className="font-body text-sm font-medium text-slate-400">
                {entry.org}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-slate-300">
                {entry.blurb}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-display text-[0.7rem] font-medium text-slate-300"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* 6-Category Technical & Creative Stack */}
      <motion.div
        {...reveal}
        className="mt-24 border-t border-slate-800/80 pt-16"
      >
        <div className="max-w-2xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold">
            // ARSENAL &amp; SKILLS
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Technical &amp; Creative Stack
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-slate-300">
            A comprehensive overview of programming languages, frontend &amp; mobile frameworks, backend systems, databases, developer tools, and design capabilities.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((group) => (
            <div
              key={group.category}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zyk-accent/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]"
            >
              <div>
                <h5 className="font-display text-xs uppercase tracking-[0.18em] text-zyk-accent font-semibold">
                  {group.category}
                </h5>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-body text-xs font-medium text-slate-200 transition-colors hover:border-zyk-accent/30 hover:bg-white/10"
                    >
                      <TechChip label={skill} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/** Contact / footer — dark glass footer band with numbered eyebrow,
 *  direct contact links, and closing signature. */
export const ContactSection: React.FC = () => {
  const reveal = useReveal();
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      style={{ scrollMarginTop: "5rem" }}
      className="relative mt-24 overflow-hidden border-t border-slate-800/80 bg-slate-950/80 px-6 py-24 text-center text-slate-200 backdrop-blur-md"
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.06),transparent_100%)]"
      />

      <motion.div {...reveal} className="relative z-10 mx-auto max-w-2xl">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-zyk-accent font-semibold">
          // 05. GET IN TOUCH
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
          Let&apos;s build something great.
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-body text-base text-slate-300 sm:text-lg">
          Open to full-time engineering roles, creative collaborations, and
          freelance opportunities. Let&apos;s connect.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>

        {/* Direct reach links */}
        <div className="mt-12">
          <p className="mb-4 font-display text-xs uppercase tracking-[0.24em] text-zyk-accent font-semibold">
            Or reach out directly
          </p>
          <ContactLinks />
        </div>
      </motion.div>

      {/* Closing footer bar */}
      <div className="relative z-10 mx-auto mt-20 flex max-w-5xl flex-col items-center gap-3 border-t border-white/10 pt-8 font-body text-sm text-slate-400 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/logo.svg"
            alt="Zyk"
            className="h-5 w-auto object-contain opacity-90"
          />
        </div>
        <p className="text-slate-400">
          &copy; {year} Ezekiel Villadolid · Built with TypeScript, React &amp; Tailwind
        </p>
        <a
          href="#home"
          className="font-display text-sm font-medium text-zyk-accent transition-colors hover:text-white"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};
