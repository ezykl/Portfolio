# Portfolio Dev Restructure & Aesthetic Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the `dev-portfolio` branch into a cohesive "Design Engineer / Full-Stack Builder" portfolio by leading with software engineering projects, preserving visual design works inside a dedicated Creative & Visual Lab, upgrading the Journey experience into an animated 4-stage vertical timeline with the 6-category tech stack, and unifying the entire website's canvas and cards under the Hero's deep-tech dark aesthetic.

**Architecture:** 
1. Establish a continuous `#020617` canvas with continuous engineering grid and ambient radial glows across `HomePage.tsx` and `index.css`.
2. Upgrade `Hero.tsx` with reverse-translating top/bottom gradient blobs and scroll parallax depth on the intro text.
3. Restructure `ProjectsSection.tsx` to feature dev work (Rent2Reuse) sticky-scroll, followed by an "Other Noteworthy Projects" responsive glass card grid.
4. Preserved `SchoolPaperFlipbook.tsx` and `ImageProjectPreview.tsx` as spotlight case studies at the top of `GallerySection.tsx` alongside the filterable creative media grid.
5. Upgrade `ScrollSections.tsx` with an animated vertical glowing spine timeline for the 4 work experiences and render the complete 6-category tech stack.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, Framer Motion, TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-29-portfolio-dev-restructure-design.md`

## Global Constraints
- Preserve all existing files, assets, and functionality in `public/assets/`, `SchoolPaperFlipbook.tsx`, and `ImageProjectPreview.tsx` without breaking.
- Maintain full TypeScript correctness (`npm run build` or `npx tsc --noEmit` must pass with 0 errors).
- All interactive elements must support `useReducedMotion()`.

---

### Task 1: Global Theme & Canvas Continuity

**Files:**
- Modify: `src/index.css`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: Tailwind v4 `@theme` tokens in `src/index.css`.
- Produces: Seamless `#020617` base and continuous subtle grid background across `<main>`.

- [ ] **Step 1: Update theme tokens in `src/index.css`**
  Set `--color-zyk-bg-start: #020617` and `--color-zyk-bg-end: #0B1120` so the global gradient aligns with the Hero palette.

- [ ] **Step 2: Update `<main>` in `src/pages/HomePage.tsx`**
  Apply continuous developer grid styling and seamless background:
  ```tsx
  <main
    className="relative min-h-screen bg-[#020617] text-zyk-heading"
    style={{
      backgroundImage: [
        "repeating-linear-gradient(0deg, rgba(148,163,184,0.03) 0px, rgba(148,163,184,0.03) 1px, transparent 1px, transparent 24px)",
        "repeating-linear-gradient(90deg, rgba(148,163,184,0.03) 0px, rgba(148,163,184,0.03) 1px, transparent 1px, transparent 24px)",
      ].join(", "),
    }}
  >
  ```

- [ ] **Step 3: Run build verification**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/index.css src/pages/HomePage.tsx
  git commit -m "style: establish continuous deep-tech background and grid across homepage"
  ```

---

### Task 2: Hero Reverse Gradient Blobs & Scroll Parallax

**Files:**
- Modify: `src/components/Hero/Hero.tsx`

**Interfaces:**
- Consumes: Framer Motion `motion`, `useScroll`, `useTransform`, `useReducedMotion`.
- Produces: Animated top blob (R&rarr;L) and bottom blob (L&rarr;R), plus parallax scroll delay on intro text block.

- [ ] **Step 1: Implement animated gradient blobs in `Hero.tsx`**
  Add two absolute motion divs behind the Hero content:
  - Top-Right Blob (Indigo): Animates from `x: 80, opacity: 0.15` to `x: -40, opacity: 0.25` during reveal.
  - Bottom-Left Blob (Cyan): Animates from `x: -80, opacity: 0.1` to `x: 50, opacity: 0.2` in reverse.

- [ ] **Step 2: Add scroll parallax delay to intro text container**
  Use Framer Motion's `useScroll()` and `useTransform(scrollYProgress, [0, 1], [0, 60])` on the text column (`Hi, I'm Zyk`, Role, CTA buttons) to give it a slight, organic lag relative to the desk scene as the user scrolls.

- [ ] **Step 3: Run build verification**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/Hero/Hero.tsx
  git commit -m "feat(hero): add reverse-translating gradient blobs and scroll parallax depth"
  ```

---

### Task 3: Featured Projects & "Other Noteworthy Projects" Grid

**Files:**
- Modify: `src/components/sections/ProjectsSection.tsx`

**Interfaces:**
- Consumes: `ImageProjectPreview`, `TechIcon`.
- Produces: Focused sticky software dev showcase (Rent2Reuse) + `OtherProjectsGrid` component rendering secondary dev projects with GitHub/Demo links.

- [ ] **Step 1: Refactor `PROJECTS` in `ProjectsSection.tsx`**
  Retain Rent2Reuse as the primary featured sticky project. Relocate School Paper and Restoration data to `GallerySection.tsx` (Task 4).
  Add second dev project showcase or clean placeholder dev project.

- [ ] **Step 2: Implement `OtherProjectsGrid` component**
  Define `OTHER_PROJECTS` array containing secondary software works, CLI tools, and web apps with:
  - Title, blurb, tech tags, GitHub URL, live demo URL.
  Render as a 2-to-3 column responsive grid of glassmorphic cards:
  `rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-zyk-accent/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]`.

- [ ] **Step 3: Update section headers and typography**
  Use `// 01. FEATURED WORK` and `// 02. OTHER BUILDS` with `JetBrains Mono` and gradient headline styling.

