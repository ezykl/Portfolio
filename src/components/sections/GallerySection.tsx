import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ImageProjectPreview,
  type ImagePreviewContext,
} from "./ImageProjectPreview";

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
  cover: string;
  previewLayout?: "2x2" | "3-cols" | "side-by-side";
  previewImages?: string[];
  images: string[];
  videos?: string[];
  badgeText?: string;
  context?: ImagePreviewContext;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // 1: Event with video
  {
    title: "GDSC Innoverse",
    category: "Events & Branding",
    cover: "/assets/gallery/events/gdsc-innoverse/1.png",
    images: [
      "/assets/gallery/events/gdsc-innoverse/1.png",
      "/assets/gallery/events/gdsc-innoverse/2.png",
    ],
    videos: ["/assets/gallery/events/gdsc-innoverse/innoverse-vid.mp4"],
    badgeText: "▶ Video",
  },
  // 2: Marketing single
  {
    title: "Nike Footwear Campaign",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/1-shoes.png",
    images: ["/assets/gallery/marketing-social/1-shoes.png"],
  },
  // 3: UI Design - 3 mobile screens side-by-side
  {
    title: "Subscription Manager UI",
    category: "UI Design",
    cover: "/assets/gallery/ui-design/subscription-manager/home.png",
    previewLayout: "3-cols",
    previewImages: [
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
    ],
    images: [
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
    ],
    badgeText: "3 Screens",
  },
  // 4: Apparel mockup
  {
    title: "Lampinig T-Shirt Mockup",
    category: "Apparel",
    cover: "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
    images: [
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
    ],
  },
  // 5: Print Design - Dish Menu 2 pages side-by-side
  {
    title: "Dish Menu Design",
    category: "Print Design",
    cover: "/assets/gallery/print/dish-menu/1.jpg",
    previewLayout: "side-by-side",
    previewImages: [
      "/assets/gallery/print/dish-menu/1.jpg",
      "/assets/gallery/print/dish-menu/2.jpg",
    ],
    images: [
      "/assets/gallery/print/dish-menu/1.jpg",
      "/assets/gallery/print/dish-menu/2.jpg",
    ],
    badgeText: "2 Pages",
  },
  // 6: Pixel Art - 11 pieces in 1 container with 2x2 preview
  {
    title: "Pixel Art Collection",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/lofi.jpg",
    previewLayout: "2x2",
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
    badgeText: "11 Pieces",
  },
  // 7: Marketing single
  {
    title: "Find Your Phase Campaign",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/2find-your-phase.png",
    images: ["/assets/gallery/marketing-social/2find-your-phase.png"],
  },
  // 8: Illustration - Curated mouse painting progression
  {
    title: "Mouse Digital Art Process",
    category: "Illustration",
    cover: "/assets/gallery/illustration/mouse-digital-art/5.png",
    images: [
      "/assets/gallery/illustration/mouse-digital-art/0stroke.png",
      "/assets/gallery/illustration/mouse-digital-art/01base.png",
      "/assets/gallery/illustration/mouse-digital-art/1.png",
      "/assets/gallery/illustration/mouse-digital-art/2.png",
      "/assets/gallery/illustration/mouse-digital-art/4.png",
      "/assets/gallery/illustration/mouse-digital-art/6.png",
    ],
    badgeText: "6 Stages",
    context: {
      eyebrow: "Digital Illustration",
      summary:
        "A 2019 digital artwork created entirely with a standard optical computer mouse — without any graphics tablet, stylus, or drawing pen. Completed over 1 week of dedicated hand-drawn mousework.",
      role: "Digital Artist",
      note: "Crafted in 2019 using optical mouse clicks and bezier control in Photoshop. Took 1 week of precision work to complete.",
      facts: [
        { label: "Year", value: "2019" },
        { label: "Input Device", value: "Optical Mouse Only" },
        { label: "Timeframe", value: "1 Week" },
        { label: "Milestones", value: "Stroke, Base, Adding Details, Light & Shadow, Refinement, Final Touches" },
      ],
      imageHeading: "Curated Creation Progression",
      imageDescription:
        "Selected milestone stages showing the full evolution: initial stroke linework, base color blocking, secondary shading, and final lighting render.",
    },
  },
  // 9: Apparel single
  {
    title: "Timeless Graphic Apparel",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/timeless.jpg",
    images: ["/assets/gallery/apparel/other/timeless.jpg"],
  },
  // 10: Event single
  {
    title: "Sinulog Open Ultimate 2026",
    category: "Events & Branding",
    cover: "/assets/gallery/events/sinulog-open/1.png",
    images: [
      "/assets/gallery/events/sinulog-open/1.png",
      "/assets/gallery/events/sinulog-open/2.png",
    ],
    badgeText: "2 Views",
  },
  // 11: Marketing 1a-5a series container with 2x2 preview
  {
    title: "Brand Social Media Series",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/1a.png",
    previewLayout: "2x2",
    previewImages: [
      "/assets/gallery/marketing-social/1a.png",
      "/assets/gallery/marketing-social/2a.png",
      "/assets/gallery/marketing-social/3a.png",
      "/assets/gallery/marketing-social/4a.png",
    ],
    images: [
      "/assets/gallery/marketing-social/1a.png",
      "/assets/gallery/marketing-social/2a.png",
      "/assets/gallery/marketing-social/3a.png",
      "/assets/gallery/marketing-social/4a.png",
      "/assets/gallery/marketing-social/5a.png",
    ],
    badgeText: "5 Posts",
  },
  // 12: Print Poster
  {
    title: "Print Poster (3x4)",
    category: "Print Design",
    cover: "/assets/gallery/print/poster/3x4-poster.png",
    images: ["/assets/gallery/print/poster/3x4-poster.png"],
  },
  // 13: Apparel single
  {
    title: "Whispers of Heaven T-Shirt",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/whispers-of-heaven.jpg",
    images: ["/assets/gallery/apparel/other/whispers-of-heaven.jpg"],
  },
  // 14: Event single
  {
    title: "GDSC G Workshop",
    category: "Events & Branding",
    cover: "/assets/gallery/events/g-workshop/c-workshop.jpg",
    images: ["/assets/gallery/events/g-workshop/c-workshop.jpg"],
  },
  // 15: Marketing single
  {
    title: "Rent2Reuse Social Promo",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/3rent2reuse.png",
    images: ["/assets/gallery/marketing-social/3rent2reuse.png"],
  },
  // 16: Apparel graphic print
  {
    title: "Lampinig Graphic Tee Print",
    category: "Apparel",
    cover: "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
    images: [
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
    ],
  },
  // 17: Apparel mockup
  {
    title: "Streetwear Apparel Mockup",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/mock-up.jpg",
    images: ["/assets/gallery/apparel/other/mock-up.jpg"],
  },
  // 18: Apparel single
  {
    title: "School Paper Adviser Shirt",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/school-paper-adviser.png",
    images: ["/assets/gallery/apparel/other/school-paper-adviser.png"],
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

const getBadgeLabel = (item: GalleryItem): string | null => {
  if (item.badgeText) return item.badgeText;
  if ((item.videos?.length ?? 0) > 0) return "▶ Video";
  if (item.title.includes("Process")) return `${item.images.length} Steps`;
  if (item.images.length > 1) return `${item.images.length} Pieces`;
  return null;
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
          illustration work. Select a category or open any project to view the
          full showcase.
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

      {/* Masonry collage — balanced 1 to 4 columns, tight zero-gap flow */}
      <motion.div
        layout={!reduce}
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((galleryItem) => {
            const badge = getBadgeLabel(galleryItem);
            return (
              <motion.article
                layout={!reduce}
                key={galleryItem.cover}
                initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setSelectedItem(galleryItem)}
                  aria-label={`View ${galleryItem.title}`}
                  className="group relative block w-full overflow-hidden rounded-2xl bg-zyk-brown/15 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zyk-accent"
                >
                  {/* Clean corner badge */}
                  {badge && (
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-zyk-bg-end/30 bg-zyk-brown/90 px-2.5 py-0.5 font-display text-[0.62rem] tracking-wider uppercase text-zyk-bg-end shadow-md backdrop-blur-md transition duration-300 group-hover:opacity-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-zyk-secondary animate-pulse" />
                      {badge}
                    </span>
                  )}

                  {/* Multi-image preview containers with individual corner radius on each child tile */}
                  {galleryItem.previewLayout === "3-cols" &&
                  galleryItem.previewImages ? (
                    <div
                      style={{ display: "flex", flexDirection: "row", width: "100%" }}
                      className="flex w-full flex-row items-stretch gap-1.5 bg-zyk-brown/15 p-1.5"
                    >
                      {galleryItem.previewImages.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          style={{ flex: "1 1 0%", minWidth: 0, aspectRatio: "9/19" }}
                          className="relative flex-1 min-w-0 overflow-hidden rounded-xl bg-zyk-brown/10 shadow-sm"
                        >
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                      ))}
                    </div>
                  ) : galleryItem.previewLayout === "side-by-side" &&
                    galleryItem.previewImages ? (
                    <div
                      style={{ display: "flex", flexDirection: "row", width: "100%" }}
                      className="flex w-full flex-row items-stretch gap-1.5 bg-zyk-brown/15 p-1.5"
                    >
                      {galleryItem.previewImages.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          style={{ flex: "1 1 0%", minWidth: 0, aspectRatio: "3/4" }}
                          className="relative flex-1 min-w-0 overflow-hidden rounded-xl bg-zyk-brown/10 shadow-sm"
                        >
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                      ))}
                    </div>
                  ) : galleryItem.previewLayout === "2x2" &&
                    galleryItem.previewImages ? (
                    <div
                      style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", aspectRatio: "1/1", width: "100%" }}
                      className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-1.5 bg-zyk-brown/15 p-1.5"
                    >
                      {galleryItem.previewImages.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          className="relative h-full w-full overflow-hidden rounded-xl bg-zyk-brown/10 shadow-sm"
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
                      alt={galleryItem.title}
                      loading="lazy"
                      decoding="async"
                      className="block max-h-[380px] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                    />
                  )}

                  {/* Dark overlay following portfolio theme for high contrast text readability */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#140a05]/95 via-[#140a05]/75 to-[#140a05]/20 p-4 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-5"
                  >
                    <span className="inline-flex items-center gap-1.5 translate-y-2 font-display text-[0.65rem] uppercase tracking-[0.2em] text-zyk-secondary font-semibold transition duration-300 group-hover:translate-y-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-zyk-accent" />
                      {galleryItem.category}
                    </span>
                    <span className="mt-1 block translate-y-2 font-display text-base sm:text-lg font-bold leading-snug text-zyk-bg-end drop-shadow-sm transition delay-[20ms] duration-300 group-hover:translate-y-0 line-clamp-2">
                      {galleryItem.title}
                    </span>
                    <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 translate-y-2 rounded-full border border-zyk-secondary/40 bg-zyk-brown/90 px-3 py-1 font-display text-[0.7rem] font-medium text-zyk-bg-end shadow-md backdrop-blur-sm transition delay-[40ms] duration-300 group-hover:translate-y-0 group-hover:border-zyk-secondary">
                      <span>
                        {(galleryItem.videos?.length ?? 0) > 0
                          ? "Watch Video & Gallery"
                          : galleryItem.title.includes("Process")
                            ? "View Process"
                            : galleryItem.images.length > 1
                              ? `View Collection (${galleryItem.images.length})`
                              : "View Design"}
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
            );
          })}
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
        context={selectedItem?.context}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};
