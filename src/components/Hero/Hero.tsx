import React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

const ROLES = [
  "Full-Stack Developer",
  "Mobile App Developer",
  "Frontend Developer",
];

// How long the self-intro holds at the "popped in" spot before it slides up
// to its resting position.
const READ_DELAY_MS = 1000;

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

const topBlobVariants = {
  hidden: { x: "90vw", opacity: 0 },
  pop: { x: "90vw", opacity: 1 },
  settled: {
    x: "10vw",
    opacity: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const bottomBlobVariants = {
  hidden: { x: "10vw", opacity: 0 },
  pop: { x: "10vw", opacity: 1 },
  settled: {
    x: "90vw",
    opacity: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const detailItemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 18 },
  },
};

const buttonVariants = {
  ...detailItemVariants,
  visible: {
    ...detailItemVariants.visible,
    transition: { type: "spring", stiffness: 280, damping: 18, delay: 0.18 },
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
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = React.useState<TextPhase>("hidden");
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [typewriterActive, setTypewriterActive] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 20]);

  React.useEffect(() => {
    if (!revealed) {
      setPhase("hidden");
      setDetailsVisible(false);
      setTypewriterActive(false);
      return;
    }
    if (reduce) {
      // Skip the pop + slide for reduced motion — show everything immediately.
      setPhase("settled");
      setDetailsVisible(true);
      setTypewriterActive(true);
      return;
    }
    setPhase("pop"); // loading just finished — pop in
  }, [revealed, reduce]);

  // Keep the supporting content hidden while the H1 pops in and settles.
  React.useEffect(() => {
    if (phase !== "pop" || reduce) return;
    const timer = window.setTimeout(() => setPhase("settled"), READ_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reduce]);

  const role = useTypewriterCycle(ROLES, { active: typewriterActive });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex flex-col items-center justify-start pt-24 md:pt-16 overflow-hidden"
      style={{
        backgroundColor: "#020617",
        backgroundImage: [
          "repeating-linear-gradient(0deg, rgba(148,163,184,0.05) 0px, rgba(148,163,184,0.05) 1px, transparent 1px, transparent 24px)",
          "repeating-linear-gradient(90deg, rgba(148,163,184,0.05) 0px, rgba(148,163,184,0.05) 1px, transparent 1px, transparent 24px)",
        ].join(", "),
        scrollMarginTop: "var(--nav-height, 5rem)",
      }}
    >
      {/* Background Animated Gradient Blobs:
          Reversed start on reveal (Top at Right, Bottom at Left matching loading screen),
          animating smoothly into final corner placements (Top-Left & Bottom-Right)
          as 'Hi, I'm Zyk' settles. */}
      {/* Background Animated Gradient Blobs:
          Replicates the exact size, radius, and color profile of the LoadingScreen.
          Starts at reversed positions on reveal (Top at 90vw, Bottom at 10vw),
          animating smoothly into final placements (Top at 10vw, Bottom at 90vw)
          as 'Hi, I'm Zyk' settles. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top Blob (Indigo/Violet) */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <motion.div
            variants={topBlobVariants}
            initial="hidden"
            animate={reduce ? "settled" : phase}
          >
            <div
              className="-translate-x-1/2 -translate-y-1/2 h-[84vw] w-[84vw] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* Bottom Blob (Cyan/Teal) */}
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <motion.div
            variants={bottomBlobVariants}
            initial="hidden"
            animate={reduce ? "settled" : phase}
          >
            <div
              className="-translate-x-1/2 translate-y-1/2 h-[96vw] w-[96vw] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col w-full max-w-350 px-6 sm:px-10 md:px-20">
        {/* Parallax wrapper giving text a subtle organic scroll delay relative to ZykCoding */}
        <motion.div
          style={{ y: textParallaxY }}
          className="flex w-full flex-col items-center text-center"
        >
          {/* H1 entrance: invisible while loading, pops in once revealed, holds,
              then slides up to its resting position. */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate={phase}
            onAnimationComplete={(definition) => {
              if (definition === "settled") {
                setDetailsVisible(true);
                setTypewriterActive(true);
              }
            }}
            className="flex w-full flex-col items-center text-center mt-4 -mb-6 sm:mt-8 sm:-mb-10 md:mt-10 md:-mb-12"
          >
            <h1
              className="font-display leading-tight text-zyk-heading font-bold"
              style={{ fontSize: "clamp(3rem, 2rem + 4vw, 6rem)" }}
            >
              Hi, I&apos;m Zyk.
            </h1>
          </motion.div>

          {/* After the H1 reaches its fixed position, pop in the role first and
              the buttons just after it. */}
          <div className="flex w-full flex-col items-center text-center mt-6 sm:mt-10 md:mt-12">
            <motion.p
              variants={detailItemVariants}
              initial="hidden"
              animate={detailsVisible ? "visible" : "hidden"}
              className="mt-3 font-medium text-zyk-accent"
              style={{ fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.5rem)" }}
            >
              {reduce ? (
                "Full-Stack Developer"
              ) : (
                <>
                  {role}
                  <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-zyk-accent animate-pulse" />
                </>
              )}
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate={detailsVisible ? "visible" : "hidden"}
              className="mt-6 flex flex-wrap items-center justify-center gap-4"
            >
              <PillButton variant="primary" href="#projects">
                View My Work
              </PillButton>
              <PillButton variant="secondary" href="#contact">
                Get in Touch
              </PillButton>
            </motion.div>
          </div>
        </motion.div>

        {/* ZykCoding workspace. This outer box is a plain, unanimated element
            sized by ZykCoding's own natural layout height — its rendered size
            never changes, so the Hero (and the whole page's height) stays
            constant throughout the intro; only the content inside animates.
            The inner motion.div is what actually moves (translateY + opacity),
            clipped by this box's `overflow-hidden`, so it reads as rising up
            into view against a backdrop that's already fully in place. */}
        <div className="relative z-0 mx-auto w-full max-w-270 mr-10 overflow-hidden ">
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
