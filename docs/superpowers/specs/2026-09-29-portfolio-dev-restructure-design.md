# Portfolio Architecture & Redesign Specification (Dev & Creative Lab)

**Date:** 2026-09-29  
**Branch:** `dev-portfolio`  
**Status:** Approved  

---

## 1. Executive Summary

This specification defines the structural and visual transformation of the portfolio from a mixed, graphic-design-heavy presentation into a high-impact, cohesive **Design Engineer / Full-Stack Builder** showcase. 

Software development work is promoted to the primary spotlight directly beneath the Hero, while visual, editorial, and branding works are consolidated into a dedicated **Creative & Visual Lab** (`#gallery` / `#creative`). The magazine flipbook functionality and files are preserved intact. 

Crucially, the **visual atmosphere of the Hero** (deep `#020617` canvas, subtle engineering grid lines, glowing ambient radial lighting, crisp glassmorphic surfaces, and terminal-style typography) is extended across the entire application to eliminate the existing theme disconnect and create an unbroken, premium developer experience.

---

## 2. Visual Design System & Atmospheric Continuity

### 2.1 Canvas & Ambient Lighting
- **Global Canvas:** Replace the muddy `--color-zyk-bg-start: #252E3D` in `HomePage.tsx` and `index.css` with a seamless `#020617` base throughout the entire page.
- **Continuous Engineering Grid:** Extend the subtle repeating developer grid pattern (`rgba(148, 163, 184, 0.04) 24px grid`) down the entire scroll container so sections feel integrated rather than isolated boxes.
- **Atmospheric Ambient Glows:** Place soft, performant radial lighting behind each chapter:
  - **Hero:** Synchronized Indigo (`rgba(99, 102, 241, 0.20)`) & Cyan (`rgba(34, 211, 238, 0.16)`) reverse-moving blobs.
  - **Featured Work:** Indigo accent glow on the sticky preview frame.
  - **Creative Lab:** Violet / Fuchsia ambient glow (`rgba(168, 85, 247, 0.14)`) signaling creative expression.
  - **Journey / Timeline:** Cyan glow behind the experience spine.
  - **Contact:** Soft ambient floor glow framing the contact card.

### 2.2 Glassmorphism & Elevation
- **Card Surfaces:** Standardized across all sections to `bg-slate-900/60 backdrop-blur-md border border-slate-800/80`.
- **Interactive Micro-Glow:** `hover:border-zyk-accent/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.12)]` with smooth 250ms transitions.
- **Typography & Eyebrows:**
  - Section indexes formatted in `JetBrains Mono`: `// 01. FEATURED WORK`, `// 02. OTHER BUILDS`, `// 03. CREATIVE & VISUAL LAB`, `// 04. JOURNEY & TIMELINE`, `// 05. CONTACT`.
  - Section headings use high-contrast white text with subtle metallic gradients (`from-white via-slate-100 to-slate-400`).

---

