import React from "react";
import { SceneEngine, type Scene, type SceneLayer } from "../../engine";

/**
 * ZykCoding – a responsive container that layers all assets from
 * `public/assets/me/` (video + images). The outer div uses the CSS class
 * `zykCoding` for styling.
 *
 * Coffee, Cup Holder, Lamp, Notebook, meCoding, and Laptop all carry
 * `behaviors: ["clickGlow"]` — click one to light it up; clicking a
 * different clickGlow asset (in this scene or any other) turns the
 * previous one off, since only one can be lit at a time. To make a new
 * asset clickable-and-glowing, just add `behaviors: ["clickGlow"]` to its
 * entry below — nothing in InteractiveLayer or the renderer needs to change.
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
    id: "zyk-laptop",
    src: "/assets/me/Laptop.webm",
    type: "video",
    left: 29,
    top: 27,
    width: 44,
    height: 100,
    behaviors: ["clickGlow"],
    videoAttrs: {
      autoPlay: true,
      loop: true,
      muted: true,
      poster: "/assets/me/Laptop.png",
    },
  },

  {
    id: "zyk-notebook",
    src: "/assets/me/Notebook.png",
    type: "image",
    left: 15,
    top: 65,
    width: 15,
    height: 40,
    behaviors: ["clickGlow"],
  },
  {
    id: "zyk-coffee",
    src: "/assets/me/Coffe.webm",
    type: "video",
    left: 27,
    top: 30,
    width: 12,
    height: 100,
    behaviors: ["clickGlow"],
    videoAttrs: {
      autoPlay: true,
      loop: true,
      muted: true,
      poster: "/assets/me/Coffe.png",
    },
  },

  // Image – Coffee cup (on top of laptop)
  {
    id: "zyk-cup-holder",
    src: "/assets/me/cupHolder.png",
    type: "image",
    left: 56,
    top: 50,
    width: 10,
    height: 24,
    behaviors: ["clickGlow"],
  },
  // Image – Lap (assumed surface)
  {
    id: "zyk-lamp",
    src: "/assets/me/Lamp.png",
    type: "image",
    left: 8,
    top: 32,
    width: 23,
    height: 60,
    behaviors: ["clickGlow"],
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
    behaviors: ["clickGlow"],
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
