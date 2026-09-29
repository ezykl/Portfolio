import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Placeholder } from "../ui/Placeholder";
import { TechIcon, type TechIconName } from "../ui/techIcons";
import {
  ImageProjectPreview,
  type ImageCaseStudy,
  type ImagePreviewContext,
} from "./ImageProjectPreview";
import { SchoolPaperFlipbook } from "./SchoolPaperFlipbook";

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
  cover?: string;
  previewPages?: string[];
  flipbook?: boolean;
  imagePreview?: boolean;
  stackedCover?: boolean;
  comparisonCover?: boolean;
  roundedCover?: boolean;
  coverShadow?: boolean;
  galleryImages?: string[];
  galleryVideos?: string[];
  externalLink?: {
    label: string;
    href: string;
  };
  caseStudy?: ImageCaseStudy;
  previewContext?: ImagePreviewContext;
  contribution?: string;
  tools?: Array<{
    label: string;
    icon: TechIconName;
    usage: "Primary" | "Supporting";
  }>;
  href?: string;
}

const PROJECTS: Project[] = [
  {
    title: "Rent2Reuse",
    blurb:
      "A peer-to-peer mobile marketplace designed to help people rent and lend underused items within their community, fostering circular economies and sustainable sharing.",
    contribution:
      "Full-Stack Developer and UI/UX Designer — conceptualized the UX flow in Figma and implemented the mobile application frontend with REST API integrations.",
    tags: ["React Native", "Expo", "Node.js", "Figma", "Marketplace"],
    art: "Rent2Reuse mobile marketplace interface",
    cover: "/assets/rent2reuse/1.png",
    previewPages: [
      "/assets/rent2reuse/7.png",
      "/assets/rent2reuse/4.png",
      "/assets/rent2reuse/2.png",
    ],
    imagePreview: true,
    stackedCover: true,
    roundedCover: true,
    galleryImages: [
      "/assets/rent2reuse/1.png",
      "/assets/rent2reuse/2.png",
      "/assets/rent2reuse/3.png",
      "/assets/rent2reuse/4.png",
      "/assets/rent2reuse/5.png",
      "/assets/rent2reuse/6.png",
      "/assets/rent2reuse/7.png",
      "/assets/rent2reuse/8.png",
      "/assets/rent2reuse/9.png",
    ],
    externalLink: {
      label: "View on GitHub",
      href: "https://github.com/ezykl/rent2reuse",
    },
    tools: [
      { label: "Figma", icon: "figma", usage: "Primary" },
      { label: "React", icon: "react", usage: "Primary" },
      { label: "TypeScript", icon: "typescript", usage: "Primary" },
    ],
    caseStudy: {
      eyebrow: "Mobile marketplace · UI/UX case study",
      summary:
        "Rent2Reuse makes it easier for community members to access useful items without buying them, while helping owners give underused tools and equipment a second life.",
      role: "Full-Stack Developer and UI/UX Designer",
      note: "Selected screen sample: this presentation shows only part of the interface, but each design represents an actual frame from the Rent2Reuse application.",
      facts: [
        { label: "Platform", value: "Mobile application (React Native / Expo)" },
        { label: "Design tool", value: "Figma" },
        { label: "Architecture", value: "REST API & Mobile Client" },
        { label: "Primary focus", value: "Rental, lending, and item discovery flows" },
      ],
      sections: [
        {
          eyebrow: "01 · Introduction",
          title: "A clear start to community reuse",
          description:
            "The onboarding sequence introduces search, lending, and community value through a focused message on each screen.",
          images: [
            "/assets/rent2reuse/1.png",
            "/assets/rent2reuse/2.png",
            "/assets/rent2reuse/3.png",
          ],
        },
        {
          eyebrow: "02 · Account access",
          title: "Simple entry and recovery flows",
          description:
            "Login, password recovery, and account creation use consistent fields, actions, spacing, and status cues.",
          images: [
            "/assets/rent2reuse/4.png",
            "/assets/rent2reuse/5.png",
            "/assets/rent2reuse/6.png",
          ],
        },
        {
          eyebrow: "03 · Rental details",
          title: "Decisions presented one step at time",
          description:
            "Time, payment, and date selection screens break important rental decisions into direct, readable steps.",
          images: [
            "/assets/rent2reuse/7.png",
            "/assets/rent2reuse/8.png",
            "/assets/rent2reuse/9.png",
          ],
        },
      ],
    },
  },
  {
    title: "Interactive Scene Engine & Portfolio",
    blurb:
      "A custom 2.5D interactive developer portfolio and diorama engine featuring multi-layer spatial rendering, transparent-pixel hit testing, audio-reactive interactions, and an embedded minigame modal.",
    contribution:
      "Architect and Developer — designed the behavioral event bus, custom scene engine, alpha test hit pipeline, asset preload gate, and responsive layouts.",
    tags: ["React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Vite"],
    art: "Interactive portfolio diorama and scene engine preview",
    cover: "/assets/og-preview.png",
    externalLink: {
      label: "View on GitHub",
      href: "https://github.com/ezykl",
    },
    tools: [
      { label: "React", icon: "react", usage: "Primary" },
      { label: "TypeScript", icon: "typescript", usage: "Primary" },
      { label: "Tailwind", icon: "tailwindcss", usage: "Primary" },
      { label: "Vite", icon: "vitejs", usage: "Supporting" },
    ],
  },
];

