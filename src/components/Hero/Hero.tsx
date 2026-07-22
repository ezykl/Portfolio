import React from "react";
import { OutsideScene } from "../OutsideScene/OutsideScene";
import { RoomScene } from "../RoomScene/RoomScene";
import { ZykCoding } from "../ZykCoding/ZykCoding";

/**
 * Hero section for the portfolio.
 * Displays a heading and the extracted Framer component (`Me`).
 */
export const Hero: React.FC = () => {
  return (
    <section className="py-16 px-8 flex flex-col items-center justify-center text-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
      <div className="mt-8 w-full max-w-4xl mx-auto">
        <OutsideScene />
        <RoomScene />
        <ZykCoding />
      </div>
    </section>
  );
};
