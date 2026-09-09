<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: dark;
  --bg: #101316;
  --surface: #171c20;
  --ink: #edf1f3;
  --muted: #969fa8;
  --line: #2b333a;
  --accent: #8cddd2;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem;
}
body {
  min-width: 320px;
}
a {
  color: inherit;
  text-decoration: none;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}
a:hover {
  color: var(--accent);
}
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 5px;
  border-radius: 2px;
}
::selection {
  background: var(--accent);
  color: var(--bg);
}
.mono {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: var(--muted);
}
.section-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}
.section-heading span {
  color: var(--accent);
  margin-right: 0.7rem;
}
.arrow {
  display: inline-block;
  transition: transform 180ms var(--ease);
}
a:hover .arrow,
a:focus-visible .arrow {
  transform: translate(3px, -3px);
}
[data-reveal] {
  transition:
    opacity 440ms var(--ease),
    transform 440ms var(--ease);
}
.reveal-pending {
  opacity: 0;
  transform: translateY(16px);
}
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
  .reveal-pending {
    opacity: 1;
    transform: none;
  }
}
</style>
