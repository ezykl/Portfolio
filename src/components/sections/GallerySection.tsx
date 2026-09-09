import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Placeholder } from "../ui/Placeholder";

interface GalleryItem {
  title: string;
  category: string;
  art: string;
}

// Replace each placeholder with the matching real portfolio image when the
// final artwork is available. The categories reflect documented experience.
const GALLERY_ITEMS: GalleryItem[] = [
  {
    title: "Marketing Materials",
    category: "Digital Design",
    art: "Add selected social media and digital marketing designs",
  },
  {
    title: "Print Campaigns",
    category: "Print Design",
    art: "Add selected posters, flyers, and tarpaulin designs",
  },
  {
    title: "Signs & Stickers",
    category: "Production Design",
    art: "Add selected signage and sticker artwork",
  },
  {
    title: "Apparel Graphics",
    category: "Merchandise Design",
    art: "Add selected apparel graphics and finished applications",
  },
  {
    title: "Product Mockups",
    category: "Presentation Design",
    art: "Add selected product and merchandise mockups",
  },
  {
    title: "Interfaces & Events",
    category: "UI/UX & Branding",
    art: "Add selected Figma prototypes and GDSC event visuals",
  },
];

export const GallerySection: React.FC = () => {
  const reduce = useReducedMotion() ?? false;

  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

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
          A visual collection of digital, print, production, branding, and
          interface work.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
        }}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {GALLERY_ITEMS.map((galleryItem) => (
          <motion.article
            key={galleryItem.title}
            variants={item}
            className="group overflow-hidden rounded-3xl border border-zyk-brown/10 bg-zyk-bg-end/80 p-4 shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="overflow-hidden rounded-2xl">
              <Placeholder label={galleryItem.art} aspect="4 / 3" />
            </div>
            <p className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-zyk-accent">
              {galleryItem.category}
            </p>
            <h3 className="mt-1 font-display text-xl text-zyk-heading">
              {galleryItem.title}
            </h3>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};
