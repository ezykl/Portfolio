import React from "react";
import { AssetLayer, AssetItem } from "../AssetLayer/AssetLayer";

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
export const OutsideScene: React.FC = () => {
  const items: AssetItem[] = [
    // Sky background (full size)
    {
      src: "/assets/outside/sky.png",
      type: "image",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    },
    // Sun (small top‑right element)
    {
      src: "/assets/outside/sun.png",
      type: "image",
      left: 40,
      top: 40,
      width: 25,
      height: 25,
    },
    // Mountain silhouette
    {
      src: "/assets/outside/mountainis.png",
      type: "image",
      left: 5,
      top: 40,
      width: 80,
      height: 60,
    },
  ];

  return <AssetLayer items={items} aspectRatio="16/9" />;
};
