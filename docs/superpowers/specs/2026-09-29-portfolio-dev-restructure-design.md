# Portfolio Architecture & Redesign Specification (Dev & Creative Lab)

**Date:** 2026-09-29  
**Branch:** `dev-portfolio`  
**Status:** Approved  

---

## 1. Executive Summary

This specification defines the structural transformation of the portfolio from a mixed, graphic-design-heavy presentation into a high-impact **Design Engineer / Full-Stack Builder** showcase. 

Software development work is promoted to the primary spotlight directly beneath the Hero, while visual, editorial, and branding works are consolidated into a dedicated **Creative & Visual Lab** (`#gallery` / `#creative`). The magazine flipbook functionality and files are preserved intact. The Hero features synchronized reverse-moving gradient blobs and scroll parallax depth, while the Experience section is upgraded with a polished, animated timeline for all 4 professional roles.

---

## 2. Section Architecture & Flow

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. HERO (#home)                                             │
│    - ZykCoding interactive workspace diorama                │
│    - Dual reverse-animating gradient blobs                  │
│    - Staggered entrance + scroll parallax on intro text     │
├─────────────────────────────────────────────────────────────┤
│ 2. FEATURED ENGINEERING PROJECTS (#projects)               │
│    - Editorial sticky-scroll showcase for top dev builds    │
│    - Lead Project: Rent2Reuse (Mobile marketplace fullstack)│
│    - Architecture summary, stack chips, GitHub & demo links │
├─────────────────────────────────────────────────────────────┤
│ 3. OTHER NOTEWORTHY PROJECTS                                │
│    - Responsive 2-to-3 column compact cards                 │
│    - Quick scan: Title, description, tech stack, repo links │
├─────────────────────────────────────────────────────────────┤
│ 4. CREATIVE & VISUAL LAB (#gallery / #creative)             │
│    - Preserved Flipbook spotlight (School Paper Magazine)   │
│    - Preserved Restoration spotlight (Before/After + video) │
│    - Filterable media grid (Branding, UI/UX, Apparel, Art)  │
├─────────────────────────────────────────────────────────────┤
│ 5. JOURNEY & ABOUT (#journey)                               │
│    - About bio & portrait                                   │
│    - 4-stage animated vertical timeline with scroll spine   │
│    - GDSC Leadership cards                                  │
│    - 6-Category Full-Stack Developer & Design Toolkit       │
├─────────────────────────────────────────────────────────────┤
│ 6. CONTACT (#contact)                                       │
│    - Interactive form + direct email and social links       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Hero Section (`Hero.tsx`)
- **Dual Reverse Gradient Animation:**
  - **Top Blob (Indigo/Violet):** Positioned top-right, translates smoothly **Right &rarr; Left** when `revealed` triggers and the main title moves to its settled position.
  - **Bottom Blob (Cyan/Teal):** Positioned bottom-left, translates smoothly **Left &rarr; Right** simultaneously.
- **Scroll & Parallax Separation:**
  - Uses Framer Motion's `useScroll` and `useTransform` to apply a subtle vertical translation delay to the text column (`Hi, I'm Zyk`, Role typewriter, CTA buttons) relative to the desk illustration (`ZykCoding`), providing authentic depth on scroll.
- **Role Cycle:**
  - Retain cycle: `"Full-Stack Developer"`, `"Mobile App Developer"`, `"Frontend Developer"`.

### 3.2 Featured Projects (`ProjectsSection.tsx`)
- **Primary Showcase:** Focused strictly on software development.
  - **Project 1: Rent2Reuse**
    - *Role:* Full-Stack Developer & UI/UX Designer
    - *Tags:* Mobile App, React Native / Expo, Node.js, Figma, Marketplace
    - *Links:* GitHub repository, Case study modal with screen gallery
- **Removed from Sticky Featured Projects:**
  - *School Paper Magazine* & *Vintage Poster Restoration* are moved to the Creative Lab.
- **"Other Noteworthy Projects" Grid:**
  - Appears right below the sticky project section.
  - Clean glassmorphism cards with folder/code icons, project title, concise description, tech tags, and direct GitHub/external links.

### 3.3 Creative & Visual Lab (`GallerySection.tsx`)
- **Spotlight Showcase (Top):**
  - **School Paper Magazine:** Fully functional flipbook preserved with `SchoolPaperFlipbook.tsx` intact. Card includes "Open Flipbook" interactive action.
  - **Vintage Poster Restoration:** Fully functional before/after comparison and process video modal.
- **Filterable Media Grid (Bottom):**
  - Category filters: `All`, `UI/UX`, `Events & Branding`, `Marketing & Social`, `Print`, `Apparel`, `Illustration`.
  - Retains all existing rich gallery assets (GDSC Innoverse, Subscription Manager UI, Nike Campaign, Lampinig, Dish Menu, Pixel Art).

### 3.4 Journey & Animated Experience Timeline (`ScrollSections.tsx`)
- **Animated Vertical Timeline:**
  - Replace the 2-item fixed horizontal line with an interactive vertical timeline supporting all 4 career milestones:
    1. **Data Annotator Intern** — *Innodata Knowledge Services, Inc.* (Feb 2026 – Apr 2026)
       - *Blurb:* Reviewed and validated image and video datasets according to detailed project guidelines. Investigated inconsistencies while maintaining accuracy, quality, and productivity standards.
       - *Highlights:* `Dataset Validation`, `Image & Video QA`, `Data Integrity`, `Productivity Standards`
    2. **Graphics Artist** — *Upwork / Freelance* (2024 – 2025)
       - *Blurb:* Created digital marketing materials while managing client communication, revisions, deadlines, and high-volume asset delivery.
       - *Highlights:* `Digital Design`, `Client Collaboration`, `Photo Restoration`
    3. **Content Operations Support** — *Project-Based* (Feb 2024 – May 2024)
       - *Blurb:* Processed digital content using internal TTS tools and web-based content management systems. Performed quality checks, verified content accuracy, and resolved discrepancies within structured workflows.
       - *Highlights:* `CMS`, `TTS Tools`, `Content QA`, `Process Workflows`
    4. **Graphics Artist** — *Island Artz Printing and Services* (Aug 2021 – Sep 2023)
       - *Blurb:* Produced marketing collateral, signage, apparel graphics, mockups, and print-ready artwork while coordinating prepress and production.
       - *Highlights:* `Print Design`, `Prepress`, `Product Mockups`, `Production Coordination`
  - **Motion & Visual Spine:**
    - A subtle vertical glowing spine that draws down as the user scrolls.
    - Glowing animated indicator dots corresponding to each role milestone.
    - Alternating or clean left-aligned timeline cards with soft border glow and tag chips.
- **Leadership Experience:**
  - Retain the GDSC CTU leadership cards (UI/UX Lead 2023–2024, Graphics Design Lead 2022–2023).

### 3.5 Developer & Creative Toolkit (`ScrollSections.tsx`)
Structured into 6 distinct, well-organized categories with enhanced badges:
1. **Languages:** JavaScript, TypeScript, Python, Java, C#, C
2. **Frontend:** React, Next.js, React Native (Expo), Vite, HTML5, CSS3, Tailwind CSS, Shadcn UI
3. **Backend & APIs:** Node.js, Flask, RESTful APIs, .NET
4. **Databases:** Firebase / Firestore, MySQL, NoSQL
5. **Developer & AI Tools:** Git, GitHub, VS Code, Claude Code, GitHub Copilot, Antigravity
6. **UI/UX & Creative:** Figma, UI Prototyping, Interface Design, Adobe Photoshop, Illustrator, InDesign, Canva

---

## 4. Non-Breaking Verification & Code Health
- All flipbook and case-study assets and utilities in `public/assets/school-paper/`, `public/assets/image-restoration/`, and `src/components/sections/` remain untouched.
- TypeScript compiler verification via `npm run build` or `npx tsc --noEmit` must pass with zero errors.
- Ensure all anchor links (`#home`, `#projects`, `#gallery`, `#journey`, `#contact`) remain synchronized in `NavBar.tsx`.
