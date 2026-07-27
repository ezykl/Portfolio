import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OutsideScene } from "../OutsideScene/OutsideScene";
import { RoomScene } from "../RoomScene/RoomScene";
import { ZykCoding } from "../ZykCoding/ZykCoding";
import { WelcomeOverlay } from "../WelcomeOverlay/WelcomeOverlay";
import { Toggle } from "../Toggle/Toggle";
import { CustomCursor } from "../CustomCursor/CustomCursor";

import {
  IconSunHigh,
  IconMoonStars,
  IconMusic,
  IconMusicOff,
} from "@tabler/icons-react";
import { SceneGlowProvider } from "../../engine";
import { PillButton } from "../ui/PillButton";

// Matches the warm-gold accent already used for clickGlow elsewhere in the
// app, so an "on" icon reads as the same kind of "lit up" as those assets.
const ICON_GOLD = "#3a2b22";
const ICON_NEUTRAL = "#3a2b22";

// Tints blended onto the knob's own wood texture per state — a second,
// more prominent state cue alongside the icon and text.
const TINT_DAY = "#ffb347"; // warm sunlight
const TINT_NIGHT = "#3b4a8f"; // deep night-sky indigo
const TINT_MUTED = "#8a8a8a"; // neutral gray
const TINT_PLAYING = "#f0a83c"; // warm gold, matches clickGlow's accent

interface HeroProps {
  revealed?: boolean;
}

/**
 * Hero section for the portfolio.
 * Displays a heading and the extracted Framer component (`Me`).
 */
export const Hero: React.FC<HeroProps> = ({ revealed }) => {
  // Off by default — background music only ever starts from an explicit
  // click on the Music toggle, so there's no autoplay-policy fight either.
  const [musicOn, setMusicOn] = useState(false);
  // Not wired to any effect yet — no lighting effect has been built. Ready
  // for whatever "Light" ends up controlling once that's specified.
  const [lightOn, setLightOn] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  // Tracks the whole Hero box (scene + border + HUD), not just the scene
  // content, so the custom cursor also applies over the toggle controls.
  const cursorAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;
    if (musicOn) audio.play().catch(() => {});
    else audio.pause();
  }, [musicOn]);

  return (
    <section
      id="home"
      className=" flex flex-col items-center justify-start overflow-hidden  pt-24 md:pt-16 bg-linear-to-b from-[#f2bf83] to-[#fef5eb]"
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="flex flex-col w-full max-w-350 px-6 sm:px-10 md:px-20">
        {/* Text content */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full flex-col items-center text-center mt-8 -mb-8 sm:mt-14 sm:-mb-14 md:mt-20 md:-mb-20"
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
        {/* Zyk coding image — always below text, full width, grows with viewport */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-0 w-full  lg:ml-10 mt-8 md:mt-12"
        >
          <ZykCoding />
        </motion.div>
      </div>
    </section>
  );
};
