import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageProjectPreview } from "./ImageProjectPreview";

type GalleryCategory =
  | "Marketing & Social"
  | "Events & Branding"
  | "Print Design"
  | "Apparel"
  | "UI Design"
  | "Illustration";

interface GalleryItem {
  title: string;
  category: GalleryCategory;
  /** Single image shown on the card when `previewImages` is not set. */
  cover: string;
  /**
   * When provided, shows a 2×2 mini-collage of these four images on the card
   * instead of a single cover — ideal for collections with strong variety.
   */
  previewImages?: [string, string, string, string];
  images: string[];
  videos?: string[];
  /**
   * Grid span hint for the collage layout.
   *   wide       → 2 columns, 1 row — landscape / horizontal compositions
   *   tall       → 1 column, 2 rows  — portrait / vertical compositions
   *   collection → 2 columns, 2 rows — multi-image showcases with ample breathing room
   *   standard   → 1 column, 1 row  — default
   */
  size?: "standard" | "wide" | "tall" | "collection";
}

/**
 * 10 curated gallery cards across 6 categories.
 *
 * Apparel is a single merged card (Lampinig + other pieces) shown as a
 * 2×2 preview so the variety is immediately visible.
 * Marketing & Social and Pixel Art also use 2×2 previews for the same reason.
 */
