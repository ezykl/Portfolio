import React from "react";
import { motion } from "framer-motion";
import { ZykCoding } from "../ZykCoding/ZykCoding";
import { PillButton } from "../ui/PillButton";
import { PopupHost } from "../Popup/PopupHost";
import { MinigameHost } from "../Minigame/MinigameHost";

interface HeroProps {
  /** True once the loading screen has revealed the page. Kept for API
   *  stability; not currently used for gating. */
  revealed?: boolean;
}

/**
 * Hero — the landing chapter. A compact self-intro (heading, tagline, two CTA
 * pills) above the animated ZykCoding workspace scene.
 *
 * This iteration intentionally hides the full composited AllScene diorama
 * (OutsideScene + RoomScene + wooden frame + music/light toggles) — ZykCoding
 * stands in as the hero visual. Those scene components still exist and can be
 * re-composed here later. The optional exploration mini-game and the custom
 * cursor were also removed for now. Planned next: left-to-right overlay of
 * popping/floating tech elements around ZykCoding, and a click-to-open
 * popup/message on ZykCoding.
 */
export const Hero: React.FC<HeroProps> = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-start overflow-hidden pt-24 md:pt-16 bg-linear-to-b from-[#f2bf83] to-[#fef5eb]"
      style={{ scrollMarginTop: "var(--nav-height, 5rem)" }}
    >
      <div className="flex flex-col w-full max-w-350 px-6 sm:px-10 md:px-20">
        {/* Self-intro (§3): heading + tagline + two CTA pills. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full flex-col items-center text-center mt-4 -mb-6 sm:mt-8 sm:-mb-10 md:mt-10 md:-mb-12"
        >
          <h1
            className="font-display leading-tight text-zyk-heading"
            style={{ fontSize: "clamp(3rem, 2rem + 4vw, 6rem)" }}
          >
            Hi, I&apos;m Zyk.
          </h1>
          <p
            className="mt-3 font-medium text-zyk-accent"
            style={{ fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.5rem)" }}
          >
            Software Developer &amp; Graphic Artist
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <PillButton variant="primary" href="#projects">
              View Projects
            </PillButton>
            <PillButton variant="secondary" href="#contact">
              Get in Touch
            </PillButton>
          </div>
        </motion.div>

        {/* ZykCoding workspace — the hero visual for this iteration. Always
            below the text, full width, grows with the viewport. */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-0 mx-auto w-full max-w-295 mt-6 md:mt-8"
        >
          <ZykCoding />
        </motion.div>
      </div>

      {/* Renders the click-to-open message popup for any scene layer that
          carries the `popup` behavior (e.g. clicking "me" in ZykCoding). */}
      <PopupHost />

      {/* The AllScene find-the-object mini-game, opened by the notebook's
          `openMinigame` behavior. */}
      <MinigameHost />
    </section>
  );
};
