import React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { IconExternalLink, IconX } from "@tabler/icons-react";

const FIGMA_PROTOTYPE_URL =
  "https://www.figma.com/proto/hZANlkiFX0XiawU13HxCtk/June-Design-Challenge-Skill-Tree?node-id=4471-117&p=f&t=RjffZjJHRnfKN1Ve-0&scaling=contain&content-scaling=fixed&page-id=4471%3A117&fuid=1293388493346889524";

const DESIGN_IMAGES = [
  "/assets/skill-tree/1.png",
  "/assets/skill-tree/2.png",
  "/assets/skill-tree/3.png",
];

interface SkillTreePreviewProps {
  open: boolean;
  onClose: () => void;
}

export const SkillTreePreview: React.FC<SkillTreePreviewProps> = ({
  open,
  onClose,
}) => {
  const reduce = useReducedMotion() ?? false;

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <motion.div
      id="skill-tree-preview"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-tree-title"
      className="fixed inset-0 z-[200] flex flex-col bg-zyk-brown/95 text-zyk-bg-end backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <header className="shrink-0 border-b border-zyk-bg-end/10 bg-zyk-brown/90 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-secondary">
              Featured Project
            </p>
            <h2
              id="skill-tree-title"
              className="font-display text-xl sm:text-2xl"
            >
              June Design Challenge: Skill Tree
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={FIGMA_PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-zyk-bg-end/20 px-3 font-display text-xs transition-colors hover:bg-zyk-bg-end/10 sm:px-4"
            >
              <span>View in Figma</span>
              <IconExternalLink size={16} />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Skill Tree preview"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zyk-bg-end/20 transition-colors hover:bg-zyk-bg-end/10"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-6 sm:py-8">
        <motion.div
          className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-8"
          initial={reduce ? false : { opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {DESIGN_IMAGES.map((src, index) => (
            <figure
              key={src}
              className="overflow-hidden rounded-2xl border border-zyk-bg-end/10 bg-black/40 sm:rounded-3xl"
            >
              <img
                src={src}
                alt={`Skill Tree game UI design board ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </figure>
          ))}
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
};