const GALLERY_ITEMS: GalleryItem[] = [
  // ── Events & Branding ──────────────────────────────────────────────────
  {
    title: "GDSC Innoverse",
    category: "Events & Branding",
    cover: "/assets/gallery/events/gdsc-innoverse/1.png",
    images: [
      "/assets/gallery/events/gdsc-innoverse/1.png",
      "/assets/gallery/events/gdsc-innoverse/2.png",
    ],
    videos: ["/assets/gallery/events/gdsc-innoverse/innoverse-vid.mp4"],
    size: "wide",
  },
  {
    title: "GDSC G Workshop",
    category: "Events & Branding",
    cover: "/assets/gallery/events/g-workshop/c-workshop.jpg",
    images: ["/assets/gallery/events/g-workshop/c-workshop.jpg"],
    size: "standard",
  },
  {
    title: "Sinulog Open Ultimate 2026",
    category: "Events & Branding",
    cover: "/assets/gallery/events/sinulog-open/1.png",
    images: [
      "/assets/gallery/events/sinulog-open/1.png",
      "/assets/gallery/events/sinulog-open/2.png",
    ],
    size: "standard",
  },

  // ── Marketing & Social ─────────────────────────────────────────────────
  {
    title: "Marketing & Social Collection",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/1-shoes.png",
    previewImages: [
      "/assets/gallery/marketing-social/1-shoes.png",
      "/assets/gallery/marketing-social/2a.png",
      "/assets/gallery/marketing-social/4a.png",
      "/assets/gallery/marketing-social/5a.png",
    ],
    images: [
      "/assets/gallery/marketing-social/1-shoes.png",
      "/assets/gallery/marketing-social/1a.png",
      "/assets/gallery/marketing-social/2a.png",
      "/assets/gallery/marketing-social/2find-your-phase.png",
      "/assets/gallery/marketing-social/3a.png",
      "/assets/gallery/marketing-social/3rent2reuse.png",
      "/assets/gallery/marketing-social/4a.png",
      "/assets/gallery/marketing-social/5a.png",
    ],
    size: "collection",
  },

  // ── Print Design ───────────────────────────────────────────────────────
  {
    title: "Dish Menu Design",
    category: "Print Design",
    cover: "/assets/gallery/print/dish-menu/1.jpg",
    images: [
      "/assets/gallery/print/dish-menu/1.jpg",
      "/assets/gallery/print/dish-menu/2.jpg",
    ],
    size: "tall",
  },
  {
    title: "Print Poster",
    category: "Print Design",
    cover: "/assets/gallery/print/poster/3x4-poster.png",
    images: ["/assets/gallery/print/poster/3x4-poster.png"],
    size: "standard",
  },

  // ── Apparel (merged into one card) ────────────────────────────────────
  {
    title: "Apparel Collection",
    category: "Apparel",
    cover: "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
    previewImages: [
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
      "/assets/gallery/apparel/other/timeless.jpg",
      "/assets/gallery/apparel/other/whispers-of-heaven.jpg",
    ],
    images: [
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
      "/assets/gallery/apparel/other/timeless.jpg",
      "/assets/gallery/apparel/other/whispers-of-heaven.jpg",
      "/assets/gallery/apparel/other/school-paper-adviser.png",
      "/assets/gallery/apparel/other/mock-up.jpg",
    ],
    size: "collection",
  },

  // ── UI Design ──────────────────────────────────────────────────────────
  {
    title: "Subscription Manager UI",
    category: "UI Design",
    cover: "/assets/gallery/ui-design/subscription-manager/home.png",
    images: [
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
    ],
    size: "tall",
  },

  // ── Illustration ───────────────────────────────────────────────────────
  {
    title: "Pixel Art Collection",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/lofi.jpg",
    previewImages: [
      "/assets/gallery/illustration/pixel-art/lofi.jpg",
      "/assets/gallery/illustration/pixel-art/mini-cooper.jpg",
      "/assets/gallery/illustration/pixel-art/musicplayer.jpg",
      "/assets/gallery/illustration/pixel-art/sailing.jpg",
    ],
    images: [
      "/assets/gallery/illustration/pixel-art/lofi.jpg",
      "/assets/gallery/illustration/pixel-art/hills.jpg",
      "/assets/gallery/illustration/pixel-art/mini-cooper.jpg",
      "/assets/gallery/illustration/pixel-art/moods.png",
      "/assets/gallery/illustration/pixel-art/musicplayer.jpg",
      "/assets/gallery/illustration/pixel-art/peter.jpg",
      "/assets/gallery/illustration/pixel-art/restjpg.png",
      "/assets/gallery/illustration/pixel-art/rizal-park.jpg",
      "/assets/gallery/illustration/pixel-art/sailing.jpg",
      "/assets/gallery/illustration/pixel-art/santa-fe.jpg",
      "/assets/gallery/illustration/pixel-art/volks.jpg",
    ],
    size: "collection",
  },
  {
    title: "Mouse Digital Art Process",
    category: "Illustration",
    cover: "/assets/gallery/illustration/mouse-digital-art/6.png",
    images: [
      "/assets/gallery/illustration/mouse-digital-art/01base.png",
      "/assets/gallery/illustration/mouse-digital-art/0stroke.png",
      "/assets/gallery/illustration/mouse-digital-art/1.png",
      "/assets/gallery/illustration/mouse-digital-art/2.png",
      "/assets/gallery/illustration/mouse-digital-art/3.png",
      "/assets/gallery/illustration/mouse-digital-art/4.png",
      "/assets/gallery/illustration/mouse-digital-art/5.png",
      "/assets/gallery/illustration/mouse-digital-art/6.png",
    ],
    size: "tall",
  },
];

const FILTERS: Array<"All" | GalleryCategory> = [
  "All",
  "Events & Branding",
  "Marketing & Social",
  "Print Design",
  "Apparel",
  "UI Design",
  "Illustration",
];

const SIZE_CLASS: Record<NonNullable<GalleryItem["size"]>, string> = {
  standard: "col-span-1 row-span-1",
  wide: "col-span-1 sm:col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  collection: "col-span-1 sm:col-span-2 row-span-2",
};

