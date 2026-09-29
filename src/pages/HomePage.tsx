import React from "react";
import { Hero } from "../components/Hero/Hero";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { GallerySection } from "../components/sections/GallerySection";
import {
  JourneySection,
  ContactSection,
} from "../components/sections/ScrollSections";

interface HomePageProps {
  revealed?: boolean;
}

/**
 * The single long-scrolling page (§3): the AllScene Hero followed by the
 * content sections the NavBar anchors into. Each section is fully independent
 * (not sharing a wrapper) so it's free to define its own internal layout and
 * scroll behavior — e.g. Projects' own scroll-driven case-study mechanism —
 * without being entangled with its neighbors.
 */
export const HomePage: React.FC<HomePageProps> = ({ revealed }) => (
  <main
    className="relative min-h-screen bg-[#020617] text-zyk-heading selection:bg-zyk-primary/30 selection:text-white"
    style={{
      backgroundImage: [
        "repeating-linear-gradient(0deg, rgba(148,163,184,0.03) 0px, rgba(148,163,184,0.03) 1px, transparent 1px, transparent 24px)",
        "repeating-linear-gradient(90deg, rgba(148,163,184,0.03) 0px, rgba(148,163,184,0.03) 1px, transparent 1px, transparent 24px)",
      ].join(", "),
    }}
  >
    <Hero revealed={revealed} />
    <ProjectsSection />
    <GallerySection />
    <JourneySection />
    <ContactSection />
  </main>
);
