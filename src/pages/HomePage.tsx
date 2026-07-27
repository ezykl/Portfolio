import React from "react";
import { Hero } from "../components/Hero/Hero";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import {
  DesignsSection,
  JourneySection,
  ContactSection,
} from "../components/sections/ScrollSections";

interface HomePageProps {
  revealed?: boolean;
}

/**
 * The single long-scrolling page (§3): the AllScene Hero followed by the
 * content sections the NavBar anchors into. Sections are placeholders for now
 * (see ScrollSections), sharing the §2b visual language.
 */
export const HomePage: React.FC<HomePageProps> = ({ revealed }) => (
  <main className="bg-linear-to-b from-[#f2bf83] to-[#fef5eb]">
    <Hero revealed={revealed} />
    <ProjectsSection />
    <DesignsSection />
    <JourneySection />
    <ContactSection />
  </main>
);
