import React from "react";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { outsideSceneItems } from "./components/OutsideScene/OutsideScene";
import { roomSceneItems } from "./components/RoomScene/RoomScene";
import { zykCodingItems } from "./components/ZykCoding/ZykCoding";
import type { SceneLayer } from "./engine";

// Collect every still-image URL shown at boot: scene images plus video posters.
// Videos themselves stream in over their poster after reveal, so we don't block on them.
function collectImageUrls(items: SceneLayer[]): string[] {
  const urls: string[] = [];
  for (const item of items) {
    if (item.type === "image") urls.push(item.src);
    else if (item.type === "video") {
      const poster = item.videoAttrs?.poster;
      if (poster) urls.push(poster);
    }
  }
  return urls;
}

const PRELOAD_IMAGES = Array.from(
  new Set([
    ...collectImageUrls(outsideSceneItems),
    ...collectImageUrls(roomSceneItems),
    ...collectImageUrls(zykCodingItems),
  ]),
);
// The loading screen is shown for at least this long so the progress bar is
// actually visible even when every asset is cached and loads in milliseconds.
const MIN_LOAD_MS = 4000;
// Absolute safety cap: if an asset stalls on a slow network, finish anyway so
// the app can never hang on the loading screen forever.
const MAX_LOAD_MS = 15000;

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [page, setPage] = React.useState<"home" | "about">("home");

  React.useEffect(() => {
    const total = PRELOAD_IMAGES.length;
    let loaded = 0;
    // Real asset-loading progress (0–100). With no assets we're already "loaded".
    let realProgress = total === 0 ? 100 : 0;

    const onDone = () => {
      loaded += 1;
      realProgress = (loaded / total) * 100;
    };

    for (const url of PRELOAD_IMAGES) {
      const img = new Image();
      img.onload = onDone;
      img.onerror = onDone; // a broken URL must not hang the app
      img.src = url;
    }

    const start = Date.now();
    let display = 0; // eased value actually shown (0–100)
    let rafId = 0;
    let revealTimer = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const assetsReady = realProgress >= 100;
      // Smooth time-based ramp, paced to fill over ~MIN_LOAD_MS.
      const timeProgress = Math.min(100, (elapsed / MIN_LOAD_MS) * 100);
      // Hold just under full until assets are actually ready, so the bar never
      // "completes" before the page behind it is painted.
      const ceiling = assetsReady ? 100 : 90;
      let target = Math.min(timeProgress, ceiling);
      // Safety net: force completion if assets stall past the hard cap.
      if (elapsed >= MAX_LOAD_MS) target = 100;

      // Ease toward the target so the bar glides instead of snapping. The same
      // `display` value feeds both the bar width and the % text (via progress),
      // so they stay perfectly in sync.
      display += (target - display) * 0.15;
      if (target >= 100 && target - display < 0.3) display = 100;

      setProgress(display);

      if (display >= 100) {
        // Hold on a full bar briefly (and show "Come on in!") before reveal.
        revealTimer = window.setTimeout(() => setIsLoading(false), 600);
        return; // stop the loop; cleanup cancels any pending frame/timer
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <>
      {/* The page renders underneath from the start so its scenes/videos are
          fully painted by the time the loading overlay is removed. */}
      {/* Simple navigation */}
      {/* <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setPage('home')} style={{ marginRight: '1rem' }}>
          Home
        </button>
        <button onClick={() => setPage('about')}>About</button>
        <div className="p-4 bg-indigo-100 rounded-lg shadow-md">
          Tailwind is working!
        </div>
      </nav> */}
      {/* Page rendering */}
      {page === "home" && <HomePage revealed={!isLoading} />}
      {page === "about" && <AboutPage />}

      {/* Cozy loading overlay sits on top (fixed, z-index 9999) until ready. */}
      {isLoading && <LoadingScreen progress={progress} />}
    </>
  );
}

export default App;
