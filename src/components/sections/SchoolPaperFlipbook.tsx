import React from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { motion, useReducedMotion } from "framer-motion";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconX,
} from "@tabler/icons-react";

const PAGE_COUNT = 12;
const PAGES = Array.from(
  { length: PAGE_COUNT },
  (_, index) => `/assets/school-paper/page-${index + 1}.png`,
);

interface SchoolPaperFlipbookProps {
  open: boolean;
  onClose: () => void;
}

const MagazinePage = React.forwardRef<
  HTMLDivElement,
  { src: string; pageNumber: number }
>(({ src, pageNumber }, ref) => (
  <div ref={ref} className="overflow-hidden bg-white shadow-inner">
    <img
      src={src}
      alt={`School paper magazine page ${pageNumber}`}
      loading={pageNumber <= 2 ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-contain"
    />
  </div>
));

MagazinePage.displayName = "MagazinePage";

export const SchoolPaperFlipbook: React.FC<SchoolPaperFlipbookProps> = ({
  open,
  onClose,
}) => {
  const bookRef = React.useRef<any>(null);
  const reduce = useReducedMotion() ?? false;
  const [page, setPage] = React.useState(0);

  const softenAllPages = React.useCallback(() => {
    const pageFlip = bookRef.current?.pageFlip();
    for (let pageIndex = 0; pageIndex < PAGE_COUNT; pageIndex += 1) {
      pageFlip?.getPage(pageIndex)?.setDensity("soft");
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") bookRef.current?.pageFlip().flipPrev();
      if (event.key === "ArrowRight") bookRef.current?.pageFlip().flipNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  React.useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <motion.div
      id="school-paper-flipbook"
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-paper-title"
      className="fixed inset-0 z-[200] flex flex-col bg-zyk-bg-end text-zyk-heading"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <header className="shrink-0 border-b border-zyk-bg-end/10 bg-zyk-brown/95 px-3 py-3 text-zyk-bg-end backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-zyk-secondary">
              Featured Project
            </p>
            <h2
              id="school-paper-title"
              className="font-display text-xl sm:text-2xl"
            >
              School Paper Magazine
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/assets/school-paper/school-paper.pdf"
              download
              className="inline-flex h-10 items-center gap-2 rounded-full border border-zyk-bg-end/20 px-3 font-display text-xs transition-colors hover:bg-zyk-bg-end/10 sm:px-4"
            >
              <IconDownload size={17} />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close magazine"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zyk-bg-end/20 transition-colors hover:bg-zyk-bg-end/10"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden bg-linear-to-b from-zyk-bg-end to-zyk-secondary/15 px-3 py-3 sm:px-6 sm:py-4">
        <motion.div
          className="flex h-full min-h-0 w-full cursor-grab items-center justify-center active:cursor-grabbing"
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            className="school-paper-book"
            style={{}}
            startPage={0}
            size="stretch"
            width={480}
            height={679}
            minWidth={280}
            maxWidth={480}
            minHeight={396}
            maxHeight={679}
            drawShadow={!reduce}
            flippingTime={reduce ? 1 : 700}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.35}
            showCover
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={24}
            showPageCorners={!reduce}
            disableFlipByClick={false}
            onInit={softenAllPages}
            onUpdate={softenAllPages}
            onChangeOrientation={softenAllPages}
            onFlip={(event) => {
              softenAllPages();
              setPage(event.data);
            }}
          >
            {PAGES.map((src, index) => (
              <MagazinePage key={src} src={src} pageNumber={index + 1} />
            ))}
          </HTMLFlipBook>
        </motion.div>
      </div>

      <footer className="shrink-0 border-t border-zyk-brown/10 bg-zyk-secondary/15 px-3 pb-3 pt-3 sm:px-6 sm:pb-5">
        <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 sm:justify-between">
          <button
            type="button"
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            disabled={page === 0}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-zyk-brown/10 px-4 font-display text-sm transition-colors hover:bg-zyk-brown/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconChevronLeft size={19} /> Previous
          </button>
          <p className="font-body text-sm text-zyk-brown/75">
            {page + 1} / {PAGE_COUNT}
          </p>
          <button
            type="button"
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            disabled={page === PAGE_COUNT - 1}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-zyk-brown/10 px-4 font-display text-sm transition-colors hover:bg-zyk-brown/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next <IconChevronRight size={19} />
          </button>
        </div>
        <p className="mt-3 text-center font-body text-xs text-zyk-brown/55">
          Drag or swipe left and right to turn the pages. Press Esc to close.
        </p>
      </footer>
    </motion.div>,
    document.body,
  );
};
