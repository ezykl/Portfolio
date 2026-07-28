import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContactForm } from "../Contact/ContactForm";
import { ContactLinks } from "../Contact/ContactLinks";
import { Placeholder } from "../ui/Placeholder";

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

interface JourneyStep {
  title: string;
  blurb: string;
  detail: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "Curiosity first",
    blurb:
      "I started by making things that felt alive — sketches, interfaces, and small interactions that invited people to explore.",
    detail: "That curiosity became the root of how I build today.",
  },
  {
    title: "Design meets code",
    blurb:
      "I learned to bridge visuals and systems so the experience feels as good as it looks.",
    detail:
      "React, motion, and thoughtful UI became my language for storytelling.",
  },
  {
    title: "Community and craft",
    blurb:
      "Leadership, events, and teaching helped me sharpen my voice and share what I was building with others.",
    detail:
      "GDSC and creative collaborations shaped the way I think about impact.",
  },
  {
    title: "Still becoming",
    blurb:
      "I’m drawn to work that feels handcrafted, playful, and memorable — the kind of work that leaves a feeling behind.",
    detail: "The portfolio itself is part of that evolving practice.",
  },
];

export const JourneySection: React.FC = () => {
  const reveal = useReveal();
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="journey"
      style={{ scrollMarginTop: "5rem" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <motion.div {...reveal} className="max-w-3xl">
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          The path so far
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          Journey
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
          My work has always sat at the edge of making and meaning — design,
          code, motion, and story all shaping the same creative practice.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
          }}
          className="rounded-[2rem] border border-zyk-brown/10 bg-zyk-bg-end/80 p-6 shadow-md"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {JOURNEY_STEPS.map((step) => (
              <motion.article
                key={step.title}
                variants={{
                  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: "easeOut" },
                  },
                }}
                className="rounded-2xl border border-zyk-brown/10 bg-white/60 p-4"
              >
                <p className="font-display text-lg text-zyk-heading">
                  {step.title}
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-zyk-brown/80">
                  {step.blurb}
                </p>
                <p className="mt-3 font-body text-xs uppercase tracking-[0.2em] text-zyk-accent">
                  {step.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="flex flex-col gap-4">
          <Placeholder
            label="A winding illustrated path from sketchbook to interface, with little paper tags for community, learning, and craft"
            aspect="4 / 3"
          />
          <div className="rounded-[2rem] border border-zyk-brown/10 bg-zyk-secondary/25 p-5 shadow-sm">
            <p className="font-display text-lg text-zyk-heading">
              Tools I keep reaching for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Figma",
                "Framer Motion",
                "Tailwind",
                "Vite",
              ].map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-zyk-bg-end/70 px-3 py-1 font-body text-xs font-medium text-zyk-brown/80"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/** Contact / footer — the §2b brown footer band with a hire-me call to action. */
export const ContactSection: React.FC = () => {
  const reveal = useReveal();
  return (
    <footer
      id="contact"
      style={{ scrollMarginTop: "5rem" }}
      className="mt-12 bg-zyk-brown px-6 py-20 text-center text-zyk-bg-end"
    >
      <motion.div {...reveal} className="mx-auto max-w-2xl">
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
    </footer>
  );
};
