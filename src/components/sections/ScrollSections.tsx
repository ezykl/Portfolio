import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PillButton } from "../ui/PillButton";

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

interface SectionScaffoldProps {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
}

const SectionScaffold: React.FC<SectionScaffoldProps> = ({
  id,
  eyebrow,
  title,
  blurb,
}) => {
  const reveal = useReveal();
  return (
    <section
      id={id}
      style={{ scrollMarginTop: "5rem" }}
      className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-6 py-24"
    >
      <motion.div {...reveal}>
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-zyk-brown/80">
          {blurb}
        </p>
      </motion.div>
    </section>
  );
};

export const DesignsSection: React.FC = () => (
  <SectionScaffold
    id="designs"
    eyebrow="Things I've drawn"
    title="Designs"
    blurb="Art, Figma work, and visual design pieces will live here — coming soon."
  />
);

export const JourneySection: React.FC = () => (
  <SectionScaffold
    id="journey"
    eyebrow="The path so far"
    title="Journey"
    blurb="The story of how I got here — experience, leadership, communities (GDSC), and education, told as a walk through the world rather than a résumé. Coming soon."
  />
);

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
        <h2 className="font-display text-4xl md:text-5xl">Let&apos;s work together.</h2>
        <p className="mx-auto mt-3 max-w-md font-body text-lg text-zyk-bg-end/80">
          Open to roles and freelance. If the diorama made you smile, let&apos;s talk.
        </p>
        <div className="mt-8 flex justify-center">
          <PillButton variant="secondary" href="mailto:hello@example.com">
            Get in Touch
          </PillButton>
        </div>
      </motion.div>
    </footer>
  );
};