## 3. Section Architecture & Flow

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. HERO (#home)                                             │
│    - ZykCoding interactive workspace diorama                │
│    - Dual reverse-animating gradient blobs (Top R→L, Btm L→R│
│    - Staggered entrance + scroll parallax on intro text     │
├─────────────────────────────────────────────────────────────┤
│ 2. FEATURED ENGINEERING PROJECTS (#projects)               │
│    - Editorial sticky-scroll showcase for top dev builds    │
│    - Lead Project: Rent2Reuse (Mobile marketplace fullstack)│
│    - Architecture summary, stack chips, GitHub & demo links │
├─────────────────────────────────────────────────────────────┤
│ 3. OTHER NOTEWORTHY PROJECTS                                │
│    - Responsive 2-to-3 column compact glass cards           │
│    - Quick scan: Title, description, tech stack, repo links │
├─────────────────────────────────────────────────────────────┤
│ 4. CREATIVE & VISUAL LAB (#gallery / #creative)             │
│    - Preserved Flipbook spotlight (School Paper Magazine)   │
│    - Preserved Restoration spotlight (Before/After + video) │
│    - Filterable media grid (Branding, UI/UX, Apparel, Art)  │
├─────────────────────────────────────────────────────────────┤
│ 5. JOURNEY & ABOUT (#journey)                               │
│    - About bio & portrait with glowing backdrop             │
│    - 4-stage animated vertical timeline with scroll spine   │
│    - GDSC Leadership cards                                  │
│    - 6-Category Full-Stack Developer & Design Toolkit       │
├─────────────────────────────────────────────────────────────┤
│ 6. CONTACT (#contact)                                       │
│    - Glassmorphic form + direct email and social links      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Component Specifications

### 4.1 Hero Section (`Hero.tsx`)
- **Dual Reverse Gradient Animation:**
  - **Top Blob (Indigo):** Positioned top-right, translates smoothly **Right &rarr; Left** when `revealed` triggers and the main title moves to its settled position.
  - **Bottom Blob (Cyan):** Positioned bottom-left, translates smoothly **Left &rarr; Right** simultaneously.
- **Scroll & Parallax Separation:**
  - Uses Framer Motion's `useScroll` and `useTransform` to apply a subtle vertical translation delay to the text column (`Hi, I'm Zyk`, Role typewriter, CTA buttons) relative to the desk illustration (`ZykCoding`), providing authentic depth on scroll.
- **Role Cycle:**
  - Retain cycle: `"Full-Stack Developer"`, `"Mobile App Developer"`, `"Frontend Developer"`.

### 4.2 Featured Projects & Other Builds (`ProjectsSection.tsx`)
- **Primary Sticky Showcase:**
  - **Project 1: Rent2Reuse**
    - *Role:* Full-Stack Developer & UI/UX Designer
    - *Tags:* Mobile App, React Native / Expo, Node.js, Figma, Marketplace
    - *Links:* GitHub repository, Case study modal with screen gallery
- **Removed from Sticky Featured Projects:**
  - *School Paper Magazine* & *Vintage Poster Restoration* are relocated to the Creative Lab.
- **"Other Noteworthy Projects" Grid:**
  - Placed immediately below the sticky showcase.
  - 2-to-3 column responsive grid of glassmorphic cards:
    - Top row: Folder / Terminal icon + external GitHub and Live Demo links.
    - Title & 2-sentence description of technical architecture / problem solved.
    - Bottom row: Monospace tech tags (e.g. `React`, `TypeScript`, `Firebase`, `REST API`).

### 4.3 Creative & Visual Lab (`GallerySection.tsx`)
- **Visual Identity:** Dedicated section for all graphic design, print, branding, and illustration.
- **Spotlight Showcase (Top):**
  - **School Paper Magazine:** Dedicated card that opens the interactive 12-page **Flipbook modal**. (`SchoolPaperFlipbook.tsx` intact).
  - **Vintage Poster Restoration:** Dedicated card featuring the interactive **Before/After slider** and **Process video**.
- **Filterable Media Grid (Bottom):**
  - Category filters: `All`, `UI/UX`, `Events & Branding`, `Marketing & Social`, `Print`, `Apparel`, `Illustration`.
  - Retains all existing rich gallery assets (GDSC Innoverse, Subscription Manager UI, Nike Campaign, Lampinig, Dish Menu, Pixel Art) with updated dark glassmorphism card skins.

### 4.4 Journey & Animated Experience Timeline (`ScrollSections.tsx`)
- **Animated Vertical Timeline:**
  - A central or left-aligned glowing SVG spine that draws downwards as the section enters the viewport.
  - Glowing node rings for each milestone.
  - 4 Chronological Work Experiences:
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
- **Leadership Experience:**
  - Retain GDSC CTU leadership cards (UI/UX Lead 2023–2024, Graphics Design Lead 2022–2023) styled with dark glassmorphism.

### 4.5 Developer & Creative Toolkit (`ScrollSections.tsx`)
Structured into 6 distinct, well-organized categories with enhanced badges:
1. **Languages:** JavaScript, TypeScript, Python, Java, C#, C
2. **Frontend:** React, Next.js, React Native (Expo), Vite, HTML5, CSS3, Tailwind CSS, Shadcn UI
3. **Backend & APIs:** Node.js, Flask, RESTful APIs, .NET
4. **Databases:** Firebase / Firestore, MySQL, NoSQL
5. **Developer & AI Tools:** Git, GitHub, VS Code, Claude Code, GitHub Copilot, Antigravity
6. **UI/UX & Creative:** Figma, UI Prototyping, Interface Design, Adobe Photoshop, Illustrator, InDesign, Canva

---

## 5. Non-Breaking Verification & Code Health
- All flipbook and case-study assets and utilities in `public/assets/school-paper/`, `public/assets/image-restoration/`, and `src/components/sections/` remain untouched.
- TypeScript compiler verification via `npm run build` or `npx tsc --noEmit` must pass with zero errors.
- Ensure all anchor links (`#home`, `#projects`, `#gallery`, `#journey`, `#contact`) remain synchronized in `NavBar.tsx`.
