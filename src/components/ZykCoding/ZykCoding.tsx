import React from "react";
import { AssetLayer, AssetItem } from "../AssetLayer";

/**
 * ZykCoding – a responsive container that layers all assets from
 * `public/assets/me/` (video + images). The outer div uses the CSS class
 * `zykCoding` for styling.
 */
export const ZykCoding: React.FC = () => {
  const items: AssetItem[] = [
    // Image – Table (base layer)
    {
      src: "/assets/me/Table.png",
      type: "image",
      left: 0,
      top: 58,
      width: 90,
      height: 56.25,
    },

    {
      src: "/assets/me/Laptop.webm",
      type: "video",
      left: 29,
      top: 27,
      width: 44,
      height: 100,
      videoAttrs: {
        autoPlay: true,
        loop: true,
        muted: true,
        poster: "/assets/me/Laptop.png",
      },
    },

    {
      src: "/assets/me/Notebook.png",
      type: "image",
      left: 15,
      top: 65,
      width: 15,
      height: 40,
    },
    {
      src: "/assets/me/Coffe.webm",
      type: "video",
      left: 27,
      top: 30,
      width: 12,
      height: 100,
      videoAttrs: {
        autoPlay: true,
        loop: true,
        muted: true,
        poster: "/assets/me/Coffe.png",
      },
    },

    // Image – Coffee cup (on top of laptop)
    {
      src: "/assets/me/cupHolder.png",
      type: "image",
      left: 56,
      top: 50,
      width: 10,
      height: 24,
    },
    // Image – Lap (assumed surface)
    {
      src: "/assets/me/Lamp.png",
      type: "image",
      left: 8,
      top: 32,
      width: 23,
      height: 60,
    },
    // Image – Person (standing on lap)

    {
      src: "/assets/me/meCoding.webm",
      type: "video",
      left: 9,
      top: 0,
      width: 100,
      height: 100,
      videoAttrs: {
        autoPlay: true,
        loop: true,
        muted: true,
        poster: "/assets/me/meCoding.png",
      },
    },
    // Image – Chair (on top of person)
    {
      src: "/assets/me/Chair.png",
      type: "image",
      left: 62.4,
      top: 60,
      width: 40,
      height: 50,
    },
  ];

  return <AssetLayer items={items} aspectRatio="16/9" />;
};
