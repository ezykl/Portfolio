import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Placeholder } from "../ui/Placeholder";
import { TechIcon, type TechIconName } from "../ui/techIcons";
import {
  ImageProjectPreview,
  type ImageCaseStudy,
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
    title: "School Paper Magazine",
    blurb:
      "A twelve-page editorial publication designed around the client's content, audience, and communication needs, presented here as an interactive digital magazine.",
    contribution:
      "I created the publication's visual design and page layouts. The written and editorial content was supplied by the client.",
    tags: ["Editorial Design", "Publication Layout", "Client Work"],
    art: "School Paper Magazine cover",
    cover: "/assets/school-paper/page-1.png",
    previewPages: [
      "/assets/school-paper/page-4.png",
      "/assets/school-paper/page-3.png",
      "/assets/school-paper/page-2.png",
    ],
    flipbook: true,
    tools: [
      { label: "Adobe InDesign", icon: "indesign", usage: "Primary" },
      { label: "Adobe Photoshop", icon: "photoshop", usage: "Supporting" },
    ],
  },
  {
    title: "Rent2Reuse",
    blurb:
      "A peer-to-peer mobile marketplace designed to help people rent and lend underused items within their community.",
    contribution:
      "I worked as the Full-Stack Developer and UI/UX Designer, shaping the mobile experience and implementing the product.",
    tags: ["Mobile UI/UX", "Product Design", "Marketplace"],
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
    tools: [{ label: "Figma", icon: "figma", usage: "Primary" }],
    caseStudy: {
      eyebrow: "Mobile marketplace · UI/UX case study",
      summary:
        "Rent2Reuse makes it easier for community members to access useful items without buying them, while helping owners give underused tools and equipment a second life.",
      role: "Full-Stack Developer and UI/UX Designer",
      note: "Selected screen sample: this presentation shows only part of the interface, but each design represents an actual frame from the Rent2Reuse application.",
      facts: [
        { label: "Platform", value: "Mobile application" },
        { label: "Design tool", value: "Figma" },
        { label: "Product type", value: "Peer-to-peer marketplace" },
        { label: "Primary focus", value: "Rental and lending flows" },
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
          title: "Decisions presented one step at a time",
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
    title: "Vintage Poster Restoration",
    blurb:
      "Restored more than 1,000 vintage poster images into clean, high-quality digital formats while maintaining a consistent output across a fast-paced production workflow.",
    contribution:
      "Graphics Artist / Photoshop Editor — background removal, perspective correction, blemish repair, generative reconstruction, quality checking, and organized delivery of 100+ images per day.",
    tags: ["Image Restoration", "Photo Retouching", "Production Workflow"],
    art: "Vintage poster restoration before-and-after comparison",
    cover: "/assets/image-restoration/1.png",
    previewPages: ["/assets/image-restoration/2.png"],
    imagePreview: true,
    stackedCover: true,
    comparisonCover: true,
    roundedCover: true,
    galleryImages: [
      "/assets/image-restoration/1.png",
      "/assets/image-restoration/2.png",
    ],
    galleryVideos: [
      "/assets/image-restoration/restore.mp4",
      "/assets/image-restoration/restore2.mp4",
    ],
    tools: [{ label: "Adobe Photoshop", icon: "photoshop", usage: "Primary" }],
  },
];

const SECTION_INTRO = {
  eyebrow: "Design in practice",
  title: "Featured Projects",
  blurb:
    "A focused selection spanning editorial design, mobile UI/UX, and digital image restoration.",
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
  onOpenFlipbook?: () => void;
}> = ({ project, index, total, onOpenFlipbook }) => (
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
    {project.contribution && (
      <p className="mt-3 border-l-2 border-zyk-primary/50 pl-3 font-body text-sm leading-relaxed text-zyk-brown/70">
        <span className="font-semibold text-zyk-heading">My role:</span>{" "}
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
        <p className="font-display text-xs uppercase tracking-[0.18em] text-zyk-brown/55">
          Design tools
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool.label}
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 font-body text-xs font-medium text-zyk-heading shadow-sm"
            >
              <TechIcon name={tool.icon} className="h-4 w-4 shrink-0" />
              {tool.label}
              <span className="text-zyk-accent">· {tool.usage}</span>
            </span>
          ))}
        </div>
      </div>
    )}
    {project.href && (
      <a
        href={project.href}
        className="mt-5 inline-flex w-fit items-center gap-1 font-display text-sm text-zyk-accent transition-colors hover:text-zyk-primary"
      >
        View project &rarr;
      </a>
    )}
    {project.flipbook && (
      <button
        type="button"
        onClick={onOpenFlipbook}
        className="mt-5 inline-flex w-fit items-center gap-1 font-display text-sm text-zyk-accent transition-colors hover:text-zyk-primary"
      >
        Open Flipbook &rarr;
      </button>
    )}
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
          className={`absolute left-1/2 top-1/2 object-contain transition duration-300 ${
            project.roundedCover ? "rounded-2xl" : "rounded-sm"
          } ${project.coverShadow === false ? "" : "shadow-xl"} ${
            project.imagePreview && !project.stackedCover
              ? "h-auto max-h-full w-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[1.01]"
              : project.comparisonCover
                ? `h-auto max-h-[78%] w-[88%] ${
                    [
                      "-translate-x-[56%] -translate-y-[57%] -rotate-[2deg] group-hover:-translate-x-[59%] group-hover:-translate-y-[59%]",
                      "-translate-x-[44%] -translate-y-[43%] rotate-[2deg] group-hover:-translate-x-[41%] group-hover:-translate-y-[41%]",
                    ][index]
                  }`
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
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="rounded-full bg-zyk-bg-end/95 px-5 py-2.5 font-display text-sm text-zyk-heading shadow-lg">
          {project.flipbook ? "Open Flipbook" : "View Project"}
        </span>
      </span>
    </button>
  ) : project.cover ? (
    <div
      className={`overflow-hidden rounded-3xl bg-zyk-brown/10 shadow-md ${className}`}
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
            />
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
              <p className="mt-4 font-display text-sm uppercase tracking-widest text-zyk-accent">
                {SECTION_INTRO.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
                {SECTION_INTRO.title}
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
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
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
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
        onClose={() => setImagePreviewProject(null)}
      />
    </section>
  );
};
