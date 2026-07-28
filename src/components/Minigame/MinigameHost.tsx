import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import {
  LAYER_CLICK_EVENT,
  OPEN_MINIGAME_EVENT,
  SceneGlowProvider,
  type LayerClickDetail,
} from "../../engine";
import { OutsideScene } from "../OutsideScene/OutsideScene";
import { RoomScene } from "../RoomScene/RoomScene";

/**
 * The AllScene "find the object" mini-game (opened by the notebook's
 * `openMinigame` behavior via OPEN_MINIGAME_EVENT). Renders the composited
 * diorama in a modal and asks the visitor to find one random object; clicking
 * the right one (detected via the engine's LAYER_CLICK_EVENT) wins.
 *
 * The diorama here is Outside + Room only (no ZykCoding), so the game stays
 * focused on the room and can't recursively re-open itself from the notebook.
 *
 * State/scene persistence: once opened, the modal stays mounted and is only
 * shown/hidden — so reopening never re-mounts or re-renders the scenes, and the
 * current round (target/progress) is preserved. A fresh round starts only on
 * the very first open or via "Keep exploring".
 */

interface Findable {
  id: string;
  name: string;
  /** Illustration shown in the congrats card when this one is found. */
  img: string;
}

// Clickable RoomScene objects the game can ask for (must carry a click behavior
// so they emit LAYER_CLICK_EVENT when clicked).
const FINDABLES: Findable[] = [
  { id: "room-frisbee", name: "frisbee", img: "/assets/room/Frisbee.png" },
  { id: "grad-pic", name: "graduation photo", img: "/assets/room/grad_pic.png" },
  { id: "room-longboard", name: "longboard", img: "/assets/room/longboard.png" },
  { id: "room-gdsc", name: "GDSC plaque", img: "/assets/room/gdsc.png" },
];

const FINDABLE_IDS = new Set(FINDABLES.map((f) => f.id));

const pickTarget = (exclude?: string): Findable => {
  const pool = exclude ? FINDABLES.filter((f) => f.id !== exclude) : FINDABLES;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const MinigameHost: React.FC = () => {
  // Mount the modal (and its scenes) lazily on first open, then keep it mounted.
  const [everOpened, setEverOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Findable | null>(null);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Open on request. Preserve the existing round (target/won/hint) across
  // reopens; only start a round if there isn't one yet.
  useEffect(() => {
    const onOpen = () => {
      setEverOpened(true);
      setTarget((prev) => prev ?? pickTarget());
      setOpen(true);
    };
    window.addEventListener(OPEN_MINIGAME_EVENT, onOpen as EventListener);
    return () =>
      window.removeEventListener(OPEN_MINIGAME_EVENT, onOpen as EventListener);
  }, []);

  // Judge clicks only while a round is live and visible.
  useEffect(() => {
    if (!open || won || !target) return;
    const onLayerClick = (event: Event) => {
      const detail = (event as CustomEvent<LayerClickDetail>).detail;
      const id = detail?.id;
      if (!id) return;
      if (id === target.id) {
        setWon(true);
        setHint(null);
      } else if (FINDABLE_IDS.has(id)) {
        setHint("Not quite — keep looking!");
      }
    };
    window.addEventListener(LAYER_CLICK_EVENT, onLayerClick as EventListener);
    return () =>
      window.removeEventListener(
        LAYER_CLICK_EVENT,
        onLayerClick as EventListener,
      );
  }, [open, won, target]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const keepExploring = () => {
    setTarget((prev) => pickTarget(prev?.id));
    setWon(false);
    setHint(null);
  };

  if (typeof document === "undefined" || !everOpened) return null;

  return createPortal(
    // Stays mounted; only faded/disabled when closed, so the scenes below never
    // re-mount on reopen.
    <motion.div
      initial={false}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
      onClick={close}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-zyk-brown/40 px-4 py-8 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-[2rem] border border-zyk-brown/10 bg-zyk-bg-end p-5 shadow-2xl sm:p-6"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.24em] text-zyk-accent">
              Find the object
            </p>
            <h3 className="mt-1 font-display text-2xl text-zyk-heading sm:text-3xl">
              Find the {target?.name}!
            </h3>
            <p className="mt-1 h-5 font-body text-sm text-zyk-brown/70">
              {hint ?? "Click around the room to find it."}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zyk-brown/60 transition-colors hover:bg-zyk-brown/10 hover:text-zyk-heading"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Diorama (Outside + Room in the wooden frame) */}
        <div className="relative mx-auto w-full" style={{ aspectRatio: "16 / 9" }}>
          <div
            style={{
              position: "absolute",
              top: "1.28%",
              bottom: "1.28%",
              left: "0.72%",
              right: "0.72%",
              overflow: "hidden",
              borderRadius: "20px",
            }}
          >
            <SceneGlowProvider>
              <div
                style={{
                  position: "absolute",
                  width: "55%",
                  height: "auto",
                  top: "20%",
                  left: "3%",
                }}
              >
                <OutsideScene />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "-0.5%",
                  top: "-0.5%",
                  width: "102%",
                  height: "auto",
                }}
              >
                <RoomScene />
              </div>
            </SceneGlowProvider>
          </div>

          <img
            src="/assets/ui/16x9_border.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              pointerEvents: "none",
              zIndex: 60,
            }}
          />

          {/* Win overlay */}
          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-[70] flex flex-col items-center justify-center rounded-[20px] bg-zyk-brown/55 px-6 text-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full max-w-sm rounded-[1.5rem] bg-zyk-bg-end p-6 shadow-xl"
                >
                  {target && (
                    <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-2xl bg-zyk-secondary/25 p-2">
                      <img
                        src={target.img}
                        alt={target.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <p className="font-display text-3xl text-zyk-heading">
                    You found it! 🎉
                  </p>
                  <p className="mt-2 font-body text-zyk-brown/80">
                    Nice eye — that was the {target?.name}.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={keepExploring}
                      className="rounded-full bg-zyk-primary px-6 py-2.5 font-display text-sm text-white shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      Keep exploring
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-full bg-zyk-secondary px-6 py-2.5 font-display text-sm text-zyk-heading shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
};
