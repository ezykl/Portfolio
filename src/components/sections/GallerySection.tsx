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
  cover: string;
  images: string[];
  videos?: string[];
}

/**
 * All 36 curated works across the 6 design categories.
 * Interspersed for a visually rich "All" collage, while each category filter
 * gathers its complete dedicated set.
 */
const GALLERY_ITEMS: GalleryItem[] = [
  // 1
  {
    title: "GDSC Innoverse",
    category: "Events & Branding",
    cover: "/assets/gallery/events/gdsc-innoverse/1.png",
    images: [
      "/assets/gallery/events/gdsc-innoverse/1.png",
      "/assets/gallery/events/gdsc-innoverse/2.png",
    ],
    videos: ["/assets/gallery/events/gdsc-innoverse/innoverse-vid.mp4"],
  },
  // 2
  {
    title: "Nike Footwear Campaign",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/1-shoes.png",
    images: ["/assets/gallery/marketing-social/1-shoes.png"],
  },
  // 3
  {
    title: "Lampinig T-Shirt Mockup",
    category: "Apparel",
    cover: "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
    images: [
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
    ],
  },
  // 4
  {
    title: "Lofi Study",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/lofi.jpg",
    images: ["/assets/gallery/illustration/pixel-art/lofi.jpg"],
  },
  // 5
  {
    title: "Dish Menu - Course Selection",
    category: "Print Design",
    cover: "/assets/gallery/print/dish-menu/1.jpg",
    images: [
      "/assets/gallery/print/dish-menu/1.jpg",
      "/assets/gallery/print/dish-menu/2.jpg",
    ],
  },
  // 6
  {
    title: "Find Your Phase Campaign",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/2find-your-phase.png",
    images: ["/assets/gallery/marketing-social/2find-your-phase.png"],
  },
  // 7
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
  },
  // 8
  {
    title: "Subscription Manager - Home",
    category: "UI Design",
    cover: "/assets/gallery/ui-design/subscription-manager/home.png",
    images: [
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
    ],
  },
  // 9
  {
    title: "Whispers of Heaven Graphic Tee",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/whispers-of-heaven.jpg",
    images: ["/assets/gallery/apparel/other/whispers-of-heaven.jpg"],
  },
  // 10
  {
    title: "Mini Cooper Pixel Art",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/mini-cooper.jpg",
    images: ["/assets/gallery/illustration/pixel-art/mini-cooper.jpg"],
  },
  // 11
  {
    title: "Rent2Reuse Social Promo",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/3rent2reuse.png",
    images: ["/assets/gallery/marketing-social/3rent2reuse.png"],
  },
  // 12
  {
    title: "GDSC G Workshop",
    category: "Events & Branding",
    cover: "/assets/gallery/events/g-workshop/c-workshop.jpg",
    images: ["/assets/gallery/events/g-workshop/c-workshop.jpg"],
  },
  // 13
  {
    title: "Print Poster (3x4)",
    category: "Print Design",
    cover: "/assets/gallery/print/poster/3x4-poster.png",
    images: ["/assets/gallery/print/poster/3x4-poster.png"],
  },
  // 14
  {
    title: "Timeless Graphic Apparel",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/timeless.jpg",
    images: ["/assets/gallery/apparel/other/timeless.jpg"],
  },
  // 15
  {
    title: "Rizal Park",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/rizal-park.jpg",
    images: ["/assets/gallery/illustration/pixel-art/rizal-park.jpg"],
  },
  // 16
  {
    title: "Social Creative I",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/1a.png",
    images: ["/assets/gallery/marketing-social/1a.png"],
  },
  // 17
  {
    title: "Sinulog Open Ultimate 2026",
    category: "Events & Branding",
    cover: "/assets/gallery/events/sinulog-open/1.png",
    images: [
      "/assets/gallery/events/sinulog-open/1.png",
      "/assets/gallery/events/sinulog-open/2.png",
    ],
  },
  // 18
  {
    title: "Lampinig Graphic Tee Print",
    category: "Apparel",
    cover: "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
    images: [
      "/assets/gallery/apparel/lampinig/lampinig-design-tshirt.jpg",
      "/assets/gallery/apparel/lampinig/lampinig-mockup.jpg",
    ],
  },
  // 19
  {
    title: "Santa Fe Scenery",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/santa-fe.jpg",
    images: ["/assets/gallery/illustration/pixel-art/santa-fe.jpg"],
  },
  // 20
  {
    title: "Social Creative II",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/2a.png",
    images: ["/assets/gallery/marketing-social/2a.png"],
  },
  // 21
  {
    title: "Dish Menu - Complete Layout",
    category: "Print Design",
    cover: "/assets/gallery/print/dish-menu/2.jpg",
    images: [
      "/assets/gallery/print/dish-menu/2.jpg",
      "/assets/gallery/print/dish-menu/1.jpg",
    ],
  },
  // 22
  {
    title: "Rolling Hills",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/hills.jpg",
    images: ["/assets/gallery/illustration/pixel-art/hills.jpg"],
  },
  // 23
  {
    title: "School Paper Adviser Shirt",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/school-paper-adviser.png",
    images: ["/assets/gallery/apparel/other/school-paper-adviser.png"],
  },
  // 24
  {
    title: "Social Creative III",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/3a.png",
    images: ["/assets/gallery/marketing-social/3a.png"],
  },
  // 25
  {
    title: "Retro Music Player",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/musicplayer.jpg",
    images: ["/assets/gallery/illustration/pixel-art/musicplayer.jpg"],
  },
  // 26
  {
    title: "Subscription Manager - Onboarding",
    category: "UI Design",
    cover: "/assets/gallery/ui-design/subscription-manager/getting-started.png",
    images: [
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
    ],
  },
  // 27
  {
    title: "Social Creative IV",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/4a.png",
    images: ["/assets/gallery/marketing-social/4a.png"],
  },
  // 28
  {
    title: "Classic Volkswagen",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/volks.jpg",
    images: ["/assets/gallery/illustration/pixel-art/volks.jpg"],
  },
  // 29
  {
    title: "Streetwear Apparel Mockup",
    category: "Apparel",
    cover: "/assets/gallery/apparel/other/mock-up.jpg",
    images: ["/assets/gallery/apparel/other/mock-up.jpg"],
  },
  // 30
  {
    title: "Moods",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/moods.png",
    images: ["/assets/gallery/illustration/pixel-art/moods.png"],
  },
  // 31
  {
    title: "Social Creative V",
    category: "Marketing & Social",
    cover: "/assets/gallery/marketing-social/5a.png",
    images: ["/assets/gallery/marketing-social/5a.png"],
  },
  // 32
  {
    title: "Peter Pixel Character",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/peter.jpg",
    images: ["/assets/gallery/illustration/pixel-art/peter.jpg"],
  },
  // 33
  {
    title: "Subscription Manager - Plans",
    category: "UI Design",
    cover: "/assets/gallery/ui-design/subscription-manager/subscription.png",
    images: [
      "/assets/gallery/ui-design/subscription-manager/subscription.png",
      "/assets/gallery/ui-design/subscription-manager/home.png",
      "/assets/gallery/ui-design/subscription-manager/getting-started.png",
    ],
  },
  // 34
  {
    title: "Sinulog Open - Tournament Bracket",
    category: "Events & Branding",
    cover: "/assets/gallery/events/sinulog-open/2.png",
    images: [
      "/assets/gallery/events/sinulog-open/2.png",
      "/assets/gallery/events/sinulog-open/1.png",
    ],
  },
  // 35
  {
    title: "Resting Spot",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/restjpg.png",
    images: ["/assets/gallery/illustration/pixel-art/restjpg.png"],
  },
  // 36
  {
    title: "Sailing at Dusk",
    category: "Illustration",
    cover: "/assets/gallery/illustration/pixel-art/sailing.jpg",
    images: ["/assets/gallery/illustration/pixel-art/sailing.jpg"],
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
          illustration work. Select a category or open any piece to view the
          full design.
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

      {/* Masonry collage — natural uncropped sizes with zero vertical gaps */}
      <motion.div
        layout={!reduce}
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((galleryItem) => (
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
                className="group relative block w-full overflow-hidden rounded-2xl bg-zyk-brown/10 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zyk-accent"
              >
                {/* Discrete piece counter for items with multiple images/video */}
                {(galleryItem.images.length > 1 ||
                  (galleryItem.videos?.length ?? 0) > 0) && (
                  <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-zyk-bg-end/30 bg-zyk-brown/85 px-2.5 py-0.5 font-display text-[0.65rem] tracking-wider uppercase text-zyk-bg-end shadow-md backdrop-blur-md transition duration-300 group-hover:opacity-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-zyk-secondary animate-pulse" />
                    {galleryItem.videos?.length
                      ? "Video & Stills"
                      : galleryItem.title.includes("Process")
                        ? `${galleryItem.images.length} Steps`
                        : `${galleryItem.images.length} Views`}
                  </span>
                )}

                <img
                  src={galleryItem.cover}
                  alt={galleryItem.title}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />

                {/* Dark overlay following portfolio theme for high contrast text readability */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#180d07]/95 via-[#180d07]/75 to-[#180d07]/20 p-5 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 translate-y-3 font-display text-[0.68rem] uppercase tracking-[0.22em] text-zyk-secondary font-semibold transition duration-300 group-hover:translate-y-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-zyk-accent" />
                    {galleryItem.category}
                  </span>
                  <span className="mt-1 block translate-y-3 font-display text-lg font-bold leading-snug text-zyk-bg-end drop-shadow-sm transition delay-[25ms] duration-300 group-hover:translate-y-0">
                    {galleryItem.title}
                  </span>
                  <span className="mt-2.5 inline-flex w-fit items-center gap-2 translate-y-3 rounded-full border border-zyk-secondary/40 bg-zyk-brown/90 px-3 py-1 font-display text-[0.72rem] font-medium text-zyk-bg-end shadow-md backdrop-blur-sm transition delay-[50ms] duration-300 group-hover:translate-y-0">
                    <span>
                      {galleryItem.videos?.length
                        ? "Watch & Explore"
                        : galleryItem.title.includes("Process")
                          ? "View Process"
                          : galleryItem.images.length > 1
                            ? "View Full Set"
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
