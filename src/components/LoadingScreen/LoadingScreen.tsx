import React from "react";

/**
 * Simple full‑screen loading indicator shown while the app is bootstrapping.
 * Replace the spinner/content with whatever branding you prefer.
 */
export const LoadingScreen: React.FC = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      color: "#333",
      fontSize: "1.5rem",
      zIndex: 9999,
    }}
  >
    Loading…
  </div>
);
