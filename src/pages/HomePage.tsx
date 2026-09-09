import React from "react";
import { Hero } from "../components/Hero/Hero";
import { ProjectsSection } from "../components/sections/ProjectsSection";
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
  <main className="bg-linear-to-b from-[#f2bf83] to-[#fef5eb]">
    <Hero revealed={revealed} />
    <ProjectsSection />
    <JourneySection />
    <ContactSection />
  </main>
);
