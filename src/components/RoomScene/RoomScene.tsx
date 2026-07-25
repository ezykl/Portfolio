import React from "react";
import { SceneEngine, type Scene, type SceneLayer } from "../../engine";

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
export const roomSceneItems: SceneLayer[] = [
  // Background room
  {
    id: "room-background",
    src: "/assets/room/room.png",
    type: "image",
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },

  // Frisbee
  {
    id: "room-frisbee",
    src: "/assets/room/Frisbee.png",
    type: "image",
    left: 60,
    top: 18,
    width: 10,
    height: 12,
    behaviors: ["clickGlow"],
  },
  // Frisbee
  {
    id: "grad-pic",
    src: "/assets/room/grad_pic.png",
    type: "image",
    left: 1,
    top: 23.8,
    width: 10,
    height: 12,
    behaviors: ["clickGlow"],
  },

  // Left wall mount
  {
    id: "room-left-wall-mount",
    src: "/assets/room/leftWallMount.png",
    type: "image",
    left: -1.4,
    top: 32,
    width: 14,
    height: 15,
  },

  {
    id: "room-right-wall-mount",
    src: "/assets/room/rightWallMount.png",
    type: "image",
    left: 83,
    top: 0,
    width: 20,
    height: 50,
  },
  // Plant hanging from ceiling
  {
    id: "room-hang-plant",
    src: "/assets/room/hangPlant.png",
    type: "image",
    left: 7,
    top: 16,
    width: 20,
    height: 45,
  },
  {
    id: "room-plant1",
    src: "/assets/room/plant1.png",
    type: "image",
    left: 19,
    top: 50,
    width: 20,
    height: 42,
  },
  // Couch

  {
    id: "room-couch",
    src: "/assets/room/Couch.png",
    type: "image",
    left: -10,
    top: 54,
    width: 40,
    height: 45,
  },
  //Longboard leaning against wall
  {
    id: "room-longboard",
    src: "/assets/room/longboard.png",
    type: "image",
    left: 38,
    top: 48,
    width: 30,
    height: 43,
    behaviors: ["clickGlow"],
  },

  // Cabinet
  {
    id: "room-cabinet",
    src: "/assets/room/Cabinet.png",
    type: "image",
    left: 55,
    top: 20,
    width: 21,
    height: 70,
  },

  {
    id: "room-gdsc",
    src: "/assets/room/gdsc.png",
    type: "image",
    left: 53,
    top: 42.7,
    width: 22,
    height: 13,
    behaviors: ["clickGlow"],
  },

  {
    id: "room-books-top",
    src: "/assets/room/books-top.png",
    type: "image",
    left: 59.4,
    top: 23.5,
    width: 16,
    height: 25,
  },

  //plant
  {
    id: "room-plant2",
    src: "/assets/room/plant2.png",
    type: "image",
    left: 85,
    top: 60,
    width: 20,
    height: 42,
  },
];

const roomScene: Scene = {
  id: "room",
  layers: roomSceneItems,
  aspectRatio: "16/9",
};

export const RoomScene: React.FC = () => <SceneEngine scene={roomScene} />;
