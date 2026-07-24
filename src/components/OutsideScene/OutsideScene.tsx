import React from "react";
import { SceneEngine, type Scene, type SceneLayer } from "../../engine";

/**
 * OutsideScene – a simple scene using assets from `assets/outside/`.
 * The sky is used as a full‑width base layer, with sun and mountain on top.
 *
 * NOTE: Position and size calibration for RoomScene and OutsideScene have been completed.
 *
 * Future enhancements:
 * - Click toggle on elements to highlight them.
 * - Parallax effect on individual elements or the whole scene.
 *   Add related state and event handlers where appropriate.
 */
export const outsideSceneItems: SceneLayer[] = [
  // Sky background (full size)
  {
    id: "outside-sky",
    src: "/assets/outside/sky.png",
    type: "image",
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
  // Sun (small top‑right element)
  {
    id: "outside-sun",
    src: "/assets/outside/sun.png",
    type: "image",
    left: 40,
    top: 40,
    width: 25,
    height: 25,
  },

  {
    id: "outside-clouds",
    src: "/assets/outside/clouds.png",
    type: "image",
    left: -30,
    top: 20,
    width: 70,
    height: 25,
    loop: { fromLeft: -30, toLeft: 50, fadeStartLeft: 30, duration: 20 },
  },
  // Mountain silhouette
  {
    id: "outside-mountains",
    src: "/assets/outside/mountainis.png",
    type: "image",
    left: 5,
    top: 40,
    width: 80,
    height: 60,
  },
];

const outsideScene: Scene = {
  id: "outside",
  layers: outsideSceneItems,
  aspectRatio: "16/9",
};

export const OutsideScene: React.FC = () => (
  <SceneEngine scene={outsideScene} />
);
