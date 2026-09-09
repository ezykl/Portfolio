import React from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { useReducedMotion } from "framer-motion";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconZoomIn,
  IconZoomOut,
  IconX,
} from "@tabler/icons-react";

const PAGE_COUNT = 12;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.2;
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
  const [zoom, setZoom] = React.useState(1);

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
      if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP));
      }
      if (event.key === "-") {
        setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP));
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  React.useEffect(() => {
    if (open) {
      setPage(0);
      setZoom(1);
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      id="school-paper-flipbook"
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-paper-title"
      className="fixed inset-0 z-[200] flex flex-col bg-zyk-brown/95 p-3 text-zyk-bg-end backdrop-blur-sm sm:p-6"
    >
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

      <div className="min-h-0 flex-1 overflow-auto py-4">
        <div
          className="flex min-h-full min-w-full items-center justify-center p-3 transition-[width,height] duration-200"
          style={{
            width: `${Math.max(100, zoom * 100)}%`,
            height: `${Math.max(100, zoom * 100)}%`,
          }}
        >
          <div
            className="transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <HTMLFlipBook
              ref={bookRef}
              className="school-paper-book"
              style={{}}
              startPage={0}
              size="stretch"
              width={420}
              height={594}
              minWidth={260}
              maxWidth={430}
              minHeight={368}
              maxHeight={608}
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
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 sm:justify-between">
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          disabled={page === 0}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-zyk-bg-end/10 px-4 font-display text-sm transition-colors hover:bg-zyk-bg-end/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <IconChevronLeft size={19} /> Previous
        </button>
        <p className="font-body text-sm text-zyk-bg-end/75">
          {page + 1} / {PAGE_COUNT}
        </p>
        <div className="flex items-center rounded-full bg-zyk-bg-end/10">
          <button
            type="button"
            onClick={() =>
              setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))
            }
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-zyk-bg-end/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconZoomOut size={19} />
          </button>
          <span className="min-w-14 text-center font-body text-xs text-zyk-bg-end/75">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() =>
              setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))
            }
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-zyk-bg-end/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconZoomIn size={19} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          disabled={page === PAGE_COUNT - 1}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-zyk-bg-end/10 px-4 font-display text-sm transition-colors hover:bg-zyk-bg-end/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next <IconChevronRight size={19} />
        </button>
      </div>
      <p className="mt-3 text-center font-body text-xs text-zyk-bg-end/55">
        Drag a page corner, swipe, or use the arrow and +/- keys.
      </p>
    </div>,
    document.body,
  );
};
