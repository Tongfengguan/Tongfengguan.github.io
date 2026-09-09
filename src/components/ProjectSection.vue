<script setup lang="ts">
import type { Project } from '../data/portfolio'

defineProps<{ project: Project; index: number }>()
</script>

<template>
  <article class="project" data-reveal>
    <a :href="project.url" target="_blank" rel="noopener noreferrer" class="project-link">
      <span class="project-index mono">{{ String(index + 1).padStart(2, '0') }}</span>
      <div class="project-name">
        <span class="mono">{{ project.category }}</span>
        <h3>{{ project.title }}</h3>
      </div>
      <div class="project-detail">
        <p>{{ project.description }}</p>
        <ul aria-label="Technology stack">
          <li v-for="tech in project.tech" :key="tech">{{ tech }}</li>
        </ul>
      </div>
      <span class="project-arrow arrow" aria-hidden="true">↗</span>
    </a>
  </article>
</template>

<style scoped>
.project {
  border-bottom: 1px solid var(--line);
}
.project-link {
  display: grid;
  grid-template-columns: 2rem 1fr 1.25fr 1.5rem;
  gap: 1.5rem;
  align-items: start;
  padding: 2.25rem 0.75rem;
}
.project-link:hover,
.project-link:focus-visible {
  background: var(--surface);
}
.project-index {
  padding-top: 0.15rem;
  color: var(--muted);
}
.project-name > span {
  color: var(--muted);
  font-size: 0.6rem;
}
h3 {
  margin-top: 0.45rem;
  font-size: clamp(1.15rem, 2.2vw, 1.4rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.35;
}
.project-detail p {
  color: var(--muted);
  font-size: 0.85rem;
  max-width: 25rem;
}
.project-detail ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  margin-top: 1rem;
  list-style: none;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.65rem;
}
.project-arrow {
  color: var(--accent);
  font-size: 1.2rem;
}
@media (max-width: 700px) {
  .project-link {
    grid-template-columns: 1.4rem 1fr 1rem;
    gap: 1rem;
    padding: 1.75rem 0;
  }
  .project-detail {
    grid-column: 2;
  }
  .project-arrow {
    grid-column: 3;
    grid-row: 1;
  }
}
</style>