const SECTION_INTRO = {
  eyebrow: "// 01. FEATURED WORK",
  title: "Featured Projects",
  blurb:
    "Production-grade mobile and web applications built with modern frameworks, thoughtful architecture, and obsessive attention to detail.",
};

const TagChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-full border border-zyk-primary/30 bg-zyk-primary/15 px-3 py-1 font-body text-xs font-medium text-indigo-200">
    {children}
  </span>
);

const ProjectText: React.FC<{
  project: Project;
  index: number;
  total: number;
  onOpenFlipbook?: () => void;
  onOpenImagePreview?: (project: Project) => void;
}> = ({ project, index, total, onOpenFlipbook, onOpenImagePreview }) => (
  <>
    <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold">
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
    <h3 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
      {project.title}
    </h3>
    <p className="mt-3 font-body text-base leading-relaxed text-slate-300">
      {project.blurb}
    </p>
    {project.contribution && (
      <p className="mt-3 border-l-2 border-zyk-accent/70 pl-3 font-body text-sm leading-relaxed text-slate-300">
        <span className="font-semibold text-white">My role:</span>{" "}
        {project.contribution}
      </p>
    )}
    <div className="mt-4 flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <TagChip key={tag}>{tag}</TagChip>
      ))}
    </div>
    {project.tools && (
      <div className="mt-4">
        <p className="font-display text-xs uppercase tracking-[0.18em] text-slate-400 font-medium">
          Design tools
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-xs font-medium text-slate-200 shadow-sm"
            >
              <TechIcon name={tool.icon} className="h-4 w-4 shrink-0" />
              {tool.label}
              <span className="text-zyk-accent font-medium">· {tool.usage}</span>
            </span>
          ))}
        </div>
      </div>
    )}
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={
          project.flipbook
            ? onOpenFlipbook
            : () => onOpenImagePreview?.(project)
        }
        className="inline-flex items-center gap-2 rounded-full bg-zyk-primary px-5 py-2.5 font-display text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zyk-accent"
      >
        <span>{project.flipbook ? "Open Flipbook" : "View Project"}</span>
        <span aria-hidden="true" className="font-bold">&rarr;</span>
      </button>
      {project.href && (
        <a
          href={project.href}
          className="inline-flex w-fit items-center gap-1 font-display text-sm font-semibold text-zyk-accent transition-colors hover:text-white"
        >
          View project &rarr;
        </a>
      )}
    </div>
  </>
);

