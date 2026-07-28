import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import {
  POPUP_OPEN_EVENT,
  type PopupContent,
  type PopupOpenDetail,
} from "../../engine";

/**
 * Renders the click-to-open message popup for the whole page. Mounted once;
 * listens for the engine's POPUP_OPEN_EVENT (emitted by the `popup` behavior
 * on any scene layer) and shows a cozy, branded card with the layer's message.
 *
 * Single source of truth: only one popup is open at a time. Closes on the X,
 * a backdrop click, or Escape.
 */
export const PopupHost: React.FC = () => {
  const [content, setContent] = useState<PopupContent | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<PopupOpenDetail>).detail;
      if (detail?.content?.body) setContent(detail.content);
    };
    window.addEventListener(POPUP_OPEN_EVENT, onOpen as EventListener);
    return () =>
      window.removeEventListener(POPUP_OPEN_EVENT, onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!content) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [content]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {content && (
        <motion.div
          key="popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setContent(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-zyk-brown/30 px-6 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[2rem] border border-zyk-brown/10 bg-zyk-bg-end p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setContent(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-zyk-brown/60 transition-colors hover:bg-zyk-brown/10 hover:text-zyk-heading"
            >
              <IconX size={20} />
            </button>

            {content.title && (
              <h3 className="pr-8 font-display text-2xl text-zyk-heading">
                {content.title}
              </h3>
            )}
            <p
              className={`font-body leading-relaxed text-zyk-brown/80 ${content.title ? "mt-3" : "pr-8"}`}
            >
              {content.body}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
