import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  animate,
} from "framer-motion";
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

  // Scroll parallax: maps actual page scroll pixels (0 to 500px) directly
  // to a noticeable vertical float for the intro text.
  // • Positive number (e.g. 150): text floats downward / delays behind scroll
  // • Negative number (e.g. -150): text exits upward faster
  // • 0: disabled (scrolls 1:1 with normal page scroll)
  const { scrollY } = useScroll();
  const textParallaxY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 220]);

  // Background Blobs Reverse Placement X sliding animation:
  // Starts at LoadingScreen placement: Top at 90% (right), Bottom at 10% (left).
  // When Hero is revealed ("when Hi I'm Zyk shows"), smoothly glides across the X axis
  // to the final settled placement: Top at 10% (left), Bottom at 90% (right).
  // Zero heartbeat beating pulse in Hero section as requested.
  const topBlobX = useMotionValue(90);
  const bottomBlobX = useMotionValue(10);

  React.useEffect(() => {
    if (!revealed) {
      topBlobX.set(90);
      bottomBlobX.set(10);
      return;
    }
    if (reduce) {
      topBlobX.set(10);
      bottomBlobX.set(90);
      return;
    }
    const animTop = animate(topBlobX, 10, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    const animBottom = animate(bottomBlobX, 90, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      animTop.stop();
      animBottom.stop();
    };
  }, [revealed, reduce, topBlobX, bottomBlobX]);

  const blobBackground = useMotionTemplate`radial-gradient(circle at ${topBlobX}% 0%, rgba(99,102,241,0.20), transparent 42%), radial-gradient(circle at ${bottomBlobX}% 100%, rgba(34,211,238,0.16), transparent 48%)`;

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
          Exact 1:1 match with LoadingScreen properties (colors, spread percentages, zero-blur).
          Spans the full Hero section (inset-0 w-full h-full) so the bottom blob seamlessly
          covers the lower part and ZykCoding without any cut-off line when scrolling.
          Reverse placement X animation: starts at 90% (top) / 10% (bottom) and glides smoothly
          to 10% (top) / 90% (bottom) as Hero reveals. Steady opacity (no beating). */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: blobBackground,
          }}
        />
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
