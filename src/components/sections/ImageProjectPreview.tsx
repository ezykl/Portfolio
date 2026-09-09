import React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { IconExternalLink, IconX } from "@tabler/icons-react";

interface ImageProjectPreviewProps {
  open: boolean;
  title: string;
  images: string[];
  imageAlt: string;
  externalLink?: {
    label: string;
    href: string;
  };
  onClose: () => void;
}

export const ImageProjectPreview: React.FC<ImageProjectPreviewProps> = ({
  open,
  title,
  images,
  imageAlt,
  externalLink,
  onClose,
}) => {
  const reduce = useReducedMotion() ?? false;
  const titleId = `image-preview-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

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
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
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
            <h2 id={titleId} className="font-display text-xl sm:text-2xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {externalLink && (
              <a
                href={externalLink.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-zyk-bg-end/20 px-3 font-display text-xs transition-colors hover:bg-zyk-bg-end/10 sm:px-4"
              >
                <span>{externalLink.label}</span>
                <IconExternalLink size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${title} preview`}
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
          {images.map((src, index) => (
            <figure
              key={src}
              className="overflow-hidden rounded-2xl border border-zyk-bg-end/10 bg-black/40 sm:rounded-3xl"
            >
              <img
                src={src}
                alt={`${imageAlt} ${index + 1}`}
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
