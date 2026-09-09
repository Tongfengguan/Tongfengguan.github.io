<script setup lang="ts">
import { useCodeforces } from '../composables/useCodeforces'

defineProps<{ projectCount: number }>()
const { profile, status } = useCodeforces()
const avatarSrc = import.meta.env.BASE_URL + 'avatar.png'
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-main">
      <div class="intro">
        <p class="eyebrow mono">Algorithms / AI / Full stack</p>
        <h1 id="hero-title">TFGKK<span>.</span></h1>
        <div class="hero-actions">
          <a class="work-link" href="#work">View projects <span aria-hidden="true">↓</span></a>
          <a href="https://github.com/tongfengguan" target="_blank" rel="noopener noreferrer">
            GitHub <span class="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div class="portrait">
        <span class="portrait-label mono">Profile / 01</span>
        <div class="portrait-frame">
          <img
            :src="avatarSrc"
            alt="TFGKK's little ghost avatar"
            width="176"
            height="176"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <span class="portrait-label mono">TFGKK</span>
      </div>
    </div>

    <div class="metrics">
      <a
        class="metric"
        href="https://codeforces.com/profile/tfgkk"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="mono">CF rating <span aria-hidden="true">↗</span></span>
        <strong>{{ profile?.rating ?? '—' }}</strong>
      </a>
      <div class="metric">
        <span class="mono">CF rank</span>
        <strong class="rank">{{ profile?.rank ?? '—' }}</strong>
      </div>
      <a class="metric" href="#work">
        <span class="mono">Projects</span>
        <strong>{{ String(projectCount).padStart(2, '0') }}</strong>
      </a>
      <span class="sync-status mono" role="status">{{ status }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 6.5rem 0 5rem;
}
.intro {
  animation: enter 480ms var(--ease) both;
}
.eyebrow {
  color: var(--muted);
}
h1 {
  margin: 0.75rem 0 2rem;
  font-size: clamp(4.5rem, 9vw, 7rem);
  font-weight: 500;
  letter-spacing: -0.07em;
  line-height: 1.1;
}
h1 span {
  color: var(--accent);
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  font-size: 0.85rem;
  color: var(--muted);
}
.hero-actions a {
  padding: 0.7rem 0;
}
.hero-actions .work-link {
  padding-inline: 1rem;
  background: var(--ink);
  color: var(--bg);
  border-radius: 4px;
}
.work-link:hover {
  background: var(--accent);
}
.work-link span {
  margin-left: 1.25rem;
}
.portrait {
  display: grid;
  gap: 0.8rem;
  margin-right: 2rem;
  animation: enter 600ms 100ms var(--ease) both;
}
.portrait-label {
  color: var(--muted);
  font-size: 0.6rem;
}
.portrait-label:last-child {
  text-align: right;
}
.portrait-frame {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  position: relative;
}
.portrait-frame::before,
.portrait-frame::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: var(--accent);
  border-style: solid;
}
.portrait-frame::before {
  top: -1px;
  left: -1px;
  border-width: 1px 0 0 1px;
}
.portrait-frame::after {
  bottom: -1px;
  right: -1px;
  border-width: 0 1px 1px 0;
}
.portrait img {
  display: block;
  width: 176px;
  height: 176px;
  border-radius: 2px;
}
.metrics {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 10rem;
  gap: 1.5rem;
  align-items: center;
  padding: 1.6rem 0;
  border-block: 1px solid var(--line);
}
.metric {
  display: grid;
  gap: 0.5rem;
}
.metric > span,
.sync-status {
  color: var(--muted);
}
.metric strong {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 1.45rem;
  line-height: 1.6;
}
.metric .rank {
  font-family: inherit;
  font-size: 1rem;
  text-transform: capitalize;
  min-height: 2.32rem;
  display: flex;
  align-items: center;
}
.sync-status {
  font-size: 0.6rem;
  max-width: 10rem;
  text-align: right;
}
@media (max-width: 700px) {
  .hero-main {
    gap: 1rem;
    padding: 4rem 0 3rem;
  }
  .portrait {
    margin-right: 0;
  }
  .portrait img {
    width: 112px;
    height: 112px;
  }
  .metrics {
    grid-template-columns: 1fr 1.5fr 0.8fr;
    gap: 1rem;
  }
  .sync-status {
    grid-column: 1 / -1;
    text-align: left;
    max-width: none;
  }
}
@media (max-width: 460px) {
  .hero-main {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 2rem;
    padding-top: 2.5rem;
  }
  .portrait {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .portrait img {
    width: 72px;
    height: 72px;
  }
  .portrait-frame {
    order: -1;
    padding: 6px;
  }
  .portrait-label:last-child {
    display: none;
  }
  .metric strong {
    font-size: 1.25rem;
  }
  .metric .rank {
    font-size: 0.85rem;
  }
}
</style>