const ProjectVisual: React.FC<{
  project: Project;
  className?: string;
  onOpenFlipbook?: () => void;
  onOpenImagePreview?: (project: Project) => void;
}> = ({ project, className = "", onOpenFlipbook, onOpenImagePreview }) => {
  const previewImages =
    project.imagePreview && !project.stackedCover
      ? project.cover
        ? [project.cover]
        : []
      : [
          ...(project.previewPages ?? []),
          ...(project.cover ? [project.cover] : []),
        ];

  return project.cover && (project.flipbook || project.imagePreview) ? (
    <button
      type="button"
      onClick={
        project.flipbook ? onOpenFlipbook : () => onOpenImagePreview?.(project)
      }
      aria-label={`Open ${project.title} ${project.flipbook ? "flipbook" : "project preview"}`}
      className={`group relative block w-full overflow-visible text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zyk-accent ${className}`}
    >
      {previewImages.map((previewPage, index, pages) => (
        <img
          key={previewPage}
          src={previewPage}
          alt={index === pages.length - 1 ? project.art : ""}
          aria-hidden={index !== pages.length - 1}
          loading="lazy"
          decoding="async"
          className={`absolute left-1/2 top-1/2 object-contain transition duration-300 group-hover:blur-[2px] ${
            project.roundedCover ? "rounded-2xl" : "rounded-sm"
          } ${project.coverShadow === false ? "" : "shadow-xl"} ${
            project.imagePreview && !project.stackedCover
              ? "h-auto max-h-full w-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[1.01]"
              : project.comparisonCover
                ? [
                    "h-auto max-h-none w-[76%] -translate-x-[58%] -translate-y-[62%] -rotate-[2deg] group-hover:-translate-x-[61%] group-hover:-translate-y-[64%]",
                    "h-auto max-h-none w-[84%] -translate-x-[42%] -translate-y-[38%] rotate-[2deg] group-hover:-translate-x-[39%] group-hover:-translate-y-[36%]",
                  ][index]
                : `h-[82%] w-auto ${
                    (project.roundedCover
                      ? [
                          "-translate-x-[110%] -translate-y-[46%] -rotate-[3deg] group-hover:-translate-x-[118%]",
                          "-translate-x-[68%] -translate-y-[52%] -rotate-[1deg] group-hover:-translate-x-[72%]",
                          "-translate-x-[26%] -translate-y-[52%] rotate-[1deg] group-hover:-translate-x-[22%]",
                          "translate-x-[16%] -translate-y-[46%] rotate-[3deg] group-hover:translate-x-[24%]",
                        ]
                      : [
                          "-translate-x-[76%] -translate-y-[47%] -rotate-[9deg] group-hover:-translate-x-[82%]",
                          "-translate-x-[62%] -translate-y-[53%] -rotate-[3deg] group-hover:-translate-y-[56%]",
                          "-translate-x-[38%] -translate-y-[51%] rotate-[4deg] group-hover:-translate-x-[34%]",
                          "-translate-x-[24%] -translate-y-[46%] rotate-[10deg] group-hover:-translate-x-[18%]",
                        ])[index]
                  }`
          }`}
        />
      ))}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-900/90 px-5 py-2.5 font-display text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
          <span>{project.flipbook ? "Open Flipbook" : "View Project"}</span>
          <span aria-hidden="true" className="text-zyk-accent font-bold">&rarr;</span>
        </span>
      </span>
    </button>
  ) : project.cover ? (
    <div
      className={`overflow-hidden rounded-3xl bg-zyk-accent/10 shadow-md ${className}`}
    >
      <img
        src={project.cover}
        alt={project.art}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </div>
  ) : (
    <Placeholder label={project.art} aspect="4 / 3" className={className} />
  );
};

