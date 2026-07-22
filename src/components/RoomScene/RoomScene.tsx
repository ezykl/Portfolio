import React from "react";
import { AssetLayer, AssetItem } from "../AssetLayer";

/**
 * RoomScene – a simple scene using assets from `assets/room/`.
 * Positions are expressed as percentages of the container size.
 *
 * NOTE: Position and size calibration for RoomScene and OutsideScene have been completed.
 *
 * Future enhancements:
 * - Click toggle on elements to highlight them.
 * - Parallax effect on individual elements or the whole scene.
 *   Add related state and event handlers where appropriate.
 */
export const RoomScene: React.FC = () => {
  const items: AssetItem[] = [
    // Background room
    {
      src: "/assets/room/room.png",
      type: "image",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    },

    // Frisbee
    {
      src: "/assets/room/Frisbee.png",
      type: "image",
      left: 0,
      top: 24,
      width: 10,
      height: 12,
    },
    // Left wall mount
    {
      src: "/assets/room/leftWallMount.png",
      type: "image",
      left: -1.4,
      top: 32,
      width: 14,
      height: 15,
    },

    {
      src: "/assets/room/rightWallMount.png",
      type: "image",
      left: 83,
      top: 0,
      width: 20,
      height: 50,
    },
    // Plant hanging from ceiling
    {
      src: "/assets/room/hangPlant.png",
      type: "image",
      left: 7,
      top: 16,
      width: 20,
      height: 45,
    },
    {
      src: "/assets/room/plant1.png",
      type: "image",
      left: 19,
      top: 50,
      width: 20,
      height: 42,
    },
    // Couch

    {
      src: "/assets/room/Couch.png",
      type: "image",
      left: -10,
      top: 54,
      width: 40,
      height: 45,
    },
    // Cabinet
    {
      src: "/assets/room/Cabinet.png",
      type: "image",
      left: 55,
      top: 27,
      width: 21,
      height: 70,
    },
  ];

  return <AssetLayer items={items} aspectRatio="16/9" />;
};