export const GallerySection: React.FC = () => {
  const reduce = useReducedMotion() ?? false;
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(
    null,
  );

  const visibleItems =
    filter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <section
      id="gallery"
      style={{ scrollMarginTop: "var(--nav-height, 5rem)" }}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <p className="font-display text-sm uppercase tracking-widest text-zyk-accent">
          A closer look
        </p>
        <h2 className="mt-2 font-display text-4xl text-zyk-heading md:text-5xl">
          Design Gallery
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-zyk-brown/80">
          A curated collection of campaign, print, apparel, interface, and
          illustration work. Select a category or open a piece to explore its
          full set.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.1 }}
        className="mt-8 flex flex-wrap gap-2"
        aria-label="Filter design gallery"
      >
        {FILTERS.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={`rounded-full px-4 py-2 font-display text-xs transition-colors sm:text-sm ${
                active
                  ? "bg-zyk-brown text-zyk-bg-end"
                  : "bg-zyk-secondary/35 text-zyk-heading hover:bg-zyk-secondary/60"
              }`}
            >
              {option}
            </button>
          );
        })}
      </motion.div>

      {/* Collage grid — natural varied spans with dense packing so no big gaps */}
      <motion.div
        layout={!reduce}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[230px] sm:auto-rows-[250px] grid-flow-dense"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((galleryItem) => (
            <motion.article
              layout={!reduce}
              key={galleryItem.title}
              initial={reduce ? false : { opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className={SIZE_CLASS[galleryItem.size ?? "standard"]}
            >
              <button
                type="button"
                onClick={() => setSelectedItem(galleryItem)}
                aria-label={`View ${galleryItem.title}`}
                className="group relative h-full w-full overflow-hidden rounded-[1.75rem] text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zyk-accent"
              >
                {/* Rest badge for multi-image collections */}
                {galleryItem.previewImages && (
                  <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-zyk-bg-end/30 bg-zyk-brown/85 px-3 py-1 font-display text-[0.68rem] tracking-wider uppercase text-zyk-bg-end shadow-md backdrop-blur-md transition duration-300 group-hover:opacity-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-zyk-secondary animate-pulse" />
                    {galleryItem.images.length} Pieces
                  </span>
                )}

                {/* Card visual — single cover or spacious 2×2 mini-collage */}
                {galleryItem.previewImages ? (
                  <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5 bg-zyk-brown/25 p-1.5">
                    {galleryItem.previewImages.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        className="relative overflow-hidden rounded-xl bg-zyk-brown/10"
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={galleryItem.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                )}

                {/* Dark overlay following portfolio theme for high contrast text readability */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#180d07]/95 via-[#180d07]/80 to-[#180d07]/35 p-5 sm:p-6 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 translate-y-3 font-display text-[0.7rem] uppercase tracking-[0.22em] text-zyk-secondary font-semibold transition duration-300 group-hover:translate-y-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-zyk-accent" />
                    {galleryItem.category}
                  </span>
                  <span className="mt-1.5 block translate-y-3 font-display text-xl sm:text-2xl font-bold leading-snug text-zyk-bg-end drop-shadow-sm transition delay-[30ms] duration-300 group-hover:translate-y-0">
                    {galleryItem.title}
                  </span>
                  <span className="mt-3.5 inline-flex w-fit items-center gap-2 translate-y-3 rounded-full border border-zyk-secondary/40 bg-zyk-brown/90 px-3.5 py-1.5 font-display text-xs font-medium text-zyk-bg-end shadow-md backdrop-blur-sm transition delay-[60ms] duration-300 group-hover:translate-y-0">
                    <span>
                      {galleryItem.previewImages ||
                      galleryItem.images.length > 1
                        ? `${galleryItem.images.length} designs · View collection`
                        : "View design"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-zyk-secondary font-bold"
                    >
                      →
                    </span>
                  </span>
                </span>
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <ImageProjectPreview
        open={selectedItem !== null}
        title={selectedItem?.title ?? "Gallery preview"}
        images={selectedItem?.images ?? []}
        videos={selectedItem?.videos ?? []}
        imageAlt={selectedItem?.title ?? "Gallery design"}
        eyebrow="Design Gallery"
        mediaLayout="gallery"
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};