/** Plain, non-sticky fallback for prefers-reduced-motion — same content, no scroll-driven pinning. */
const ProjectsStaticList: React.FC<{
  onOpenFlipbook: () => void;
  onOpenImagePreview: (project: Project) => void;
}> = ({ onOpenFlipbook, onOpenImagePreview }) => (
  <>
    <div className="max-w-2xl">
      <p className="font-display text-sm uppercase tracking-widest text-zyk-accent font-semibold">
        {SECTION_INTRO.eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
        {SECTION_INTRO.title}
      </h2>
      <p className="mt-4 font-body text-lg leading-relaxed text-slate-300">
        {SECTION_INTRO.blurb}
      </p>
    </div>
    <div className="mt-12 flex flex-col gap-8">
      {PROJECTS.map((project, i) => (
        <div
          key={project.title}
          className="grid gap-8 rounded-3xl border border-zyk-accent/10 bg-white/5 p-6 shadow-md md:grid-cols-2 md:items-center"
        >
          <ProjectVisual
            project={project}
            className="aspect-4/3"
            onOpenFlipbook={onOpenFlipbook}
            onOpenImagePreview={onOpenImagePreview}
          />
          <div>
            <ProjectText
              project={project}
              index={i}
              total={PROJECTS.length}
              onOpenFlipbook={onOpenFlipbook}
              onOpenImagePreview={onOpenImagePreview}
            />
          </div>
        </div>
      ))}
    </div>
  </>
);
interface OtherProject {
  title: string;
  blurb: string;
  tags: string[];
  github?: string;
  external?: string;
}

const OTHER_PROJECTS: OtherProject[] = [
  {
    title: "Subscription Manager UI & Flow",
    blurb:
      "Cross-platform personal finance mobile concept for tracking recurring services, payment schedules, and monthly spending insights.",
    tags: ["React Native", "Figma", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/ezykl",
  },
  {
    title: "RESTful Task & Operations API",
    blurb:
      "Backend microservice implementing JWT authentication, role-based access control, relational database schema, and test-driven endpoints.",
    tags: ["Node.js", "Express", "REST APIs", "MySQL"],
    github: "https://github.com/ezykl",
  },
  {
    title: "Dataset Quality & Annotation Tooling",
    blurb:
      "Automation scripts and inspection utilities for image/video dataset validation, discrepancy logging, and quality assurance auditing.",
    tags: ["Python", "Data QA", "CLI", "Automation"],
    github: "https://github.com/ezykl",
  },
  {
    title: "GDSC Student Tech Event Platform",
    blurb:
      "Event portal for university student developer communities featuring workshop schedules, participant check-ins, and hackathon showcases.",
    tags: ["React", "Next.js", "Firebase", "TypeScript"],
    github: "https://github.com/ezykl",
  },
];

const OtherProjectsGrid: React.FC = () => (
  <div className="mt-28 border-t border-slate-800/80 pt-20">
    <div className="max-w-2xl">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent font-semibold">
        // 02. OTHER BUILDS
      </p>
      <h3 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
        Noteworthy Projects
      </h3>
      <p className="mt-3 font-body text-base leading-relaxed text-slate-300">
        A curated selection of applications, backend services, tooling, and developer experiments.
      </p>
    </div>

    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {OTHER_PROJECTS.map((project) => (
        <article
          key={project.title}
          className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zyk-accent/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]"
        >
          <div>
            <div className="flex items-center justify-between">
              {/* Folder / Terminal Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zyk-accent/20 bg-zyk-accent/10 text-zyk-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 text-slate-400">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} on GitHub`}
                    className="transition-colors hover:text-zyk-accent"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} live demo`}
                    className="transition-colors hover:text-zyk-accent"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <h4 className="mt-5 font-display text-xl font-bold text-white transition-colors group-hover:text-zyk-accent">
              {project.title}
            </h4>

            <p className="mt-2.5 font-body text-sm leading-relaxed text-slate-300">
              {project.blurb}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-display text-[0.7rem] font-medium text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  </div>
);

export const ProjectsSection: React.FC = () => {
  const reduce = useReducedMotion() ?? false;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipbookOpen, setFlipbookOpen] = useState(false);
  const [imagePreviewProject, setImagePreviewProject] =
    useState<Project | null>(null);

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
        <ProjectsStaticList
          onOpenFlipbook={() => setFlipbookOpen(true)}
          onOpenImagePreview={setImagePreviewProject}
        />
      ) : (
        <>
          {/* Mobile: the pinned-image mechanic needs a tall scrolling column
              to work at all; without it (sticky is md+ only, below), the same
              spacing just becomes dead blank gaps. Reuse the compact static
              list instead — same content, no pin. */}
          <div className="md:hidden">
            <ProjectsStaticList
              onOpenFlipbook={() => setFlipbookOpen(true)}
              onOpenImagePreview={setImagePreviewProject}
            />
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
              <p className="mt-4 font-display text-sm uppercase tracking-widest text-zyk-accent font-semibold">
                {SECTION_INTRO.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
                {SECTION_INTRO.title}
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-slate-300">
                {SECTION_INTRO.blurb}
              </p>

              <div className="relative mt-8 aspect-6/5 w-full">
                <AnimatePresence>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <ProjectVisual
                      project={PROJECTS[activeIndex]}
                      className="h-full"
                      onOpenFlipbook={() => setFlipbookOpen(true)}
                      onOpenImagePreview={setImagePreviewProject}
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
                    onOpenFlipbook={() => setFlipbookOpen(true)}
                    onOpenImagePreview={setImagePreviewProject}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Other Noteworthy Projects / Builds Grid */}
      <OtherProjectsGrid />

      <SchoolPaperFlipbook
        open={flipbookOpen}
        onClose={() => setFlipbookOpen(false)}
      />
      <ImageProjectPreview
        open={imagePreviewProject !== null}
        title={imagePreviewProject?.title ?? "Project preview"}
        images={imagePreviewProject?.galleryImages ?? []}
        videos={imagePreviewProject?.galleryVideos ?? []}
        imageAlt={imagePreviewProject?.art ?? "Project design"}
        externalLink={imagePreviewProject?.externalLink}
        caseStudy={imagePreviewProject?.caseStudy}
        context={imagePreviewProject?.previewContext}
        onClose={() => setImagePreviewProject(null)}
      />
    </section>
  );
};
