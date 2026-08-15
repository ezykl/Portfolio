import React from "react";
import { SceneEngine, type Scene, type SceneLayer } from "../../engine";

/**
 * ZykCoding – a responsive container that layers all assets from
 * `public/assets/me/` (video + images). The outer div uses the CSS class
 * `zykCoding` for styling.
 *
 * Interactivity is declared per item via `behaviors` (see the engine registry):
 * - `hoverGlow` / `clickGlow` — soft glow on hover; `clickGlow` also makes the
 *   item click-selectable (persistent glow, one lit at a time across all scenes).
 * - `tooltip` (+ a `tooltip` string) — floating label on hover.
 * - `popup` (+ `popup` content) — "me" opens an intro message on click.
 * - `toggle` (+ `toggle` media) — coffee swaps cold png �� ⇄ hot webm (steam).
 * - `openMinigame` — the notebook opens the AllScene find-the-object game.
 * Add/adjust behaviors on any entry below — nothing in InteractiveLayer or the
 * renderer needs to change.
 */
export const zykCodingItems: SceneLayer[] = [
  // Image – Table (base layer)
  {
    id: "zyk-table",
    src: "/assets/me/Table.png",
    type: "image",
    left: 0,
    top: 58,
    width: 90,
    height: 56.25,
  },
  {
    // Music notes layer (hidden by default, smoothly revealed and floating when desk music is playing)
    id: "zyk-music-notes",
    src: "/assets/me/musicnotes.webm",
    type: "video",
    left: 10,
    top: 14,
    width: 60,
    height: 60,
    behaviors: ["listenMusicToggle"],
    opacity: 1,
    videoAttrs: {
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },



  {    // Desk music player: click to play/pause music and toggle music notes.
    id: "zyk-music",
    src: "/assets/me/soundbox.png",
    type: "image",
    left: 20,
    top: 62,
    width: 13,
    height: 17,
    behaviors: ["hoverGlow", "tooltip", "music", "toggle"],
    tooltip: "Want some music?",
    toggle: {
      src: "/assets/me/soundbox.png",
      type: "image",
      tooltip: "Music is playing",
    },
  },



  {
    id: "zyk-laptop",
    src: "/assets/me/Laptop.webm",
    type: "video",
    left: 29,
    top: 27,
    width: 44,
    height: 100,
    behaviors: ["clickGlow", "tooltip"],
    tooltip: "My laptop — where the building happens",
    videoAttrs: {
      autoPlay: true,
      loop: true,
      muted: true,
      poster: "/assets/me/Laptop.png",
    },
  },

  {
    // Not click-selectable; clicking opens the AllScene find-the-object game.
    id: "zyk-notebook",
    src: "/assets/me/Notebook.png",
    type: "image",
    left: 15,
    top: 65,
    width: 15,
    height: 40,
    behaviors: ["hoverGlow", "tooltip", "openMinigame"],
    tooltip: "Psst — wanna play a game?",
  },
  {
    // Cold by default (still PNG, no steam); clicking toggles to the hot webm
    // with animated steam and back again.
    id: "zyk-coffee",
    src: "/assets/me/Coffe.png",
    type: "image",
    left: 27,
    top: 30,
    width: 12,
    height: 100,
    behaviors: ["hoverGlow", "tooltip", "toggle"],
    tooltip: "The coffee isn't hot yet.",
    toggle: {
      src: "/assets/me/Coffe.webm",
      type: "video",
      tooltip: "Coffee is already hot.",
      videoAttrs: {
        autoPlay: true,
        loop: true,
        muted: true,
        poster: "/assets/me/Coffe.png",
      },
    },
  },

  // Image – Coffee cup (on top of laptop)
  {
    // No interaction yet — placeholder until finalized.
    id: "zyk-cup-holder",
    src: "/assets/me/cupHolder.png",
    type: "image",
    left: 55,
    top: 50,
    width: 10,
    height: 24,
  },
  // Image – Lap (assumed surface)
  {
    // Not clickable yet — hover glow + tooltip only.
    id: "zyk-lamp",
    src: "/assets/me/Lamp.png",
    type: "image",
    left: 8,
    top: 32,
    width: 23,
    height: 60,
    behaviors: ["hoverGlow", "tooltip"],
    tooltip: "Night Mode is currently under maintenance.",
  },
  // Image – Person (standing on lap)

  {
    id: "zyk-me-coding",
    src: "/assets/me/meCoding.webm",
    type: "video",
    left: 9,
    top: 0,
    width: 100,
    height: 100,
    behaviors: ["clickGlow", "tooltip", "popup"],
    tooltip: "That's me — click to say hi",
    popup: {
      title: "Hey, I'm Zyk! 👋",
      body: "Welcome to my little corner of the web. I'm a software developer and graphic artist who loves building warm, playful, handcrafted experiences — like this one. Poke around the room, scroll through the world, and feel free to reach out.",
    },
    videoAttrs: {
      autoPlay: true,
      loop: true,
      muted: true,
      poster: "/assets/me/meCoding.png",
    },
  },
  // Image – Chair (on top of person)
  {
    id: "zyk-chair",
    src: "/assets/me/Chair.png",
    type: "image",
    left: 62.4,
    top: 60,
    width: 40,
    height: 50,
  },
];

const zykCodingScene: Scene = {
  id: "zykCoding",
  layers: zykCodingItems,
  aspectRatio: "16/9",
};

export const ZykCoding: React.FC = () => <SceneEngine scene={zykCodingScene} />;
