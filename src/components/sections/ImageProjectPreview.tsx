import React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { IconExternalLink, IconX } from "@tabler/icons-react";

export interface ImageCaseStudy {
  eyebrow: string;
  summary: string;
  role: string;
  note?: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
  sections: Array<{
    eyebrow: string;
    title: string;
    description: string;
    images: string[];
  }>;
}

export interface ImagePreviewContext {
  eyebrow: string;
  summary: string;
  role: string;
  note?: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
  imageHeading?: string;
  imageDescription?: string;
  videoHeading?: string;
  videoDescription?: string;
}

interface ImageProjectPreviewProps {
  open: boolean;
  title: string;
  images: string[];
  videos?: string[];
  imageAlt: string;
  externalLink?: {
    label: string;
    href: string;
  };
  caseStudy?: ImageCaseStudy;
  context?: ImagePreviewContext;
  onClose: () => void;
}

export const ImageProjectPreview: React.FC<ImageProjectPreviewProps> = ({
  open,
  title,
  images,
  videos = [],
  imageAlt,
  externalLink,
  caseStudy,
  context,
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
      className="fixed inset-0 z-[200] flex flex-col bg-zyk-bg-end text-zyk-heading"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <header className="shrink-0 border-b border-zyk-bg-end/10 bg-zyk-brown/95 px-4 py-3 text-zyk-bg-end backdrop-blur-sm sm:px-6 sm:py-4">
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <motion.article
          className={
            caseStudy
              ? "bg-zyk-bg-end text-zyk-heading"
              : "bg-linear-to-b from-zyk-bg-end to-zyk-secondary/15 px-3 py-8 text-zyk-heading sm:px-6 sm:py-12"
          }
          initial={reduce ? false : { opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {caseStudy ? (
            <>
              <section className="px-5 py-16 sm:px-8 sm:py-24">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
                  <div>
                    <p className="font-display text-xs uppercase tracking-[0.22em] text-zyk-accent">
                      {caseStudy.eyebrow}
                    </p>
                    <h3 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
                      {title}
                    </h3>
                    <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-zyk-brown/75 sm:text-lg">
                      {caseStudy.summary}
                    </p>
                    <p className="mt-5 border-l-2 border-zyk-primary pl-4 font-body text-sm leading-relaxed text-zyk-brown/70">
                      <span className="font-semibold text-zyk-heading">
                        My role:
                      </span>{" "}
                      {caseStudy.role}
                    </p>
                    {caseStudy.note && (
                      <p className="mt-6 max-w-2xl rounded-2xl border border-zyk-brown/10 bg-zyk-secondary/20 px-4 py-3 font-body text-xs leading-relaxed text-zyk-brown/70 sm:text-sm">
                        {caseStudy.note}
                      </p>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-3xl bg-white/75 p-6 shadow-sm">
                    {caseStudy.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-zyk-brown/45">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 font-body text-sm font-semibold text-zyk-heading">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              {caseStudy.sections.map((section, sectionIndex) => (
                <section
                  key={section.title}
                  className={`px-5 py-14 sm:px-8 sm:py-20 ${
                    sectionIndex % 2 === 0
                      ? "bg-zyk-secondary/20"
                      : "bg-zyk-bg-end"
                  }`}
                >
                  <div className="mx-auto max-w-6xl">
                    <div className="mb-10 max-w-2xl">
                      <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-accent">
                        {section.eyebrow}
                      </p>
                      <h4 className="mt-2 font-display text-3xl sm:text-4xl">
                        {section.title}
                      </h4>
                      <p className="mt-3 font-body text-sm leading-relaxed text-zyk-brown/70 sm:text-base">
                        {section.description}
                      </p>
                    </div>
                    <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                      {section.images.map((src, imageIndex) => (
                        <figure
                          key={src}
                          className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-zyk-brown/10 bg-white shadow-[0_20px_55px_rgba(140,84,56,0.14)]"
                        >
                          <img
                            src={src}
                            alt={`${imageAlt}: ${section.title} screen ${imageIndex + 1}`}
                            loading={sectionIndex === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-auto w-full object-contain"
                          />
                        </figure>
                      ))}
                    </div>
                  </div>
                </section>
              ))}

              {externalLink && (
                <section className="bg-zyk-brown px-5 py-16 text-center text-zyk-bg-end sm:px-8 sm:py-20">
                  <p className="font-body text-sm text-zyk-bg-end/65">
                    Explore the implementation and project structure.
                  </p>
                  <a
                    href={externalLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-zyk-primary px-6 py-3 font-display text-sm text-white transition-transform hover:-translate-y-0.5"
                  >
                    {externalLink.label}
                    <IconExternalLink size={17} />
                  </a>
                </section>
              )}
            </>
          ) : (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 sm:gap-16">
              {context && (
                <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                  <div>
                    <p className="font-display text-xs uppercase tracking-[0.22em] text-zyk-accent">
                      {context.eyebrow}
                    </p>
                    <h3 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
                      {title}
                    </h3>
                    <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-zyk-brown/75 sm:text-lg">
                      {context.summary}
                    </p>
                    <p className="mt-5 border-l-2 border-zyk-primary pl-4 font-body text-sm leading-relaxed text-zyk-brown/70">
                      <span className="font-semibold text-zyk-heading">
                        My role:
                      </span>{" "}
                      {context.role}
                    </p>
                    {context.note && (
                      <p className="mt-6 max-w-2xl rounded-2xl border border-zyk-brown/10 bg-zyk-secondary/25 px-4 py-3 font-body text-xs leading-relaxed text-zyk-brown/70 sm:text-sm">
                        {context.note}
                      </p>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-5 gap-y-5 rounded-3xl bg-white/80 p-5 shadow-sm sm:p-6">
                    {context.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="font-display text-[0.65rem] uppercase tracking-[0.16em] text-zyk-brown/45">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 font-body text-sm font-semibold text-zyk-heading">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section>
                {context?.imageHeading && (
                  <div className="mb-6 max-w-2xl">
                    <h4 className="font-display text-2xl sm:text-3xl">
                      {context.imageHeading}
                    </h4>
                    {context.imageDescription && (
                      <p className="mt-2 font-body text-sm leading-relaxed text-zyk-brown/70 sm:text-base">
                        {context.imageDescription}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-5 sm:gap-8">
                  {images.map((src, index) => (
                    <figure
                      key={src}
                      className="overflow-hidden rounded-2xl border border-zyk-brown/10 bg-white shadow-sm sm:rounded-3xl"
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
                </div>
              </section>

              {videos.length > 0 && (
                <section>
                  {context?.videoHeading && (
                    <div className="mb-6 max-w-2xl">
                      <h4 className="font-display text-2xl sm:text-3xl">
                        {context.videoHeading}
                      </h4>
                      {context.videoDescription && (
                        <p className="mt-2 font-body text-sm leading-relaxed text-zyk-brown/70 sm:text-base">
                          {context.videoDescription}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="grid items-start gap-6 md:grid-cols-2">
                    {videos.map((src, index) => (
                      <figure
                        key={src}
                        className="mx-auto flex w-fit max-w-full justify-center overflow-hidden rounded-2xl border border-zyk-brown/10 bg-white p-2 shadow-sm sm:rounded-3xl"
                      >
                        <video
                          src={src}
                          aria-label={`${imageAlt} process video ${index + 1}`}
                          controls
                          playsInline
                          preload="metadata"
                          className="block h-auto max-h-[70vh] w-auto max-w-full rounded-xl sm:rounded-2xl"
                        />
                      </figure>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </motion.article>
      </div>
    </motion.div>,
    document.body,
  );
};
