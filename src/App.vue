<template>
  <router-view />
</template>

<style>
:root {
  color-scheme: light;
  --bg: #f4f1e9;
  --surface: #ebe8df;
  --surface-strong: #e3e0d6;
  --panel: #fbfaf6;
  --field: #fffefb;
  --ink: #20211e;
  --muted: #62665f;
  --line: #c9c7be;
  --control-line: #b9b9b0;
  --accent: #28705d;
  --accent-hover: #1f5f4f;
  --accent-soft: #dce9e3;
  --accent-border: #91afa4;
  --danger: #a13f34;
  --placeholder: #74776f;
  --map-glow: radial-gradient(ellipse at 40% 45%, #e3ebe5 0%, transparent 65%);
  --connection: #929c96;
  --connection-active: #28705d;
  --node-label: #f4f1e9;
  --node-surface: #f9f7f0;
  --node-shadow: #d1cec3;
  --tech-surface: #f0eee7;
  --avatar-surface: #e5eee8;
  --avatar-glow: rgb(40 112 93 / 8%);
  --node-a: #28705d;
  --node-b: #66558e;
  --node-c: #8b5c20;
  --algorithm-basic: #28705d;
  --algorithm-search: #356b91;
  --algorithm-data: #66558e;
  --algorithm-graph: #9b623a;
  --algorithm-dp: #a04d5b;
  --algorithm-string: #2d7a76;
  --algorithm-math: #8b5c20;
  --algorithm-geometry: #8a4f73;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
[data-theme='dark'] {
  color-scheme: dark;
  --bg: #111211;
  --surface: #191a18;
  --surface-strong: #20221f;
  --panel: #161715;
  --field: #10110f;
  --ink: #f1efe9;
  --muted: #9c9d96;
  --line: #33352f;
  --control-line: #464943;
  --accent: #82b8a8;
  --accent-hover: #b7d6cc;
  --accent-soft: #20302a;
  --accent-border: #3c584f;
  --danger: #e7a092;
  --placeholder: #85877f;
  --map-glow: radial-gradient(ellipse at 40% 45%, #1d2925 0%, transparent 65%);
  --connection: #4b5b56;
  --connection-active: #9dcabe;
  --node-label: #121714;
  --node-surface: #1b2420;
  --node-shadow: #090d0b;
  --tech-surface: #1d211f;
  --avatar-surface: #1c2b26;
  --avatar-glow: rgb(130 184 168 / 8%);
  --node-a: #82b8a8;
  --node-b: #b4a3d8;
  --node-c: #d7b179;
  --algorithm-basic: #82b8a8;
  --algorithm-search: #82b7d3;
  --algorithm-data: #b4a3d8;
  --algorithm-graph: #d8a477;
  --algorithm-dp: #dc929e;
  --algorithm-string: #7dbdb8;
  --algorithm-math: #d7b179;
  --algorithm-geometry: #d29abe;
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
  background: var(--bg);
  color: var(--ink);
  transition:
    background-color 180ms ease,
    color 180ms ease;
}
a {
  color: inherit;
  text-decoration: none;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
button:disabled {
  cursor: default;
  opacity: 0.35;
}
a:hover {
  color: var(--accent);
}
a:focus-visible,
button:focus-visible {
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
