import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OutsideScene } from "../OutsideScene/OutsideScene";
import { RoomScene } from "../RoomScene/RoomScene";
import { ZykCoding } from "../ZykCoding/ZykCoding";
import { WelcomeOverlay } from "../WelcomeOverlay/WelcomeOverlay";
import { Toggle } from "../Toggle/Toggle";
import {
  IconSunHigh,
  IconMoonStars,
  IconMusic,
  IconMusicOff,
} from "@tabler/icons-react";
import { SceneGlowProvider } from "../../engine";

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

  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;
    if (musicOn) audio.play().catch(() => {});
    else audio.pause();
  }, [musicOn]);

  return (
    <section className=" flex flex-col items-center  text-center min-h-screen border-2 border-yellow-300 overflow-hidden">
      {/* <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1> */}
      <div
        className=" w-full mx-auto relative"
        style={{
          minWidth: "800px",
          maxWidth: "1400px",
          // 16:9 aspect ratio – height will be calculated automatically
          aspectRatio: "16 / 9", // height scales with width
        }}
      >
        {/*
          The border image is rendered at the full, unmodified size of this
          box (no offset hacks) — its own frame artwork already spans edge
          to edge. To get the picture-frame "straddle" look (the frame's
          wood band overlapping the scene's edge on both sides), the scene
          content is inset into a smaller box instead of enlarging the
          border image — enlarging it would risk getting clipped by an
          ancestor's overflow.

          The inset amounts (0.72% sides, 1.28% top/bottom) come from
          measuring 16x9_border.png's actual alpha channel: it has a ~10px
          transparent margin before the wood band starts, and the band
          itself is ~51-52px thick (on its 5000x2813 canvas). Half that
          band's centerline sits at ~36px in from the image edge on every
          side — 36/5000 horizontally, 36/2813 vertically. Re-measure if
          the border asset is ever replaced.
        */}
        <div
          style={{
            position: "absolute",
            top: "1.28%",
            bottom: "1.28%",
            left: "0.72%",
            right: "0.72%",
            overflow: "hidden",
            borderRadius: "20px",
          }}
        >
          {/*
            Outside/Room/ZykCoding are three separate SceneEngine instances,
            but visually they overlap into what reads as one composited
            scene — so clickGlow exclusivity needs to span all three, not
            reset at each scene's own boundary. This one shared provider is
            what each scene's own (nesting-safe) SceneGlowProvider defers to
            instead of creating its own independent glow state.
          */}
          <SceneGlowProvider>
            {/* Position each scene as needed – each wrapped with absolute positioning */}
            <div
              style={{
                position: "absolute",
                width: "55%",
                height: "auto",
                top: "20%",
                left: 30,
              }}
            >
              <OutsideScene />
            </div>
            {/* Adjust the inline styles below for RoomScene and ZykCoding as needed */}
            <div
              style={{
                position: "absolute",
                left: -4,
                top: -1,
                width: "102%",
                height: "auto",
              }}
            >
              <RoomScene />
            </div>

            <motion.div
              style={{
                position: "absolute",

                width: "80%",
                height: "auto",
                bottom: 0,
                right: -50,
              }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ZykCoding />
            </motion.div>

            <WelcomeOverlay show={Boolean(revealed)} />
          </SceneGlowProvider>
        </div>

        {/* Decorative frame over the whole 16:9 box — matches the asset's own
            aspect ratio exactly, so plain `fill` doesn't distort it, and
            renders at this box's full, unclipped size (see inset comment
            above for why the scene content shrinks instead of this growing). */}
        <img
          src="/assets/ui/16x9_border.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 60,
          }}
        />

        {/* HUD controls — sit above the frame (zIndex 60) since they're
            real controls, not scene decoration. */}
        <div
          style={{
            position: "absolute",
            top: "3%",
            right: "2%",
            zIndex: 70,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* <Toggle
            checked={lightOn}
            onChange={setLightOn}
            icon={
              lightOn ? (
                <IconMoonStars size="60%" color={ICON_GOLD} />
              ) : (
                <IconSunHigh size="60%" color={ICON_NEUTRAL} />
              )
            }
            label="Toggle light"
            stateText={lightOn ? "Night" : "Day"}
            knobTint={lightOn ? TINT_NIGHT : TINT_DAY}
          /> */}
          <Toggle
            checked={musicOn}
            onChange={setMusicOn}
            icon={
              musicOn ? (
                <IconMusic size="60%" color={ICON_GOLD} />
              ) : (
                <IconMusicOff size="60%" color={ICON_NEUTRAL} />
              )
            }
            label="Toggle background music"
            stateText={musicOn ? "Music" : "Mute"}
            knobTint={musicOn ? TINT_PLAYING : TINT_MUTED}
          />
        </div>

        <audio ref={bgAudioRef} loop preload="none">
          <source src={encodeURI("/assets/music/komii - downtown.mp3")} />
        </audio>
      </div>
    </section>
  );
};
