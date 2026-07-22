import React from "react";
import { motion } from "framer-motion";
import { OutsideScene } from "../OutsideScene/OutsideScene";
import { RoomScene } from "../RoomScene/RoomScene";
import { ZykCoding } from "../ZykCoding/ZykCoding";

/**
 * Hero section for the portfolio.
 * Displays a heading and the extracted Framer component (`Me`).
 */
export const Hero: React.FC = () => {
  return (
    <section className="py-8 px-2 flex flex-col items-center  text-center min-h-screen border-2 border-yellow-300 overflow-hidden">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
// @ts-ignore
      <motion.div
        className=" w-full mx-auto relative border-2 border-gray-300"
        style={{
          maxWidth: "1200px",
          // 16:9 aspect ratio – height will be calculated automatically
          aspectRatio: "16 / 9", // height scales with width
          overflow: "hidden",
          borderRadius: "8px",
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
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
// @ts-ignore
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
      </motion.div>
    </section>
  );
};
