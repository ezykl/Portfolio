import React from "react";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar/NavBar";
import { MusicHost } from "./components/MusicHost/MusicHost";
import { useInitialLoad } from "./hook/useInitialLoad";

/**
 * App shell. The initial-load gate (loading screen + asset preload) lives here,
 * ABOVE where any future router outlet would mount — so client-side navigation
 * (e.g. Home → Projects → Home) never replays the loading screen; only a real
 * page reload does. See `hook/useInitialLoad.ts` for the loading contract.
 */
function App() {
  const { isLoading, progress } = useInitialLoad();

  return (
    <>
      {/* The page renders underneath from the start so its scenes/videos are
          fully painted by the time the loading overlay is removed. It's a single
          long-scrolling page (§3); the NavBar smooth-scrolls between its section
          anchors. Nav mounts only after reveal so its entrance animation plays. */}
      {!isLoading && <NavBar />}
      <MusicHost />
      <HomePage revealed={!isLoading} />

      {/* Cozy loading overlay sits on top (fixed, z-index 9999) until ready. */}
      {isLoading && <LoadingScreen progress={progress} />}
    </>
  );
}

export default App;
