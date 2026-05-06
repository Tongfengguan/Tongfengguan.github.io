<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
:root {
  --bg: #09090b;
  --fg: #ffffff;
  --muted: #a1a1aa;
  --accent: #ffffff;
  --font-sans: 'Archivo', sans-serif;
  --font-mono: 'IBM+Plex+Mono', monospace;
  --font-display: 'Archivo', sans-serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --section-pad: clamp(4rem, 10vw, 10rem);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  overflow-x: hidden;
  line-height: 1.5;
}

h1, h2, h3 {
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.9;
}

a {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.3s var(--ease);
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

.mono {
  font-family: var(--font-mono);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: #27272a;
}
</style>

