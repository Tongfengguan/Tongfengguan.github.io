# GEMINI.md - Project Mandates & Context

## Project Overview
This is the personal portfolio website for **TFGKK**, an XCPC/ACM enthusiast. The project is a high-end, ultra-minimalist single-page application (SPA) built to showcase personal projects, social links, and real-time coding statistics.

## Core Technical Stack
- **Framework:** Vue 3 (using `<script setup>` and Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Design:** Ultra-Minimalist Editorial / Swiss Design
- **Typography:** Archivo (Headings), Space Grotesk (Body), IBM Plex Mono (Technical/Metadata)
- **Styling:** Vanilla CSS with a focus on negative space and typography-centric layouts.
- **Deployment:** GitHub Pages (serving from the `/docs` directory)

## Directory Structure
- `src/`: Core source code
  - `pages/`: Page components
  - `components/`: UI components (`HeroSection.vue`, `ProjectSection.vue`, etc.)
  - `router/`: Routing configuration
- `public/`: Static assets
- `docs/`: Build output directory

## Design Mandates (2026 Refresh)
1. **Editorial Minimalism:** Prioritize typography and negative space. Avoid standard UI components like cards, rounded corners, and heavy shadows.
2. **Swiss Style:** Use a strict grid system. Maintain a high-contrast, deep monochrome palette (`#09090b` / `#ffffff`).
3. **Typography as Hero:** Use massive headers for impact and small monospace text for technical data.
4. **Clean Code:** Maintain strict type safety and idiomatic Vue 3 patterns.

## Build & Deployment
- **Build Command:** `npm run build`
- **Output:** Builds into `docs/` for GitHub Pages.
- **Base Path:** `/`

## Project Specific Constants
- **Codeforces Handle:** `tfgkk`
- **Primary Aesthetic:** High-end, precise, and technical.