- [ ] **Step 4: Run build verification**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/sections/ProjectsSection.tsx
  git commit -m "feat(projects): focus featured work on software dev and add other noteworthy projects grid"
  ```

---

### Task 4: Creative & Visual Lab Spotlight Cards & Dark Glassmorphism

**Files:**
- Modify: `src/components/sections/GallerySection.tsx`

**Interfaces:**
- Consumes: `SchoolPaperFlipbook`, `ImageProjectPreview`, existing gallery item data.
- Produces: Dedicated Creative Lab with School Paper Flipbook spotlight, Vintage Poster Restoration spotlight, and filterable dark-glass media grid.

- [ ] **Step 1: Add spotlight cards at the top of `GallerySection.tsx`**
  Render two featured cards in a 2-column spotlight grid:
  1. **School Paper Magazine:** Includes preview cover, metadata, and an "Open Flipbook &rarr;" button that launches `SchoolPaperFlipbook`.
  2. **Vintage Poster Restoration:** Includes before/after comparison cover, stats, and a "View Case Study &rarr;" button that launches `ImageProjectPreview`.

- [ ] **Step 2: Update gallery card styles and category filter bar**
  Apply the deep-tech glassmorphism styling:
  - Section header: `// 03. CREATIVE & VISUAL LAB`.
  - Filter pills: Active pill `bg-zyk-accent/20 text-zyk-accent border-zyk-accent/40`, inactive `bg-white/5 border-white/10 text-slate-300 hover:bg-white/10`.
  - Cards: `border border-white/10 bg-slate-900/60 rounded-2xl overflow-hidden hover:border-zyk-accent/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.12)]`.

- [ ] **Step 3: Run build verification**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/sections/GallerySection.tsx
  git commit -m "feat(gallery): add flipbook and restoration spotlights to creative lab with dark glass styling"
  ```

---

### Task 5: Animated Experience Timeline & 6-Category Tech Stack

**Files:**
- Modify: `src/components/sections/ScrollSections.tsx`

**Interfaces:**
- Consumes: `TechChip`, `DesignToolChip`, `useReveal`.
- Produces: 4-stage vertical timeline with animated SVG scroll spine + complete 6-category tech stack.

- [ ] **Step 1: Update `WORK_EXPERIENCE` data**
  Incorporate the user's 4 roles:
  1. Data Annotator Intern | Innodata Knowledge Services, Inc. (Feb 2026 – Apr 2026)
  2. Graphics Artist | Upwork / Freelance (2024 – 2025)
  3. Content Operations Support | Project-Based (Feb 2024 – May 2024)
  4. Graphics Artist | Island Artz Printing and Services (Aug 2021 – Sep 2023)

- [ ] **Step 2: Build animated vertical timeline component**
  Replace the horizontal line with a vertical timeline featuring:
  - An animated vertical spine line (`scaleY: 1` on scroll).
  - Glowing milestone indicator nodes with subtle pulse rings.
  - Staggered glassmorphic role cards with company name, period, role, description, and skill badges.

- [ ] **Step 3: Build 6-category Developer & Creative Toolkit**
  Implement the 6 categories:
  - Languages (JS, TS, Python, Java, C#, C)
  - Frontend (React, Next.js, React Native/Expo, Vite, HTML5, CSS3, Tailwind CSS, Shadcn)
  - Backend & APIs (Node.js, Flask, RESTful APIs, .NET)
  - Databases (Firebase/Firestore, MySQL, NoSQL)
  - Developer & AI Tools (Git, GitHub, VS Code, Claude Code, GitHub Copilot, Antigravity)
  - UI/UX & Creative (Figma, UI Prototyping, Interface Design, Photoshop, Illustrator, InDesign, Canva)

- [ ] **Step 4: Run build verification**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/sections/ScrollSections.tsx
  git commit -m "feat(journey): add animated vertical experience timeline and 6-category tech stack"
  ```

---

### Task 6: Navigation, Contact Section & Final End-to-End Verification

**Files:**
- Modify: `src/components/NavBar/NavBar.tsx`
- Modify: `src/components/sections/ScrollSections.tsx` (ContactSection)

**Interfaces:**
- Consumes: All updated section anchors and labels.
- Produces: Polished end-to-end navigation, consistent contact section styling, and zero build warnings.

- [ ] **Step 1: Update `NAV_ITEMS` in `NavBar.tsx`**
  Verify labels: `Home (#home)`, `Work (#projects)`, `Creative Lab (#gallery)`, `Journey (#journey)`, `Contact (#contact)`.
  Ensure active-state scroll spy highlights properly.

- [ ] **Step 2: Polish Contact section header in `ScrollSections.tsx`**
  Update eyebrow to `// 05. CONTACT` and unify card container with deep-tech dark glass styling.

- [ ] **Step 3: Run comprehensive verification**
  Run: `npm run build`
  Expected: Zero TypeScript errors, zero bundling issues.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/NavBar/NavBar.tsx src/components/sections/ScrollSections.tsx
  git commit -m "feat(nav): synchronize navigation anchors and polish contact section aesthetic"
  ```
