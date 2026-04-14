# GEMINI.md - Project Mandates & Context

## Project Overview
This is the personal portfolio website for **TFGKK**, an XCPC/ACM enthusiast. The project is a modern, responsive single-page application (SPA) built to showcase personal projects, social links, and real-time coding statistics (specifically Codeforces).

## Core Technical Stack
- **Framework:** Vue 3 (using `<script setup>` and Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Element Plus (global import, Chinese locale)
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** Vanilla CSS (Scoped) with CSS Variables for Theme Management
- **Deployment:** GitHub Pages (serving from the `/docs` directory)

## Directory Structure
- `src/`: Core source code
  - `pages/`: Page components (routed)
  - `components/`: Reusable UI components (`MyProjects.vue`, `ProjectLinks.vue`)
  - `router/`: Routing configuration
  - `stores/`: State management
  - `assets/`: Static assets (processed by Vite)
- `public/`: Static assets (copied directly to build output)
- `docs/`: Build output directory (used for GitHub Pages deployment)

## Key Features & Logic
- **Theme Management:** Support for Light and Dark modes via CSS variables defined in `.container`.
- **Dynamic UI:**
  - Typewriter effect for bio sections.
  - Real-time clock and date display.
  - Interactive mouse-following particle effects.
  - Dynamic grid background with animation.
- **API Integration:** Fetches user rating, rank, and solved problem counts from the Codeforces API.

## Development Mandates
1. **Script Setup:** Always use `<script setup lang="ts">` for new Vue components.
2. **Styling:** Prefer Scoped CSS within `.vue` files. Use the existing CSS variable system (`--bg-color`, `--text-main`, etc.) to ensure theme compatibility.
3. **TypeScript:** Maintain strict type safety. Define interfaces for props and data structures (e.g., `Project`, `ProjectLink`).
4. **Icons:** Use SVG paths directly within components for icons to minimize external dependencies and ensure fast loading.
5. **Element Plus:** Use Element Plus components for complex UI elements like cards (`el-card`).

## Build & Deployment
- **Build Command:** `npm run build`
- **Output:** The project builds into the `docs/` folder to comply with GitHub Pages' "docs folder" deployment strategy.
- **Base Path:** The project is configured with `base: '/'` in `vite.config.ts`.

## Project Specific Constants
- **Codeforces Handle:** `tfgkk` (configured in `src/pages/index.vue`)
- **Primary Color/Accent:** `#3f72af` (Blue)
