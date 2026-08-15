import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ZykCoding } from "../ZykCoding/ZykCoding";
import { PillButton } from "../ui/PillButton";
import { PopupHost } from "../Popup/PopupHost";
import { MinigameHost } from "../Minigame/MinigameHost";
import { useTypewriterCycle } from "../../hook/useTypewriterCycle";

interface HeroProps {
  /** True once the loading screen has revealed the page. Gates the entrance
   *  animation below — Hero mounts under the loading overlay, so animating on
   *  mount alone would finish before anyone could see it. */
  revealed?: boolean;
}

const ROLES = ["Software Developer", "Graphic Designer", "Game UI Designer"];

// How long the self-intro holds at the "popped in" spot before it slides up
// to its resting position.
const READ_DELAY_MS = 2000;

type TextPhase = "hidden" | "pop" | "settled";

const textVariants = {
  hidden: { opacity: 0, scale: 0.85, y: "24vh" }, // fully invisible while loading
  pop: {
    opacity: 1,
    scale: 1,
    y: "24vh",
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
  settled: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

/**
 * Hero — the landing chapter. A compact self-intro (heading, tagline, two CTA
 * pills) above the animated ZykCoding workspace scene.
 *
 * Entrance sequence (plays once `revealed` flips true): the intro text is
 * invisible while the loading screen is up, pops into place with a spring
 * once revealed, holds briefly, then eases up into its resting spot — after
 * which the tagline starts cycling through roles via a typewriter loop.
 * ZykCoding rises into view via a transform (translateY + opacity) on an inner
 * wrapper, while its outer box stays a constant size throughout — so the Hero
 * backdrop itself never resizes, only the content animates within it.
 *
 * This iteration intentionally hides the full composited AllScene diorama
 * (OutsideScene + RoomScene + wooden frame + music/light toggles) — ZykCoding
 * stands in as the hero visual. Those scene components still exist and can be
 * re-composed here later. The optional exploration mini-game and the custom
 * cursor were also removed for now. Planned next: left-to-right overlay of
 * popping/floating tech elements around ZykCoding, and a click-to-open
 * popup/message on ZykCoding.
 */
export const Hero: React.FC<HeroProps> = ({ revealed }) => {
  const reduce = useReducedMotion();
  const [phase, setPhase] = React.useState<TextPhase>("hidden");
  const [typewriterActive, setTypewriterActive] = React.useState(false);

  React.useEffect(() => {
    if (!revealed) {
      setPhase("hidden");
      setTypewriterActive(false);
      return;
    }
    if (reduce) {
      // Skip the pop + slide for reduced motion — just appear, then type.
      setPhase("settled");
      setTypewriterActive(true);
      return;
    }
    setPhase("pop"); // loading just finished — pop in
  }, [revealed, reduce]);

  const role = useTypewriterCycle(ROLES, { active: typewriterActive });

  return (
    <section
      id="home"
      // NOTE: `overflow-hidden` removed here — the text block's `hidden`/`pop`
      // states sit at `y: 24vh`, which is past the section's un-transformed
      // layout box; with overflow-hidden still on, that offset content gets
      // clipped instead of shown. ZykCoding's own reveal clipping is handled
      // locally by its own wrapper div below, so this doesn't affect it.
      className="relative flex flex-col items-center justify-start pt-24 md:pt-16 bg-linear-to-b from-[#f2bf83] to-[#fef5eb]"
      style={{ scrollMarginTop: "var(--nav-height, 5rem)" }}
    >
      <div className="flex flex-col w-full max-w-350 px-6 sm:px-10 md:px-20">
        {/* Self-intro (§3): heading + tagline + two CTA pills. Invisible while
            loading, pops in once revealed, holds, then slides up to rest —
            after which the tagline starts cycling roles. Reduced-motion just
            fades in place and starts the role loop immediately. */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate={phase}
          onAnimationComplete={(definition) => {
            if (definition === "pop") {
              setTimeout(() => setPhase("settled"), READ_DELAY_MS);
            }
            if (definition === "settled") {
              setTypewriterActive(true);
            }
          }}
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
            {reduce ? (
              "Software Developer"
            ) : (
              <>
                {role}
                <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-zyk-accent animate-pulse" />
              </>
            )}
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

        {/* ZykCoding workspace. This outer box is a plain, unanimated element
            sized by ZykCoding's own natural layout height — its rendered size
            never changes, so the Hero (and the whole page's height) stays
            constant throughout the intro; only the content inside animates.
            The inner motion.div is what actually moves (translateY + opacity),
            clipped by this box's `overflow-hidden`, so it reads as rising up
            into view against a backdrop that's already fully in place. */}
        <div className="relative z-0 mx-auto w-full max-w-295 overflow-hidden mt-6 md:mt-8">
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }}
            animate={
              revealed
                ? { y: 0, opacity: 1 }
                : reduce
                  ? { opacity: 0 }
                  : { y: "100%", opacity: 0 }
            }
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: revealed && !reduce ? 2 : 0,
            }}
          >
            <ZykCoding />
          </motion.div>
        </div>
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
